import { describe, expect, it, jest } from "@jest/globals";
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import type { ReactElement } from "react";
import { Text } from "react-native";
import { Slot } from "expo-router";
// screen/fireEvent/waitFor は @testing-library/react-native から直接ではなく、
// expo-router/testing-library の再エクスポート経由で使う。renderRouter は内部で
// 解決した @testing-library/react-native のインスタンスに対して render するため、
// 別経路で import した screen 等は別インスタンスの (空の) シングルトンを参照してしまい
// "render function has not been called" になる。
import { fireEvent, renderRouter, screen, waitFor } from "expo-router/testing-library";
import { ThemeProvider } from "../theme/ThemeContext";
// Stack.Protected によるガード構成を持つ実際のレイアウト/ルートファイルをそのまま使う
// (実装をなぞらず、実装が公開するルーティング挙動を検証するため)。
import * as HomeLayout from "../app/(tabs)/(home)/_layout";
import * as AuthLayout from "../app/(tabs)/(home)/auth/_layout";
import * as AuthIndexRoute from "../app/(tabs)/(home)/auth/index";
import * as AuthSignInRoute from "../app/(tabs)/(home)/auth/sign-in";

// expo-secure-store はこのテストファイル内でもモックする (SessionProvider が
// (home)/_layout.tsx 内部で使う useStorageState 経由で参照するため)。
jest.mock("expo-secure-store", () => {
  const store = new Map<string, string>();
  return {
    __esModule: true,
    getItemAsync: jest.fn(async (key: string): Promise<string | null> => store.get(key) ?? null),
    setItemAsync: jest.fn(async (key: string, value: string): Promise<void> => {
      store.set(key, value);
    }),
    deleteItemAsync: jest.fn(async (key: string): Promise<void> => {
      store.delete(key);
    }),
  };
});

// 翻訳カタログ (.po) は読み込まず、メッセージ ID (= 日本語ソース文言) をそのまま描画させる
// (test-utils/render.tsx の renderWithProviders と同じ方針)。
i18n.loadAndActivate({ locale: "ja", messages: {} });

// 実アプリの root layout (app/_layout.tsx) はフォント読み込み・ロケール初期化・
// NativeTabs ((tabs)/_layout.tsx) など auth 機能と無関係な依存を大量に持ち込むため使わない。
// このテストで必要なのは ThemedText / Trans が要求する ThemeProvider / I18nProvider のみ。
function RootLayoutStub(): ReactElement {
  return (
    <I18nProvider i18n={i18n}>
      <ThemeProvider>
        <Slot />
      </ThemeProvider>
    </I18nProvider>
  );
}

// auth/ 配下は独自のネストStack (auth/_layout.tsx) に分離されており、
// (home)/_layout.tsx の unstable_settings = { anchor: "index" } の影響は受けない
// (anchor は各 Stack ごとに静的解決されるため、親Stackの anchor が子Stackの
// フォールバック先に波及することはない)。
// 本物のホーム一覧 (GroupedList 等、多数のアイコン依存を持つ) を持ち込まず、
// 「auth 側のガードが home 側の構成から独立して機能しているか」を判定できる
// 目印だけを持つ最小スタブを使う。
function HomeIndexStub(): ReactElement {
  return <Text>home-index-stub</Text>;
}

// renderRouter へ渡す MemoryContext。auth 機能に関係するファイルのみを列挙し、
// 他のホーム画面 (~20 画面) や (tabs)/_layout.tsx (NativeTabs) を巻き込まない。
const authRouterContext = {
  _layout: RootLayoutStub,
  "(tabs)/(home)/_layout": HomeLayout,
  "(tabs)/(home)/index": HomeIndexStub,
  "(tabs)/(home)/auth/_layout": AuthLayout,
  "(tabs)/(home)/auth/index": AuthIndexRoute,
  "(tabs)/(home)/auth/sign-in": AuthSignInRoute,
};

describe("Protected Routes: auth", () => {
  // NOTE: renderRouter は「1 ファイルにつき 1 回」だけ呼ぶ。
  // 検証の結果、同一テストファイル内で renderRouter を複数回呼ぶと (Stack.Protected の
  // 有無に関わらず、ここに列挙した MemoryContext と無関係な最小の Plain Stack 構成でも
  // 再現する)、1 回目の呼び出しは initialUrl を正しく解決できるが、2 回目以降は
  // 一貫して解決できず対象テキストが見つからないままタイムアウトする
  // (renderRouter/expo-router 側のグローバルな router store か fake timers が
  // テスト間で正しくリセットされないことに起因すると見られる)。
  // そのため 3 つのシナリオを独立した it() に分けず、1 本の連続したユーザー操作として
  // 1 回の renderRouter で検証する (Maestro の auth.yaml フローとも対応する)。
  // NOTE: ここで検証しているのはアプリ内導線で実際に起きる遷移のみ (未サインインで /auth
  // を開く→フォールバック、サインイン/サインアウトによる動的なガード反転)。
  // 「既にセッションがある状態で /auth/sign-in へ直接ディープリンクし index へフォールバックする」
  // という逆方向のケースは、アプリ内に該当導線が無いため未検証。
  it("未サインイン→サインイン→サインアウトの一連の遷移で Stack.Protected のガードが正しく機能する", async () => {
    await renderRouter(authRouterContext, { initialUrl: "/auth" });

    // 1. 未サインイン状態で /auth を開くと、ガードにより sign-in 側にフォールバックされる。
    //    home 一覧 (anchor: "index" でスタック最下部に積まれる) まで押し戻されていないことも確認する。
    await waitFor(() => {
      expect(screen.getByText("サインインする")).toBeOnTheScreen();
    });
    expect(screen.queryByText("サインアウト")).toBeNull();
    expect(screen.queryByText("home-index-stub")).toBeNull();

    // 2. 「サインインする」をタップすると、保護された画面 (auth/index) へ遷移する。
    await fireEvent.press(screen.getByText("サインインする"));

    await waitFor(() => {
      expect(screen.getByText("サインアウト")).toBeOnTheScreen();
    });
    expect(screen.queryByText("サインインする")).toBeNull();

    // 3. 「サインアウト」をタップすると auth/sign-in に戻る。
    //    ここが本サンプルの中核: home 一覧まで押し戻されず、auth 用ネストStack内の
    //    Stack.Protected によるガード再評価だけで sign-in 画面に着地することを確認する。
    await fireEvent.press(screen.getByText("サインアウト"));

    await waitFor(() => {
      expect(screen.getByText("サインインする")).toBeOnTheScreen();
    });
    expect(screen.queryByText("サインアウト")).toBeNull();
    expect(screen.queryByText("home-index-stub")).toBeNull();
  });
});
