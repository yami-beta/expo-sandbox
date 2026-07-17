import { useEffect, useCallback, useReducer } from "react";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

function useAsyncState<T>(initialValue: [boolean, T | null] = [true, null]): UseStateHook<T> {
  return useReducer(
    (state: [boolean, T | null], action: T | null): [boolean, T | null] => [false, action],
    initialValue,
  );
}

export async function setStorageItemAsync(key: string, value: string | null): Promise<void> {
  if (Platform.OS === "web") {
    try {
      if (value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, value);
      }
    } catch (e) {
      console.error(e);
    }
  } else {
    // native (SecureStore) 側は公式リファレンス実装と同型でエラーハンドリングを持たない。
    // Keychain/Keystore アクセス失敗は意図的に握りつぶさず reject をそのまま伝播させる。
    if (value == null) {
      await SecureStore.deleteItemAsync(key);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  }
}

export function useStorageState(key: string): UseStateHook<string> {
  const [state, setState] = useAsyncState<string>();

  useEffect(() => {
    if (Platform.OS === "web") {
      try {
        if (typeof localStorage !== "undefined") {
          setState(localStorage.getItem(key));
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      void SecureStore.getItemAsync(key)
        .then((value) => {
          setState(value);
        })
        .catch((e: unknown) => {
          // 失敗時も isLoading を false に戻す (これを省くと画面がローディングのまま固まる)。
          console.error(e);
          setState(null);
        });
    }
  }, [key, setState]);

  const setValue = useCallback(
    (value: string | null) => {
      setState(value);
      void setStorageItemAsync(key, value).catch((e: unknown) => {
        console.error(e);
      });
    },
    [key, setState],
  );

  return [state, setValue];
}
