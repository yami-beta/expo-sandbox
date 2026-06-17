#!/usr/bin/env node

/**
 * `eas-update-cleanup` コマンドの bin エントリ。
 *
 * 環境変数:
 *   BRANCH    対象ブランチ              (既定 development)
 *   MIN_KEEP  RV ごとに残す最新件数     (既定 10)
 *   DRY_RUN   "false" 以外なら削除せず計画のみ出力 (既定 true = 安全側)
 *
 * Node のネイティブ Type Stripping (Node >= 22.18) で .ts のまま実行される。
 */

import { easJson } from "../shared/eas.ts";
import { runCleanup } from "./command.ts";

const branch = process.env.BRANCH ?? "development";
const minKeep = Number(process.env.MIN_KEEP ?? "10");
const dryRun = (process.env.DRY_RUN ?? "true").toLowerCase() !== "false";

runCleanup({ branch, minKeep, dryRun }, { easJson })
  .then((result) => {
    process.exitCode = result.exitCode;
  })
  .catch((err: unknown) => {
    console.error("[eas-update-cleanup] 想定外のエラー:", err);
    process.exitCode = 1;
  });
