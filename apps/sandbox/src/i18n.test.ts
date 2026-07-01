import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import Constants from "expo-constants";
import * as Localization from "expo-localization";
import Storage from "expo-sqlite/kv-store";
import {
  getStoredLocalePreference,
  resolveDefaultPreference,
  resolveLocale,
  STORAGE_KEY,
} from "./i18n";

// resolveLocale("system") は内部の detectLocale() を介して端末ロケール
// (expo-localization の getLocales) を参照する。getLocales をモックして
// 「端末設定 → アプリ言語」のマッピングを検証する。
jest.mock("expo-localization", () => ({
  __esModule: true,
  getLocales: jest.fn(),
}));

// getStoredLocalePreference は保存値が無いときのフォールバックとして
// Constants.expoConfig?.extra?.e2eDefaultLocale (app.config.ts が E2E_DEFAULT_LOCALE から
// 埋め込む値) を参照する。expoConfig を差し替え可能にするためモックする。
jest.mock("expo-constants", () => ({
  __esModule: true,
  default: { expoConfig: null },
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

// app.config.ts の extra.e2eDefaultLocale (Constants.expoConfig?.extra?.e2eDefaultLocale)
// を差し替えるヘルパ。引数なしで「extra 自体が無い（通常ビルド相当）」を表現できる。
function setE2eDefaultLocale(e2eDefaultLocale?: unknown) {
  Object.assign(Constants, {
    expoConfig: e2eDefaultLocale === undefined ? {} : { extra: { e2eDefaultLocale } },
  });
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

// 保存値が無いときのフォールバック言語設定を解決する純粋関数。
// 通常ビルドは extra.e2eDefaultLocale 未設定で "system"、E2E ビルドは app.config.ts の
// extra.e2eDefaultLocale の固定言語を反映する。引数のみで挙動が決まるためモック不要
// (呼び出し元の getStoredLocalePreference が Constants.expoConfig?.extra?.e2eDefaultLocale
// から値を取り出して渡す。その結線は下の getStoredLocalePreference で検証する)。
describe("resolveDefaultPreference", () => {
  describe("有効な LocalePreference はそのまま既定値になる", () => {
    it('"ja" は E2E 既定として ja を反映する', () => {
      expect(resolveDefaultPreference("ja")).toBe("ja");
    });

    it('"en" は E2E 既定として en を反映する（将来の en テスト拡張を担保）', () => {
      expect(resolveDefaultPreference("en")).toBe("en");
    });

    it('"system" は端末ロケール依存の既定としてそのまま返す', () => {
      expect(resolveDefaultPreference("system")).toBe("system");
    });
  });

  describe('サポート外・無効な値は "system" にフォールバックする', () => {
    it("未設定 (undefined) は通常ビルド相当で system", () => {
      expect(resolveDefaultPreference(undefined)).toBe("system");
    });

    it("空文字は無効値なので system", () => {
      expect(resolveDefaultPreference("")).toBe("system");
    });

    it("サポート外の言語コード (fr) は system", () => {
      expect(resolveDefaultPreference("fr")).toBe("system");
    });

    it("null は非文字列の無効値なので system", () => {
      expect(resolveDefaultPreference(null)).toBe("system");
    });

    it("数値は非文字列の無効値なので system", () => {
      expect(resolveDefaultPreference(0)).toBe("system");
    });

    it("オブジェクトは非文字列の無効値なので system", () => {
      expect(resolveDefaultPreference({ locale: "ja" })).toBe("system");
    });
  });
});

// getStoredLocalePreference は「ユーザーが保存した言語設定」を最優先し、無効/未保存のときだけ
// フォールバック（app.config.ts の extra.e2eDefaultLocale。未設定なら "system"）を解決する。
// この優先順位は本番挙動の中核なので回帰から守る。
// expo-sqlite/kv-store は jest-setup.ts でインメモリ実装にモックされている。
describe("getStoredLocalePreference", () => {
  beforeEach(() => {
    Storage.clearSync();
    setE2eDefaultLocale();
  });

  it("保存された有効な言語設定を最優先で返す（フォールバックより優先）", () => {
    // フォールバックは extra.e2eDefaultLocale 未設定なら "system" だが、保存値があればそちらが勝つ
    Storage.setItemSync(STORAGE_KEY.LOCALE, "en");
    expect(getStoredLocalePreference()).toBe("en");
  });

  it('保存値が無ければフォールバックへ落ちる（extra.e2eDefaultLocale 未設定の通常ビルドは "system"）', () => {
    expect(getStoredLocalePreference()).toBe("system");
  });

  it('保存値が不正なら無視してフォールバックへ落ちる（extra.e2eDefaultLocale 未設定なら "system"）', () => {
    Storage.setItemSync(STORAGE_KEY.LOCALE, "fr");
    expect(getStoredLocalePreference()).toBe("system");
  });

  describe("extra.e2eDefaultLocale (Constants.expoConfig) への結線", () => {
    it("保存値が無く extra.e2eDefaultLocale が有効な言語 (en) なら、その値を返す", () => {
      setE2eDefaultLocale("en");
      expect(getStoredLocalePreference()).toBe("en");
    });

    it("extra.e2eDefaultLocale が設定されていても、保存された言語設定があればそちらを優先する", () => {
      setE2eDefaultLocale("en");
      Storage.setItemSync(STORAGE_KEY.LOCALE, "ja");
      expect(getStoredLocalePreference()).toBe("ja");
    });

    it("extra.e2eDefaultLocale がサポート外の値 (fr) なら system にフォールバックする", () => {
      setE2eDefaultLocale("fr");
      expect(getStoredLocalePreference()).toBe("system");
    });

    it("extra 自体が無い（通常ビルド相当）なら system にフォールバックする", () => {
      setE2eDefaultLocale();
      expect(getStoredLocalePreference()).toBe("system");
    });
  });
});
