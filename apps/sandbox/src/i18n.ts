import { i18n } from "@lingui/core";
import * as Localization from "expo-localization";
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

// i18nの初期化関数
export function initI18n() {
  const locale = detectLocale();
  const messages = allMessages[locale];
  i18n.loadAndActivate({ locale, messages });
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

// アプリ起動時の初期化（デバイスの言語設定を読み込む）
export function initializeI18n() {
  initI18n();
}
