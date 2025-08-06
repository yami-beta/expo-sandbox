import { i18n } from "@lingui/core";
import Storage from "expo-sqlite/kv-store";
import { messages as jaMessages } from "./locales/ja/messages.po";
import { messages as enMessages } from "./locales/en/messages.po";

// サポートする言語の定義
export const locales = {
  ja: "日本語",
  en: "English",
} as const;

export type Locale = keyof typeof locales;

// デフォルト言語
export const defaultLocale: Locale = "ja";

// ストレージキー
const STORAGE_KEY = {
  LOCALE: "locale",
} as const;

// メッセージカタログ
const allMessages = {
  ja: jaMessages,
  en: enMessages,
} as const;

// i18nの初期化関数
export function initI18n(locale: Locale = defaultLocale) {
  const messages = allMessages[locale];
  i18n.loadAndActivate({ locale, messages });
}

// ロケールの型ガード
function isValidLocale(locale: string): locale is Locale {
  return locale in locales;
}

// 保存されたロケールを取得
function getStoredLocale(): Locale | null {
  const stored = Storage.getItemSync(STORAGE_KEY.LOCALE);
  if (typeof stored === "string" && isValidLocale(stored)) {
    return stored;
  }
  return null;
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

// ロケールを変更
export function changeLocale(locale: Locale) {
  initI18n(locale);
  Storage.setItemSync(STORAGE_KEY.LOCALE, locale);
}

// アプリ起動時の初期化（保存された言語設定を読み込む）
export function initializeI18n() {
  const storedLocale = getStoredLocale();
  initI18n(storedLocale || defaultLocale);
}
