import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import * as SecureStore from "expo-secure-store";
import { SessionProvider, useSessionContextInternal } from "./SessionContext";

// expo-secure-store は auth 機能専用のためこのファイル内だけでモックする。
// SessionProvider は内部で useStorageState("auth-session") を使い、native では
// SecureStore の非同期 API を経由するため、in-memory Map でモックする。
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

describe("SessionContext", () => {
  it("初期状態は isLoading: true から始まり、読み込み完了後に isLoading: false / session: null (未サインイン) になる", async () => {
    // @testing-library/react-native v14 の renderHook は非同期 API で、await した時点で
    // 既にマウント時の effect (とすぐ解決するモック Promise) まで flush されてしまうため、
    // 素朴に「すぐ解決するモック」のままだと isLoading: true の瞬間を観測できない
    // (useStorageState.test.ts と同じ理由)。ここでは getItemAsync の解決タイミングを
    // 明示的に制御し、isLoading: true → false の遷移そのものを検証する。
    let resolveGetItem!: (value: string | null) => void;
    jest.mocked(SecureStore.getItemAsync).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveGetItem = resolve;
        }),
    );

    const { result } = await renderHook(() => useSessionContextInternal(), {
      wrapper: SessionProvider,
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.session).toBeNull();

    await act(async () => {
      resolveGetItem(null);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.session).toBeNull();
  });

  it("signIn() を呼ぶと session が非 null の文字列になる", async () => {
    const { result } = await renderHook(() => useSessionContextInternal(), {
      wrapper: SessionProvider,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(() => {
      result.current.signIn();
    });

    expect(typeof result.current.session).toBe("string");
    expect(result.current.session).not.toBeNull();
  });

  it("signIn() の後に signOut() を呼ぶと session が null に戻る", async () => {
    const { result } = await renderHook(() => useSessionContextInternal(), {
      wrapper: SessionProvider,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(() => {
      result.current.signIn();
    });
    expect(result.current.session).not.toBeNull();

    await act(() => {
      result.current.signOut();
    });
    expect(result.current.session).toBeNull();
  });

  describe("SessionProvider の外側で呼んだ場合", () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("useSessionContextInternal() は throw する", async () => {
      // React が捕捉されないエラーを console.error に出力するため、
      // このテストの間だけ抑制する (アサーション対象はあくまで throw の有無)。
      jest.spyOn(console, "error").mockImplementation(() => {});

      await expect(renderHook(() => useSessionContextInternal())).rejects.toThrow(
        /SessionProvider/,
      );
    });
  });
});
