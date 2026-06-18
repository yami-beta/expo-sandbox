const expoPreset = require("jest-expo/jest-preset");

// @lingui/* と @messageformat/* は ESM (.mjs) のみ提供で、jest-expo の既定では変換対象外 (= ignore)
// になり "Cannot use import statement outside a module" で落ちる。これらを変換対象へ含めるには、
// 第1要素 (変換許可リストの negative lookahead) の許可リストへ追記する必要がある
// (配列への append は ignore を増やす方向にしか働かず、既に ignore 済みの依存を変換対象に戻せない)。
//
// transformIgnorePatterns は preset とマージされず置換されるため、第2要素以降
// (.pnpm 許可や reanimated/plugin・@react-native/babel-preset の再 ignore) はそのまま残す。
const ESM_PACKAGES = "@lingui|@messageformat|messageformat";
const [allowlistPattern, ...reIgnorePatterns] = expoPreset.transformIgnorePatterns;
// パッケージ名や順序ではなく構造 (negative lookahead の末尾 "))") に依存させて注入する。
// 想定構造でなければ即エラーにし、preset 変更時に silent no-op で気付けなくなるのを防ぐ。
const patchedAllowlist = allowlistPattern.replace(/\)\)$/, `|${ESM_PACKAGES}))`);
if (patchedAllowlist === allowlistPattern) {
  throw new Error(
    "jest-expo の transformIgnorePatterns 構造が想定 (末尾 '))') と異なります。@lingui 用の追記方法を見直してください。",
  );
}

/** @type {import('jest').Config} */
module.exports = {
  // jest-expo: babel-preset-expo / Expo モジュールのモック / testEnvironment などの既定を継承
  // (apps/sandbox/babel.config.js を使うため @lingui の macro 変換もテストで効く)
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest-setup.ts"],
  // @lingui/* は ESM (.mjs) のみ提供。jest-expo の transform は js/jsx/ts/tsx しか対象にしないため、
  // .mjs を babel-jest で変換する設定を追加する (preset の transform とマージされる)。
  transform: {
    "^.+\\.mjs$": "babel-jest",
  },
  transformIgnorePatterns: [patchedAllowlist, ...reIgnorePatterns],
};
