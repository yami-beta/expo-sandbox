// https://docs.expo.dev/guides/using-eslint/
import tseslint from "typescript-eslint";
// import { defineConfig } from "eslint/config";
import expoConfig from "eslint-config-expo/flat.js";

export default tseslint.config(
  expoConfig,
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          fixStyle: "inline-type-imports",
        },
      ],
    },
  },
  {
    ignores: ["dist/*"],
  },
);

// export default defineConfig([
//   expoConfig,
//   {
//     ignores: ["dist/*"],
//   },
// ]);
