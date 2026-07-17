import { useSessionContextInternal, type SessionContextValue } from "./SessionContext";

export function useSession(): SessionContextValue {
  return useSessionContextInternal();
}
