# テスト構成

ユニット / コンポーネントテストの構成。UI の E2E（Maestro）は [`maestro.md`](./maestro.md) を参照。

monorepo ではパッケージの性質に応じてテストランナーを使い分ける。

| パッケージ | ランナー | 理由 |
| --- | --- | --- |
| `apps/sandbox` | **jest-expo**（+ `@testing-library/react-native`） | Expo / React Native を実行できる公式プリセット。`babel.config.js`（`babel-preset-expo` + lingui macro）をそのまま再利用でき、ユーティリティ・hooks・コンポーネント描画まで一貫してテストできる |
| `packages/tooling` | **Vitest** | Node スクリプト用。`@types/node` / Vitest をアプリから分離する方針（[`tooling`](../packages/tooling)） |

横断実行は `pnpm -r run test`、CI（`ci.yml` の `test` ジョブ）でも同じコマンドを走らせる。

## 実行コマンド

```bash
# 全ワークスペース横断（sandbox=jest / tooling=vitest）
pnpm -r run test

# apps/sandbox のみ
pnpm --dir apps/sandbox run test
pnpm --dir apps/sandbox run test:watch   # watch モード
```

## apps/sandbox の方針（jest-expo）

### テストの置き場所

機能ディレクトリへ **co-location** する（`CLAUDE.md` のファイル配置方針に従う）。テスト対象と同じ
ディレクトリに `*.test.ts` / `*.test.tsx` を置く。

```
src/i18n/formatters.ts
src/i18n/formatters.test.ts
src/components/themed-text/ThemedText.tsx
src/components/themed-text/ThemedText.test.tsx
```

### テスト API

- テスト関数は `@jest/globals` から明示 import する（グローバル汚染を避け、`packages/tooling` の
  `"vitest"` 明示 import と作法を揃える）。

  ```ts
  import { describe, expect, it, jest } from "@jest/globals";
  ```

- `render` / `renderHook` / `fireEvent` などは `@testing-library/react-native` から直接 import する。
  **v14 以降これらは非同期 API（Promise を返す）** なので `await` すること。

  ```ts
  import { renderHook, screen } from "@testing-library/react-native";

  const { result } = await renderHook(() => useFoo());
  ```

- ビルトインマッチャ（`toBeOnTheScreen` / `toHaveStyle` など）は `jest-setup.ts` で登録済み。

### Provider が必要なコンポーネント / hook

`ThemeProvider` や `I18nProvider` に依存するものは、共通ユーティリティ
`src/test-utils/render.tsx` の `renderWithProviders` でラップして描画する。

```tsx
import { screen } from "@testing-library/react-native";
import { renderWithProviders } from "../../test-utils/render";

await renderWithProviders(<ThemedText>こんにちは</ThemedText>);
expect(screen.getByText("こんにちは")).toBeOnTheScreen();
```

### モックの方針

- Expo モジュール（`expo-haptics` など）は各テストで `jest.mock()` する。`jest.mocked()` で型を付ける。
- `expo-sqlite/kv-store` はネイティブ依存のため、`jest-setup.ts` でインメモリ実装に差し替え済み
  （`ThemeProvider` がテーマ永続化に使う）。
- 設定は `apps/sandbox/jest.config.js`。`@lingui/*` などの ESM パッケージは `transformIgnorePatterns`
  の許可リスト + `.mjs` 用 `transform` で変換対象に含めている。新たな ESM 依存で
  `Cannot use import statement outside a module` / `Unexpected token 'export'` が出たら、
  そのパッケージ名を許可リストへ追加する。

### lingui を使うロジックのテスト

翻訳カタログ（`.po`）は読み込まず、`@lingui/core` の `setupI18n()` でロケールだけを活性化して
Intl 由来の出力（日付・数値フォーマットなど）を検証する。`.po` の読み込みや
`expo-localization` のデバイスロケール検出（`src/i18n.ts` の `detectLocale` 等）をテストする場合は、
`expo-localization` のモックと `.po` import のモック（`moduleNameMapper` 等）が別途必要になる。
