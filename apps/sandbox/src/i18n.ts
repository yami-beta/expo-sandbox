import { i18n } from "@lingui/core";
import Constants from "expo-constants";
import * as Localization from "expo-localization";
import Storage from "expo-sqlite/kv-store";
import { messages as jaMessages } from "./locales/ja/messages";
import { messages as enMessages } from "./locales/en/messages";

// サポートする言語の定義
export const locales = {
  ja: "日本語",
  en: "English",
} as const;

export type Locale = keyof typeof locales;

// 言語設定（アプリ側で永続化する値）
// "system" は端末のロケールに従う。それ以外は Locale をそのまま使う。
export type LocalePreference = "system" | Locale;

// 言語設定の永続化キー（テーマの STORAGE_KEY と同じローカル定義スタイル）
export const STORAGE_KEY = {
  LOCALE: "locale-preference",
} as const;

// 言語設定の型ガード
export function isValidLocalePreference(value: unknown): value is LocalePreference {
  return value === "system" || (typeof value === "string" && isValidLocale(value));
}

// デフォルト言語
export const defaultLocale: Locale = "ja";

// メッセージカタログ
const allMessages = {
  ja: jaMessages,
  en: enMessages,
} as const;

// ロケールの型ガード
function isValidLocale(locale: string): locale is Locale {
  return locale in locales;
}

// デバイスの言語を検出してサポートされている言語にマッピング
function detectLocale(): Locale {
  // デバイスの言語設定を取得
  const deviceLocales = Localization.getLocales();

  // 最初の言語設定を確認
  const preferredLanguageCode = deviceLocales[0]?.languageCode;

  if (!preferredLanguageCode) {
    return defaultLocale;
  }

  // サポートされている言語かチェック
  if (isValidLocale(preferredLanguageCode)) {
    return preferredLanguageCode;
  }

  // 言語コードの最初の2文字で再度チェック（例: en-US → en）
  const shortLanguageCode = preferredLanguageCode.substring(0, 2);
  if (isValidLocale(shortLanguageCode)) {
    return shortLanguageCode;
  }

  // サポートされていない場合はデフォルト言語を返す
  return defaultLocale;
}

// 言語設定を実際に適用するロケールへ解決する
// "system" は端末のロケールから検出し、それ以外はそのまま返す
export function resolveLocale(preference: LocalePreference): Locale {
  return preference === "system" ? detectLocale() : preference;
}

// 指定したロケールを i18n に適用する薄いラッパ
export function applyLocale(locale: Locale) {
  i18n.loadAndActivate({ locale, messages: allMessages[locale] });
}

// 現在のロケールを取得
export function getCurrentLocale(): Locale {
  const currentLocale = i18n.locale;
  if (isValidLocale(currentLocale)) {
    return currentLocale;
  }
  // 不正なロケールの場合はデフォルトロケールを返す
  return defaultLocale;
}

// 保存値が無いときのフォールバック言語設定を解決する。
// 通常ビルドは "system"（端末ロケール依存）。E2E ビルドでは app.config.ts の
// extra.e2eDefaultLocale に固定言語を渡し、emulator ロケールに依存せず固定言語で assert できるようにする。
// 無効値・未設定（通常ビルド）は "system" にフォールバックする。
export function resolveDefaultPreference(e2eDefaultLocale: unknown): LocalePreference {
  return isValidLocalePreference(e2eDefaultLocale) ? e2eDefaultLocale : "system";
}

// 保存された言語設定を同期で読み込む（保存値が無効/未保存ならフォールバックを解決）
export function getStoredLocalePreference(): LocalePreference {
  const stored = Storage.getItemSync(STORAGE_KEY.LOCALE);
  if (isValidLocalePreference(stored)) {
    return stored;
  }
  // 通常ビルドでは app.config.ts の extra.e2eDefaultLocale が未設定 → undefined になり
  // "system" にフォールバックする。
  return resolveDefaultPreference(Constants.expoConfig?.extra?.e2eDefaultLocale);
}

// アプリ起動時の初期化
// 保存された言語設定を同期で読み込み、解決したロケールを適用する。
// 保存がなければ "system" 相当でデバイス検出。同期確定なのでちらつきなし。
export function initializeI18n() {
  applyLocale(resolveLocale(getStoredLocalePreference()));
}
