// https://docs.expo.dev/guides/using-eslint/
import { defineConfig } from "eslint/config";
import expoConfig from "eslint-config-expo/flat.js";
import oxlint from "eslint-plugin-oxlint";

export default defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  ...oxlint.buildFromOxlintConfigFile("./.oxlintrc.json"),
]);
