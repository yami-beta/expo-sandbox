import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

// `eas update:list` の 1 ページは最大 50 件。大きめのバッファを確保しておく
const MAX_BUFFER = 64 * 1024 * 1024;

/**
 * eas CLI を JSON モードで実行し stdout を JSON.parse して返す。
 * `--json` は非 JSON メッセージを stderr に出し `--non-interactive` を含意する。
 *
 * 戻り値は CLI バージョンにより形状が揺れるため `unknown` とし、呼び出し側で
 * 安全に読み出す。
 */
export async function easJson(args: readonly string[]): Promise<unknown> {
  const { stdout } = await execFileAsync("eas", [...args, "--json", "--non-interactive"], {
    encoding: "utf8",
    maxBuffer: MAX_BUFFER,
  });
  const parsed: unknown = JSON.parse(stdout);
  return parsed;
}

/** `runCleanup` などへ注入する easJson の型。 */
export type EasJson = (args: readonly string[]) => Promise<unknown>;
