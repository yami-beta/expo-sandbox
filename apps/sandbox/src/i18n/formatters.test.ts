import { describe, expect, it } from "@jest/globals";
import { setupI18n } from "@lingui/core";
import {
  createDateFormatPresets,
  createNumberFormatPresets,
  createRelativeTimeFormat,
} from "./formatters";

// テスト用にロケールだけを活性化した i18n インスタンスを作る (.po は読み込まない)。
// i18n.date / i18n.number は内部で Intl をロケール指定で呼ぶため、出力はロケール依存になる。
function i18nFor(locale: "ja" | "en") {
  const i18n = setupI18n();
  i18n.loadAndActivate({ locale, messages: {} });
  return i18n;
}

const DAY_MS = 24 * 60 * 60 * 1000;

describe("createNumberFormatPresets", () => {
  it("decimal はロケールの桁区切りを適用する", () => {
    const number = createNumberFormatPresets(i18nFor("en"));
    expect(number.decimal(1234567)).toBe("1,234,567");
  });

  it("percent は百分率に変換する (0.855 -> 85.5%)", () => {
    const number = createNumberFormatPresets(i18nFor("en"));
    expect(number.percent(0.855)).toBe("85.5%");
  });

  it("currency はロケール既定の通貨を選ぶ (ja=JPY は小数なし / en=USD は小数 2 桁)", () => {
    // 通貨記号は ICU バージョンで揺れるため、桁区切り・小数有無で検証する。
    expect(createNumberFormatPresets(i18nFor("ja")).currency(1000)).toMatch(/1,000$/);
    expect(createNumberFormatPresets(i18nFor("en")).currency(1000)).toBe("$1,000.00");
  });

  it("currency は通貨コード指定で既定通貨を上書きできる", () => {
    // en ロケールでも JPY を渡せば小数なしになる。
    expect(createNumberFormatPresets(i18nFor("en")).currency(1000, "JPY")).toMatch(/1,000$/);
  });
});

describe("createDateFormatPresets", () => {
  it("short は年月日をゼロ埋め 2 桁で整形する", () => {
    const date = createDateFormatPresets(i18nFor("en"));
    // Date の月は 0 始まり: 7 = 8月
    expect(date.short(new Date(2025, 7, 5))).toBe("08/05/2025");
  });
});

describe("createRelativeTimeFormat", () => {
  it("formatRelativeDay は実行日基準で today / yesterday / tomorrow を返す", () => {
    const relative = createRelativeTimeFormat(i18nFor("en"));
    const now = Date.now();
    expect(relative.formatRelativeDay(new Date(now))).toBe("today");
    expect(relative.formatRelativeDay(new Date(now - DAY_MS))).toBe("yesterday");
    expect(relative.formatRelativeDay(new Date(now + DAY_MS))).toBe("tomorrow");
  });

  it("formatRelative は既定 (numeric:always) で数値表現、numeric:auto で語表現になる", () => {
    const relative = createRelativeTimeFormat(i18nFor("en"));
    expect(relative.formatRelative(-1, "day")).toBe("1 day ago");
    expect(relative.formatRelative(2, "hour")).toBe("in 2 hours");
    expect(relative.formatRelative(-1, "day", { numeric: "auto" })).toBe("yesterday");
  });
});
