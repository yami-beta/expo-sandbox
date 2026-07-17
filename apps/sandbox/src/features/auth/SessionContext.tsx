import { createContext, useCallback, useContext, useMemo, type PropsWithChildren } from "react";
import { useStorageState } from "./useStorageState";

const SESSION_STORAGE_KEY = "auth-session";

export interface SessionContextValue {
  session: string | null;
  isLoading: boolean;
  signIn: () => void;
  signOut: () => void;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState(SESSION_STORAGE_KEY);

  const signIn = useCallback(() => {
    // 実際の認証処理は行わないフェイクトークン。
    setSession("xxx");
  }, [setSession]);

  const signOut = useCallback(() => {
    setSession(null);
  }, [setSession]);

  const value = useMemo<SessionContextValue>(
    () => ({
      session,
      isLoading,
      signIn,
      signOut,
    }),
    [session, isLoading, signIn, signOut],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSessionContextInternal(): SessionContextValue {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("SessionContext must be used within a SessionProvider");
  }
  return context;
}
