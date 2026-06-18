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
  // jest-expo 既定の許可リストへ @lingui とその ESM 依存 (@messageformat 等) を加え、変換対象に含める。
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@lingui/.*|@messageformat/.*|messageformat))",
  ],
};
