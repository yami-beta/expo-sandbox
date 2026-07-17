import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { setStorageItemAsync, useStorageState } from "./useStorageState";

// expo-secure-store は auth 機能専用のためこのファイル内だけでモックする
// (docs/testing.md の方針: expo-sqlite/kv-store のようにグローバル常駐する依存ではない)。
// in-memory な Map で永続化を模擬し、get/set/delete が反映されることを検証する。
jest.mock("expo-secure-store", () => {
  const store = new Map<string, string>();
  return {
    __esModule: true,
    getItemAsync: jest.fn(async (key: string): Promise<string | null> => store.get(key) ?? null),
    setItemAsync: jest.fn(async (key: string, value: string): Promise<void> => {
      store.set(key, value);
    }),
    deleteItemAsync: jest.fn(async (key: string): Promise<void> => {
      store.delete(key);
    }),
  };
});

function createFakeLocalStorage(): Storage {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
    key: () => null,
    length: 0,
  } as Storage;
}

describe("useStorageState", () => {
  const originalOS = Platform.OS;
  const originalLocalStorage = globalThis.localStorage;

  afterEach(() => {
    Platform.OS = originalOS;
    globalThis.localStorage = originalLocalStorage;
  });

  describe("native (expo-secure-store)", () => {
    beforeEach(() => {
      Platform.OS = "ios";
      jest.clearAllMocks();
    });

    it("マウント直後は isLoading: true, value: null で始まり、ストレージの既存値読み込み後に isLoading: false になる", async () => {
      // @testing-library/react-native v14 の renderHook は非同期 API で、await した時点で
      // 既にマウント時の effect (と、すぐ解決するモック Promise) まで flush されてしまうため、
      // 素朴に「すぐ解決するモック」を使うと isLoading: true の瞬間を観測できない。
      // ここでは getItemAsync の解決タイミングを明示的に制御し、isLoading: true → false の
      // 遷移そのものを検証する。
      let resolveGetItem!: (value: string | null) => void;
      jest.mocked(SecureStore.getItemAsync).mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveGetItem = resolve;
          }),
      );

      const { result } = await renderHook(() => useStorageState("native-initial-key"));

      // getItemAsync がまだ解決していないため isLoading: true, value: null のまま
      expect(result.current[0]).toEqual([true, null]);

      await act(async () => {
        resolveGetItem("preset-value");
      });

      expect(result.current[0]).toEqual([false, "preset-value"]);
      expect(SecureStore.getItemAsync).toHaveBeenCalledWith("native-initial-key");
    });

    it("setValue で値を更新すると SecureStore.setItemAsync が呼ばれ value が反映される", async () => {
      const { result } = await renderHook(() => useStorageState("native-update-key"));

      await waitFor(() => {
        expect(result.current[0]).toEqual([false, null]);
      });

      await act(() => {
        result.current[1]("new-token");
      });

      // setValue は同期的に dispatch するため、ローカル state は即座に反映される
      expect(result.current[0]).toEqual([false, "new-token"]);

      await waitFor(() => {
        expect(SecureStore.setItemAsync).toHaveBeenCalledWith("native-update-key", "new-token");
      });
    });

    it("setValue(null) で削除すると SecureStore.deleteItemAsync が呼ばれ value が null になる", async () => {
      await SecureStore.setItemAsync("native-delete-key", "will-be-deleted");
      const { result } = await renderHook(() => useStorageState("native-delete-key"));

      await waitFor(() => {
        expect(result.current[0]).toEqual([false, "will-be-deleted"]);
      });

      await act(() => {
        result.current[1](null);
      });

      expect(result.current[0]).toEqual([false, null]);

      await waitFor(() => {
        expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("native-delete-key");
      });
    });
  });

  describe("web (localStorage)", () => {
    beforeEach(() => {
      Platform.OS = "web";
      globalThis.localStorage = createFakeLocalStorage();
    });

    it("localStorage の既存値を読み込み、isLoading: false / value がその値になる", async () => {
      // localStorage は同期 API のため、renderHook を await した時点で読み込みが完了しており
      // (native と異なり) isLoading: true の瞬間を安定して観測することはできない。
      // ここでは「最終的にストレージの値が反映される」という契約を検証する。
      globalThis.localStorage.setItem("web-initial-key", "preset-value");

      const { result } = await renderHook(() => useStorageState("web-initial-key"));

      await waitFor(() => {
        expect(result.current[0]).toEqual([false, "preset-value"]);
      });
    });

    it("setValue で値を更新すると localStorage に書き込まれる", async () => {
      const { result } = await renderHook(() => useStorageState("web-update-key"));

      await waitFor(() => {
        expect(result.current[0]).toEqual([false, null]);
      });

      await act(() => {
        result.current[1]("new-token");
      });

      expect(result.current[0]).toEqual([false, "new-token"]);
      expect(globalThis.localStorage.getItem("web-update-key")).toBe("new-token");
    });

    it("setValue(null) で削除すると localStorage から削除される", async () => {
      globalThis.localStorage.setItem("web-delete-key", "will-be-deleted");
      const { result } = await renderHook(() => useStorageState("web-delete-key"));

      await waitFor(() => {
        expect(result.current[0]).toEqual([false, "will-be-deleted"]);
      });

      await act(() => {
        result.current[1](null);
      });

      expect(result.current[0]).toEqual([false, null]);
      expect(globalThis.localStorage.getItem("web-delete-key")).toBeNull();
    });
  });

  describe("setStorageItemAsync", () => {
    it("native では value が null なら SecureStore.deleteItemAsync、非 null なら setItemAsync を呼ぶ", async () => {
      Platform.OS = "ios";
      jest.clearAllMocks();

      await setStorageItemAsync("direct-key", "direct-value");
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith("direct-key", "direct-value");

      await setStorageItemAsync("direct-key", null);
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("direct-key");
    });

    it("web では localStorage.setItem/removeItem を直接呼ぶ", async () => {
      Platform.OS = "web";
      const fake = createFakeLocalStorage();
      globalThis.localStorage = fake;

      await setStorageItemAsync("direct-web-key", "direct-value");
      expect(fake.getItem("direct-web-key")).toBe("direct-value");

      await setStorageItemAsync("direct-web-key", null);
      expect(fake.getItem("direct-web-key")).toBeNull();
    });
  });
});
