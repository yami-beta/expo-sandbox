import type { I18n } from "@lingui/core";

// 日付フォーマットのプリセット
export const createDateFormatPresets = (i18n: I18n) => ({
  // 完全な日付（例: 2025年8月18日）
  full: (date: Date | string): string => {
    return i18n.date(date, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  },

  // 長い形式（例: 2025年8月18日 月曜日）
  long: (date: Date | string): string => {
    return i18n.date(date, {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  },

  // 短い形式（例: 2025/08/18）
  short: (date: Date | string): string => {
    return i18n.date(date, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  },

  // 月と日のみ（例: 8月18日）
  monthDay: (date: Date | string): string => {
    return i18n.date(date, {
      month: "long",
      day: "numeric",
    });
  },

  // カスタムフォーマット
  custom: (
    date: Date | string,
    options: Intl.DateTimeFormatOptions,
  ): string => {
    return i18n.date(date, options);
  },
});

// 時刻フォーマットのプリセット
export const createTimeFormatPresets = (i18n: I18n) => ({
  // 時刻のみ（24時間表記を強制: 14:30）
  time: (date: Date | string): string => {
    return i18n.date(date, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  },

  // 時刻と秒（24時間表記を強制: 14:30:45）
  timeWithSeconds: (date: Date | string): string => {
    return i18n.date(date, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  },

  // 12時間表記（例: 2:30 PM）
  time12h: (date: Date | string): string => {
    return i18n.date(date, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  },

  // 日付と時刻（24時間表記を強制: 2025/08/18 14:30）
  dateTime: (date: Date | string): string => {
    return i18n.date(date, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  },
});

// 数値フォーマットのプリセット
export const createNumberFormatPresets = (i18n: I18n) => ({
  // 基本的な数値（桁区切りあり）
  decimal: (value: number): string => {
    return i18n.number(value);
  },

  // 小数点以下の桁数を指定
  decimalWithPrecision: (
    value: number,
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
  ): string => {
    return i18n.number(value, {
      minimumFractionDigits,
      maximumFractionDigits,
    });
  },

  // 整数のみ（小数点以下なし）
  integer: (value: number): string => {
    return i18n.number(value, {
      maximumFractionDigits: 0,
    });
  },

  // パーセンテージ（例: 85.5%）
  percent: (value: number): string => {
    return i18n.number(value, {
      style: "percent",
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    });
  },

  // 通貨（自動的にロケールに応じた通貨を選択）
  currency: (value: number, currencyCode?: string): string => {
    // デフォルトの通貨コードをロケールに基づいて設定
    const currency = currencyCode ?? getCurrencyForLocale(i18n.locale);
    return i18n.number(value, {
      style: "currency",
      currency,
    });
  },

  // 通貨（整数表示）
  currencyInteger: (value: number, currencyCode?: string): string => {
    const currency = currencyCode ?? getCurrencyForLocale(i18n.locale);
    return i18n.number(value, {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  },

  // コンパクト表記（例: 1.2K, 3.4M）
  compact: (value: number): string => {
    return i18n.number(value, {
      notation: "compact",
      maximumFractionDigits: 1,
    });
  },

  // カスタムフォーマット
  custom: (value: number, options: Intl.NumberFormatOptions): string => {
    return i18n.number(value, options);
  },
});

// ロケールに基づいたデフォルト通貨を取得
function getCurrencyForLocale(locale: string): string {
  const currencyMap: Record<string, string> = {
    ja: "JPY",
    en: "USD",
  };
  return currencyMap[locale] ?? "USD";
}

// 相対時間フォーマット（Intl.RelativeTimeFormat使用）
export const createRelativeTimeFormat = (i18n: I18n) => {
  // RelativeTimeFormatインスタンスを作成
  const getFormatter = () =>
    new Intl.RelativeTimeFormat(i18n.locale, {
      numeric: "auto",
      style: "long",
    });

  return {
    // 今日、昨日、明日、X日前/後を返す
    formatRelativeDay: (date: Date | string): string => {
      const inputDate = typeof date === "string" ? new Date(date) : date;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      inputDate.setHours(0, 0, 0, 0);

      const diffTime = inputDate.getTime() - today.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      const formatter = getFormatter();
      return formatter.format(diffDays, "day");
    },

    // X時間前/後を返す
    formatRelativeHours: (date: Date | string): string => {
      const inputDate = typeof date === "string" ? new Date(date) : date;
      const now = new Date();
      const diffTime = inputDate.getTime() - now.getTime();
      const diffHours = Math.round(diffTime / (1000 * 60 * 60));

      const formatter = getFormatter();
      return formatter.format(diffHours, "hour");
    },

    // X分前/後を返す
    formatRelativeMinutes: (date: Date | string): string => {
      const inputDate = typeof date === "string" ? new Date(date) : date;
      const now = new Date();
      const diffTime = inputDate.getTime() - now.getTime();
      const diffMinutes = Math.round(diffTime / (1000 * 60));

      const formatter = getFormatter();
      return formatter.format(diffMinutes, "minute");
    },

    // より細かい制御が必要な場合のカスタムフォーマット
    formatRelative: (
      value: number,
      unit: Intl.RelativeTimeFormatUnit,
      options?: Intl.RelativeTimeFormatOptions,
    ): string => {
      const formatter = new Intl.RelativeTimeFormat(i18n.locale, options);
      return formatter.format(value, unit);
    },
  };
};

// エクスポート用のまとめ（i18nを引数に取る）
export const createFormatters = (i18n: I18n) => ({
  date: createDateFormatPresets(i18n),
  time: createTimeFormatPresets(i18n),
  number: createNumberFormatPresets(i18n),
  relativeTime: createRelativeTimeFormat(i18n),
});
