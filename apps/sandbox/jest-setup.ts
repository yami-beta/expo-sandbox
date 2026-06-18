import { jest } from "@jest/globals";

// @testing-library/react-native v14 のビルトインマッチャ (toBeOnTheScreen /
// toHaveTextContent / toHaveStyle など) を全テストへ登録する。
// main エントリの import 副作用で expect.extend が走り、併せて型拡張
// (@jest/expect と global jest namespace) も有効化される。
import "@testing-library/react-native";

// expo-sqlite/kv-store はネイティブ SQLite に依存し jest 環境では動かないため、
// ThemeProvider などが使う同期 KV API をインメモリ実装でモックする。
jest.mock("expo-sqlite/kv-store", () => {
  const store = new Map<string, string>();
  return {
    __esModule: true,
    default: {
      getItemSync: (key: string): string | null => store.get(key) ?? null,
      setItemSync: (key: string, value: string): void => {
        store.set(key, value);
      },
      removeItemSync: (key: string): void => {
        store.delete(key);
      },
      clearSync: (): void => {
        store.clear();
      },
    },
  };
});
