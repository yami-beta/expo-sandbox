import type { ReactNode } from "react";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as Localization from "expo-localization";
import Storage from "expo-sqlite/kv-store";
import {
  applyLocale,
  getStoredLocalePreference,
  resolveLocale,
  STORAGE_KEY,
  type LocalePreference,
} from "./locale";

export interface LocaleContextValue {
  preference: LocalePreference;
  setPreference: (preference: LocalePreference) => void;
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState<LocalePreference>(() => getStoredLocalePreference());
  const deviceLocales = Localization.useLocales();

  const handleSetPreference = useCallback((next: LocalePreference) => {
    setPreference(next);
    Storage.setItemSync(STORAGE_KEY.LOCALE, next);
    applyLocale(resolveLocale(next));
  }, []);

  // preference === "system" のとき、端末のロケール変更に追従する。
  // テーマの useColorScheme 追従と同型（deviceLocales の変化で再評価）。
  useEffect(() => {
    if (preference === "system") {
      applyLocale(resolveLocale("system"));
    }
  }, [preference, deviceLocales]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      preference,
      setPreference: handleSetPreference,
    }),
    [preference, handleSetPreference],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocaleContextInternal(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("LocaleContext must be used within a LocaleProvider");
  }
  return context;
}
