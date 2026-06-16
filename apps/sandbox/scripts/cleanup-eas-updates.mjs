#!/usr/bin/env node

/**
 * EAS Update の古い update group を定期削除するスクリプト (count-only 方式)。
 *
 * 背景: main への push で `eas update --auto --branch development` を実行しており
 * (`.github/workflows/eas-update.yml`)、`development` ブランチに update group が
 * 無限に積み上がる。EAS には自動リテンション機能が無いため自前で掃除する。
 *
 * 削除ルール (不変条件):
 *   runtimeVersion ごとに最新 MIN_KEEP 件を残し、それ以外を削除する。
 *   → 将来 app version を上げて runtimeVersion が分岐しても、各 RV の最新分が
 *     消えてクライアントが埋め込みバンドルにフォールバックすることを防ぐ。
 *
 * 並び順の前提:
 *   `eas update:list` はサーバ既定で「新しい順」を返す。本スクリプトはこの順序を
 *   信頼し、各 RV の先頭 MIN_KEEP 件を最新として保護する (createdAt は取得しない)。
 *   万一最新が消えても元バンドルは git にあり `eas update:republish` で復元でき、
 *   次の main push で新しい update が出るため自己修復される。
 *
 * 設定 (環境変数):
 *   BRANCH    対象ブランチ              (既定 development)
 *   MIN_KEEP  RV ごとに残す最新件数     (既定 10)
 *   DRY_RUN   "false" 以外なら削除せず計画のみ出力 (既定 true = 安全側)
 */

import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const BRANCH = process.env.BRANCH ?? "development";
const MIN_KEEP = Number(process.env.MIN_KEEP ?? "10");
const DRY_RUN = (process.env.DRY_RUN ?? "true").toLowerCase() !== "false";

// `eas update:list --limit` はサーバ側で 50 が上限
const PAGE_SIZE = 50;
const MAX_BUFFER = 64 * 1024 * 1024;

/**
 * eas CLI を JSON モードで実行して stdout を JSON.parse して返す。
 * `--json` は非 JSON メッセージを stderr に出し --non-interactive を含意する。
 * @param {string[]} args
 * @returns {Promise<any>}
 */
async function easJson(args) {
  const { stdout } = await execFileAsync("eas", [...args, "--json", "--non-interactive"], {
    encoding: "utf8",
    maxBuffer: MAX_BUFFER,
  });
  return JSON.parse(stdout);
}

/**
 * ブランチ上の全 update group をページングで集める (新しい順を維持)。
 * `--branch` 指定時の JSON 形状は { ...branch, currentPage: [...] }。
 * バージョン差異に備え配列直返しも許容する。
 * @param {string} branch
 * @returns {Promise<{ groups: Array<Record<string, any>>, firstPageRaw: any }>}
 */
