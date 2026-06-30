import type { LocalePreference } from "../i18n";
import { useLocaleContextInternal } from "./LocaleContext";

export function useLocale(): {
  preference: LocalePreference;
  setPreference: (preference: LocalePreference) => void;
} {
  const { preference, setPreference } = useLocaleContextInternal();
  return { preference, setPreference };
}
