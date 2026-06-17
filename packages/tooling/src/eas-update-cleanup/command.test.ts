import { describe, expect, it, vi, type Mock } from "vitest";
import type { EasJson } from "../shared/eas.ts";
import { runCleanup } from "./command.ts";

type Shape = "currentPage" | "array";

/** runtimeVersion を共有する group を新しい順 (prefix0 が最新) で生成する。 */
function groupsForRuntime(runtimeVersion: string, count: number, prefix: string): unknown[] {
  return Array.from({ length: count }, (_, i) => ({ group: `${prefix}${i}`, runtimeVersion }));
}

/**
 * `update:list` を offset に応じてページングで返し、`update:delete` を成功扱い
 * (deleteFails に含まれる group は失敗) で応答するフェイク easJson。
 *
 * 返す JSON の具体例 (allGroups の各要素が 1 つの update group):
 *   - update:list / 既定 shape="currentPage":
 *       { currentPage: [{ group: "a0", runtimeVersion: "1.0.0" }, ...] }
 *   - update:list / shape="array" (CLI バージョン差異の配列直返しを模す):
 *       [{ group: "a0", runtimeVersion: "1.0.0" }, ...]
 *   - update:delete: 成功 → { ok: true } / 失敗 → stderr 付き Error を throw
 */
function makeEas(
  allGroups: readonly unknown[],
  options: { shape?: Shape; deleteFails?: ReadonlySet<string> } = {},
): Mock<EasJson> {
  const shape = options.shape ?? "currentPage";
  const deleteFails = options.deleteFails ?? new Set<string>();
  const impl: EasJson = async (args) => {
    const cmd = args[0];
    if (cmd === "update:list") {
      const limit = Number(args[args.indexOf("--limit") + 1]);
      const offset = Number(args[args.indexOf("--offset") + 1]);
      const slice = allGroups.slice(offset, offset + limit);
      return shape === "array" ? slice : { currentPage: slice };
    }
    if (cmd === "update:delete") {
      const id = args[1];
      if (id !== undefined && deleteFails.has(id)) {
        throw Object.assign(new Error(`delete failed: ${id}`), { stderr: `stderr: ${id}` });
      }
      return { ok: true };
    }
    throw new Error(`unexpected eas args: ${args.join(" ")}`);
  };
  return vi.fn<EasJson>(impl);
}

// vi.fn の呼び出し履歴 spy.mock.calls は「1 回の呼び出しごとの引数タプル」の配列。
// easJson は引数を 1 つ (string 配列) だけ取るので、各呼び出しの call[0] が
// eas へ渡した args 配列そのもの。その先頭要素 (サブコマンド名) で絞り込み、
// 指定コマンド (例: "update:list") の呼び出しだけを取り出す。
function callsOf(spy: Mock<EasJson>, cmd: string): readonly (readonly string[])[] {
  return spy.mock.calls.map((call) => call[0]).filter((args) => args[0] === cmd);
}

// update:delete の各呼び出しから削除対象の group id (args[1] = `eas update:delete <id>`) を取り出す。
function deleteIds(spy: Mock<EasJson>): (string | undefined)[] {
  return callsOf(spy, "update:delete").map((args) => args[1]);
}

