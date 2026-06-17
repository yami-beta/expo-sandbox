/**
 * EAS Update の古い update group を定期削除するコマンド本体 (count-only 方式)。
 *
 * 背景: main への push で `eas update --auto --branch development` を実行しており
 * (`.github/workflows/eas-update.yml`)、`development` ブランチに update group が
 * 無限に積み上がる。EAS には自動リテンション機能が無いため自前で掃除する。
 *
 * 削除ルール (不変条件):
 *   runtimeVersion ごとに最新 minKeep 件を残し、それ以外を削除する。
 *   → 将来 app version を上げて runtimeVersion が分岐しても、各 RV の最新分が
 *     消えてクライアントが埋め込みバンドルにフォールバックすることを防ぐ。
 *
 * 並び順の前提:
 *   `eas update:list` はサーバ既定で「新しい順」を返す。本コマンドはこの順序を
 *   信頼し、各 RV の先頭 minKeep 件を最新として保護する (createdAt は取得しない)。
 *   万一最新が消えても元バンドルは git にあり `eas update:republish` で復元でき、
 *   次の main push で新しい update が出るため自己修復される。
 *
 * テスト容易性のため `eas` 実行は `easJson` を依存注入で受け取り、本体は
 * `process.exit` を呼ばず結果を戻り値で返す (終了コードは cli 側で設定)。
 */

import type { EasJson } from "../shared/eas.ts";

// `eas update:list --limit` はサーバ側で 50 が上限
const PAGE_SIZE = 50;
const PREFIX = "[eas-update-cleanup]";

export type RunCleanupOptions = {
  branch: string;
  /** runtimeVersion ごとに残す最新件数 */
  minKeep: number;
  /** true なら削除せず計画のみ出力 */
  dryRun: boolean;
};

export type RunCleanupDeps = {
  easJson: EasJson;
};

export type RunCleanupResult = {
  /** 削除対象として選定された件数 */
  targeted: number;
  /** 削除に成功した件数 */
  ok: number;
  /** 削除に失敗した件数 */
  failed: number;
  /** cli 側で process.exitCode に設定する値 (0 = 正常, 1 = 異常) */
  exitCode: number;
  /** 早期終了した理由 (バリデーション失敗など)。正常時は省略 */
  reason?: string;
};

/** group / runtimeVersion が揃った削除判定の対象。 */
type CandidateGroup = {
  group: string;
  runtimeVersion: string;
};

type PerRuntimeStat = {
  runtimeVersion: string;
  total: number;
  protectedCount: number;
  toDelete: number;
};

function log(message: string): void {
  console.log(`${PREFIX} ${message}`);
}

