import { i18n } from "@lingui/core";
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
}