describe("runCleanup", () => {
  it("runtimeVersion ごとに最新 minKeep 件を残し、残りを削除する", async () => {
    const rv1 = groupsForRuntime("1.0.0", 12, "a"); // a0..a11 (a0 が最新)
    const rv2 = groupsForRuntime("2.0.0", 3, "b"); // b0..b2
    const eas = makeEas([...rv1, ...rv2]);

    const result = await runCleanup(
      { branch: "development", minKeep: 10, dryRun: false },
      { easJson: eas },
    );

    expect(result.targeted).toBe(2);
    expect(result.ok).toBe(2);
    expect(result.failed).toBe(0);
    expect(result.exitCode).toBe(0);
    // rv1 は最新10件 (a0..a9) を保護し a10/a11 を削除。rv2 は3件のみで削除なし
    expect(deleteIds(eas)).toEqual(["a10", "a11"]);
  });

  it("DRY_RUN では削除せず計画のみ出力する", async () => {
    const eas = makeEas(groupsForRuntime("1.0.0", 12, "a"));

    const result = await runCleanup(
      { branch: "development", minKeep: 10, dryRun: true },
      { easJson: eas },
    );

    expect(result.targeted).toBe(2);
    expect(result.ok).toBe(0);
    expect(result.exitCode).toBe(0);
    expect(deleteIds(eas)).toEqual([]);
  });

  it("削除失敗を数え、失敗があれば exitCode=1 を返す", async () => {
    const eas = makeEas(groupsForRuntime("1.0.0", 12, "a"), { deleteFails: new Set(["a10"]) });

    const result = await runCleanup(
      { branch: "development", minKeep: 10, dryRun: false },
      { easJson: eas },
    );

    expect(result.targeted).toBe(2);
    expect(result.ok).toBe(1);
    expect(result.failed).toBe(1);
    expect(result.exitCode).toBe(1);
    expect(deleteIds(eas)).toEqual(["a10", "a11"]);
  });

  it("MIN_KEEP が不正なら eas を呼ばず exitCode=1 で終了する", async () => {
    for (const minKeep of [0, -1, 1.5, Number.NaN]) {
      const eas = makeEas(groupsForRuntime("1.0.0", 12, "a"));

      const result = await runCleanup(
        { branch: "development", minKeep, dryRun: false },
        { easJson: eas },
      );

      expect(result.exitCode).toBe(1);
      expect(result.reason).toBe("invalid-min-keep");
      expect(eas).not.toHaveBeenCalled();
    }
  });

  it("group/runtimeVersion が欠ける項目は削除対象から保護する", async () => {
    const items: unknown[] = [
      ...groupsForRuntime("1.0.0", 10, "a"), // a0..a9
      { group: "missing-rv" }, // runtimeVersion 欠損 → 保護
      { runtimeVersion: "1.0.0" }, // group 欠損 → 保護
      { group: "a10", runtimeVersion: "1.0.0" },
    ];
    const eas = makeEas(items);

    const result = await runCleanup(
      { branch: "development", minKeep: 10, dryRun: false },
      { easJson: eas },
    );

    // valid は a0..a10 の 11 件。最新10件を保護し a10 のみ削除。欠損2件は触らない
    expect(result.targeted).toBe(1);
    expect(deleteIds(eas)).toEqual(["a10"]);
  });

  it("50 件超をページングし、最終ページ (< limit) で停止する", async () => {
    const eas = makeEas(groupsForRuntime("1.0.0", 60, "a")); // a0..a59

    const result = await runCleanup(
      { branch: "development", minKeep: 10, dryRun: true },
      { easJson: eas },
    );

    expect(result.targeted).toBe(50); // 60 - 10
    const lists = callsOf(eas, "update:list");
    expect(lists.length).toBe(2); // offset 0 と 50 の 2 ページで停止 (3 ページ目は呼ばない)
    expect(lists[0]).toEqual([
      "update:list",
      "--branch",
      "development",
      "--limit",
      "50",
      "--offset",
      "0",
    ]);
    expect(lists[1]).toEqual([
      "update:list",
      "--branch",
      "development",
      "--limit",
      "50",
      "--offset",
      "50",
    ]);
  });

  it("配列直返し形状を受理し、重複 group を排除する", async () => {
    const groups = groupsForRuntime("1.0.0", 12, "a"); // a0..a11
    const withDup = [...groups, { group: "a0", runtimeVersion: "1.0.0" }]; // a0 を重複させる
    const eas = makeEas(withDup, { shape: "array" });

    const result = await runCleanup(
      { branch: "development", minKeep: 10, dryRun: true },
      { easJson: eas },
    );

    // 重複排除で 12 件 → 最新10件保護 → 2 件が削除対象 (排除されなければ 3 件になる)
    expect(result.targeted).toBe(2);
  });
});