function logError(message: string): void {
  console.error(`${PREFIX} ${message}`);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/** unknown な項目から文字列フィールドを安全に読み出す。 */
function readStringField(item: unknown, key: string): string | undefined {
  if (!isRecord(item)) return undefined;
  const value = item[key];
  return typeof value === "string" ? value : undefined;
}

/** エラーオブジェクトから人が読める詳細を取り出す。 */
function errorDetail(err: unknown): string {
  if (isRecord(err)) {
    if (typeof err.stderr === "string" && err.stderr) return err.stderr;
    if (typeof err.message === "string" && err.message) return err.message;
  }
  return String(err);
}

/**
 * `update:list` の 1 ページ JSON から項目配列を取り出す。
 * `--branch` 指定時の形状は `{ ...branch, currentPage: [...] }`。
 * バージョン差異に備え配列直返しも許容する。
 */
function extractItems(page: unknown): unknown[] {
  if (Array.isArray(page)) return page;
  if (isRecord(page) && Array.isArray(page.currentPage)) return page.currentPage;
  return [];
}

/**
 * ブランチ上の全 update group をページングで集める (新しい順を維持)。
 * group id で重複排除する。group が取れない項目は捨てず保持し、下流の保護扱い +
 * skipped 件数計上に乗せる (形状ズレを「0 件取得」ではなく「保護した N 件」として
 * 可視化するため)。
 */
async function collectGroups(
  branch: string,
  easJson: EasJson,
): Promise<{ items: unknown[]; firstPageRaw: unknown }> {
  const collected: unknown[] = [];
  let offset = 0;
  let firstPageRaw: unknown;
  for (;;) {
    const page = await easJson([
      "update:list",
      "--branch",
      branch,
      "--limit",
      String(PAGE_SIZE),
      "--offset",
      String(offset),
    ]);
    if (offset === 0) firstPageRaw = page;
    const items = extractItems(page);
    collected.push(...items);
    if (items.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }

  const seen = new Set<string>();
  const unique: unknown[] = [];
  for (const item of collected) {
    const id = readStringField(item, "group");
    if (id === undefined) {
      unique.push(item);
      continue;
    }
    if (seen.has(id)) continue;
    seen.add(id);
    unique.push(item);
  }
  return { items: unique, firstPageRaw };
}

/**
 * group 配列 (新しい順) から削除対象を決定する。
 * runtimeVersion ごとに先頭 minKeep 件 (= 最新) を保護し、残りを削除対象とする。
 * 入力の並び順を「新しい順」として信頼するためソートはしない。
 */
function selectGroupsToDelete(
  groups: readonly CandidateGroup[],
  minKeep: number,
): { toDelete: CandidateGroup[]; perRuntime: PerRuntimeStat[] } {
  const byRuntime = new Map<string, CandidateGroup[]>();
  for (const g of groups) {
    const list = byRuntime.get(g.runtimeVersion) ?? [];
    list.push(g);
    byRuntime.set(g.runtimeVersion, list);
  }

  const toDelete: CandidateGroup[] = [];
  const perRuntime: PerRuntimeStat[] = [];
  for (const [rv, list] of byRuntime) {
    const candidates = list.slice(minKeep);
    perRuntime.push({
      runtimeVersion: rv,
      total: list.length,
      protectedCount: Math.min(minKeep, list.length),
      toDelete: candidates.length,
    });
    toDelete.push(...candidates);
  }
  return { toDelete, perRuntime };
}

export async function runCleanup(
  options: RunCleanupOptions,
  deps: RunCleanupDeps,
): Promise<RunCleanupResult> {
  const { branch, minKeep, dryRun } = options;
  const { easJson } = deps;

  log(`branch=${branch} minKeep=${minKeep} dryRun=${dryRun}`);

  // minKeep が不正だと slice(minKeep) が全件削除に倒れるため、ここで早期に弾く
  if (!Number.isInteger(minKeep) || minKeep < 1) {
    logError(`MIN_KEEP は 1 以上の整数で指定してください (受け取った値: ${String(minKeep)})`);
    return { targeted: 0, ok: 0, failed: 0, exitCode: 1, reason: "invalid-min-keep" };
  }

  const { items, firstPageRaw } = await collectGroups(branch, easJson);
  log(`取得した update group 数: ${items.length}`);

  // dry-run 時は CLI バージョン差異による形状ズレ検知のため、件数 0 でも生 JSON を出す
  if (dryRun) {
    log(`update:list 1ページ目の生 JSON:\n${JSON.stringify(firstPageRaw, null, 2)}`);
  }

  if (items.length === 0) {
    log("対象なし。終了します。");
    return { targeted: 0, ok: 0, failed: 0, exitCode: 0 };
  }

  // group / runtimeVersion が欠ける項目は安全側で対象外 (= 保護)
  const valid: CandidateGroup[] = [];
  for (const item of items) {
    const group = readStringField(item, "group");
    const runtimeVersion = readStringField(item, "runtimeVersion");
    if (group !== undefined && runtimeVersion !== undefined) {
      valid.push({ group, runtimeVersion });
    }
  }
  const skipped = items.length - valid.length;
  if (skipped > 0) {
    log(`group/runtimeVersion が取れず保護した group: ${skipped} 件`);
  }

  const { toDelete, perRuntime } = selectGroupsToDelete(valid, minKeep);
  for (const r of perRuntime) {
    log(
      `RV=${r.runtimeVersion}: 合計${r.total} 保護${r.protectedCount}(最新${minKeep}) 削除対象${r.toDelete}`,
    );
  }

  log(`削除対象 group: 合計 ${toDelete.length} 件`);
  for (const g of toDelete) {
    log(`  - group=${g.group} rv=${g.runtimeVersion}`);
  }

  if (dryRun) {
    log("DRY_RUN のため削除しません。DRY_RUN=false で実削除します。");
    return { targeted: toDelete.length, ok: 0, failed: 0, exitCode: 0 };
  }

  if (toDelete.length === 0) {
    log("削除対象なし。終了します。");
    return { targeted: 0, ok: 0, failed: 0, exitCode: 0 };
  }

  let ok = 0;
  let failed = 0;
  for (const g of toDelete) {
    try {
      await easJson(["update:delete", g.group]);
      ok++;
      log(`削除成功: ${g.group}`);
    } catch (err) {
      failed++;
      logError(`削除失敗: ${g.group}\n${errorDetail(err)}`);
    }
  }
  log(`完了: 成功 ${ok} / 失敗 ${failed} / 対象 ${toDelete.length}`);
  return {
    targeted: toDelete.length,
    ok,
    failed,
    exitCode: failed > 0 ? 1 : 0,
  };
}
