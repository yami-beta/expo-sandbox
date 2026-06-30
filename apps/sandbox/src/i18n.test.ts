import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import * as Localization from "expo-localization";
import { resolveLocale } from "./i18n";

// resolveLocale("system") は内部の detectLocale() を介して端末ロケール
// (expo-localization の getLocales) を参照する。getLocales をモックして
// 「端末設定 → アプリ言語」のマッピングを検証する。
jest.mock("expo-localization", () => ({
  __esModule: true,
  getLocales: jest.fn(),
}));

// detectLocale が参照するのは languageCode のみ。getLocales の戻り値型を
// その最小形へ広げて受けることで、テストから不要なフィールドを省ける
// (関数の戻り値を上位型へ広げる安全なアサーション)。
type DeviceLocale = { languageCode: string | null };
const getLocales = jest.mocked(Localization.getLocales as () => DeviceLocale[]);

// 端末に設定された言語コード (getLocales()[0..].languageCode) を差し替えるヘルパ。
// 引数なしで「ロケール一覧が空」の状態を表現できる。
function setDeviceLanguageCodes(...languageCodes: (string | null)[]) {
  getLocales.mockReturnValue(languageCodes.map((languageCode) => ({ languageCode })));
}

describe("resolveLocale", () => {
  beforeEach(() => {
    getLocales.mockReset();
  });

  describe('"system" は端末設定をアプリ言語へ反映する', () => {
    it("端末が ja ならそのまま ja", () => {
      setDeviceLanguageCodes("ja");
      expect(resolveLocale("system")).toBe("ja");
    });

    it("端末が en ならそのまま en", () => {
      setDeviceLanguageCodes("en");
      expect(resolveLocale("system")).toBe("en");
    });

    it("言語コードがそのまま一致しなくても先頭2文字でマッチすれば採用する (en-US → en)", () => {
      setDeviceLanguageCodes("en-US");
      expect(resolveLocale("system")).toBe("en");
    });

    it("サポート外の言語 (fr) は defaultLocale (ja) にフォールバックする", () => {
      setDeviceLanguageCodes("fr");
      expect(resolveLocale("system")).toBe("ja");
    });

    it("言語コードが取得できない (null) 場合は defaultLocale (ja) にフォールバックする", () => {
      setDeviceLanguageCodes(null);
      expect(resolveLocale("system")).toBe("ja");
    });

    it("ロケール一覧が空でも defaultLocale (ja) にフォールバックする", () => {
      setDeviceLanguageCodes();
      expect(resolveLocale("system")).toBe("ja");
    });

    it("複数設定されていても先頭の言語を優先する (en, ja → en)", () => {
      setDeviceLanguageCodes("en", "ja");
      expect(resolveLocale("system")).toBe("en");
    });

    it("先頭がサポート外なら後続にサポート言語があってもフォールバックする (先頭のみ判定)", () => {
      setDeviceLanguageCodes("fr", "en");
      expect(resolveLocale("system")).toBe("ja");
    });
  });

  describe("明示指定は端末設定に関わらずその言語を使う", () => {
    it('"ja" は端末が en でも ja を返す', () => {
      setDeviceLanguageCodes("en");
      expect(resolveLocale("ja")).toBe("ja");
    });

    it('"en" は端末が ja でも en を返す', () => {
      setDeviceLanguageCodes("ja");
      expect(resolveLocale("en")).toBe("en");
    });

    it("明示指定では端末ロケール (getLocales) を参照しない", () => {
      setDeviceLanguageCodes("ja");
      resolveLocale("en");
      expect(getLocales).not.toHaveBeenCalled();
    });
  });
});