async function listAllGroups(branch) {
  /** @type {Array<Record<string, any>>} */
  const groups = [];
  let offset = 0;
  let firstPageRaw;
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
    const items = Array.isArray(page) ? page : (page?.currentPage ?? []);
    groups.push(...items);
    if (items.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }
  // group id で重複排除 (念のため。順序は維持)。
  // group が取れない要素は捨てず保持し、下流の保護扱い + skipped 件数計上に乗せる
  // (形状ズレを「0件取得」ではなく「保護した N 件」として可視化するため)。
  const seen = new Set();
  const unique = groups.filter((g) => {
    const id = g?.group;
    if (!id) return true;
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
  return { groups: unique, firstPageRaw };
}

function errDetail(err) {
  return err?.stderr || err?.message || String(err);
}

/**
 * group 配列 (新しい順) から削除対象を決定する純粋関数。
 * runtimeVersion ごとに先頭 minKeep 件 (= 最新) を保護し、残りを削除対象とする。
 * 入力の並び順を「新しい順」として信頼するためソートはしない。
 * @param {Array<{ group: string, runtimeVersion: string }>} groups
 * @param {{ minKeep: number }} opts
 */
export function selectGroupsToDelete(groups, { minKeep }) {
  /** @type {Map<string, typeof groups>} */
  const byRuntime = new Map();
  for (const g of groups) {
    const list = byRuntime.get(g.runtimeVersion) ?? [];
    list.push(g);
    byRuntime.set(g.runtimeVersion, list);
  }

  /** @type {typeof groups} */
  const toDelete = [];
  const perRuntime = [];
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

async function main() {
  console.log(`[cleanup-eas-updates] branch=${BRANCH} minKeep=${MIN_KEEP} dryRun=${DRY_RUN}`);

  // MIN_KEEP が不正だと slice(minKeep) が全件削除に倒れるため、ここで早期に弾く
  if (!Number.isInteger(MIN_KEEP) || MIN_KEEP < 1) {
    console.error(
      `[cleanup-eas-updates] MIN_KEEP は 1 以上の整数で指定してください (受け取った値: ${JSON.stringify(process.env.MIN_KEEP)})`,
    );
    process.exitCode = 1;
    return;
  }

  const { groups, firstPageRaw } = await listAllGroups(BRANCH);
  console.log(`[cleanup-eas-updates] 取得した update group 数: ${groups.length}`);

  // dry-run 時は CLI バージョン差異による形状ズレ検知のため、件数 0 でも先に生 JSON を出す
  if (DRY_RUN) {
    console.log(
      "[cleanup-eas-updates] update:list 1ページ目の生 JSON:\n" +
        JSON.stringify(firstPageRaw, null, 2),
    );
  }

  if (groups.length === 0) {
    console.log("[cleanup-eas-updates] 対象なし。終了します。");
    return;
  }

  // group / runtimeVersion が欠ける group は安全側で対象外 (= 保護)
  const valid = groups.filter((g) => g.group && g.runtimeVersion);
  const skipped = groups.length - valid.length;
  if (skipped > 0) {
    console.log(`[cleanup-eas-updates] group/runtimeVersion が取れず保護した group: ${skipped} 件`);
  }

  // runtimeVersion ごとに最新 MIN_KEEP 件を保護し、残りを削除対象に
  const { toDelete, perRuntime } = selectGroupsToDelete(valid, { minKeep: MIN_KEEP });
  for (const r of perRuntime) {
    console.log(
      `[cleanup-eas-updates] RV=${r.runtimeVersion}: 合計${r.total} 保護${r.protectedCount}(最新${MIN_KEEP}) 削除対象${r.toDelete}`,
    );
  }

  console.log(`[cleanup-eas-updates] 削除対象 group: 合計 ${toDelete.length} 件`);
  for (const g of toDelete) {
    console.log(`  - group=${g.group} rv=${g.runtimeVersion}`);
  }

  if (DRY_RUN) {
    console.log("[cleanup-eas-updates] DRY_RUN のため削除しません。DRY_RUN=false で実削除します。");
    return;
  }

  if (toDelete.length === 0) {
    console.log("[cleanup-eas-updates] 削除対象なし。終了します。");
    return;
  }

  let ok = 0;
  let failed = 0;
  for (const g of toDelete) {
    try {
      await easJson(["update:delete", g.group]);
      ok++;
      console.log(`[cleanup-eas-updates] 削除成功: ${g.group}`);
    } catch (err) {
      failed++;
      console.error(`[cleanup-eas-updates] 削除失敗: ${g.group}\n${errDetail(err)}`);
    }
  }
  console.log(`[cleanup-eas-updates] 完了: 成功 ${ok} / 失敗 ${failed} / 対象 ${toDelete.length}`);
  if (failed > 0) process.exitCode = 1;
}

// 直接実行されたときのみ main を走らせる (import 時の副作用を防ぐ)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error("[cleanup-eas-updates] 想定外のエラー:", errDetail(err));
    process.exitCode = 1;
  });
}
