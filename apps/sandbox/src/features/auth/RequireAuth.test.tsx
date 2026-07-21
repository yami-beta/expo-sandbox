import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { screen } from "@testing-library/react-native";
import { Text } from "react-native";
import { renderWithProviders } from "../../test-utils/render";
import { RequireAuth } from "./RequireAuth";

// SignInScreen.test.tsx / AuthenticatedScreen.test.tsx と同型: useSession を直接モックし、
// SessionProvider / expo-secure-store は一切介在させない。
const mockUseSession = jest.fn();
jest.mock("./useSession", () => ({
  useSession: () => mockUseSession(),
}));

// RedirectDemoScreen.test.tsx の Redirect モックと同型: Link は実描画させず、
// 呼び出された props (href) だけを記録して検証する。
const mockLink = jest.fn();
jest.mock("expo-router", () => ({
  Link: (props: { href: string }) => {
    mockLink(props);
    return null;
  },
}));

const PROTECTED_TEST_ID = "protected-content";

function renderRequireAuth(replace = false) {
  return renderWithProviders(
    <RequireAuth replace={replace}>
      <Text testID={PROTECTED_TEST_ID}>secret</Text>
    </RequireAuth>,
  );
}

// @testing-library/react-native v14 では UNSAFE_getByType 系のクエリが廃止されているため、
// test-renderer が公開する TestInstance.queryAll で type 文字列を直接探す。
function activityIndicatorCount(): number {
  return screen.root?.queryAll((instance) => instance.type === "ActivityIndicator").length ?? -1;
}

describe("RequireAuth", () => {
  beforeEach(() => {
    mockUseSession.mockReset();
    mockLink.mockClear();
  });

  it("isLoading: true のときローディング表示のみを描画し、children も未認証案内も表示しない", async () => {
    mockUseSession.mockReturnValue({
      isLoading: true,
      session: null,
      signIn: jest.fn(),
      signOut: jest.fn(),
    });

    await renderRequireAuth();

    // 状態1: ActivityIndicator + 「読み込み中…」相当のテキスト
    expect(activityIndicatorCount()).toBe(1);
    expect(screen.getByText(/読み込み中/)).toBeOnTheScreen();

    // 排他性: 他の2状態のマーカーは出ない
    expect(screen.queryByTestId(PROTECTED_TEST_ID)).toBeNull();
    expect(screen.queryByText(/サインインが必要/)).toBeNull();
    expect(mockLink).not.toHaveBeenCalled();
  });

  it("isLoading: false かつ session: null(未認証) のとき、サインイン案内と /sign-in への Link を表示する", async () => {
    mockUseSession.mockReturnValue({
      isLoading: false,
      session: null,
      signIn: jest.fn(),
      signOut: jest.fn(),
    });

    await renderRequireAuth();

    // 状態2: 案内テキスト + /sign-in への Link
    expect(screen.getByText(/サインインが必要/)).toBeOnTheScreen();
    // replace 未指定時は push(replace: false)。任意の保護ページから開いた場合に
    // 戻るボタンで元のページへ戻れるようにするための既定値(RequireAuthProps参照)。
    expect(mockLink).toHaveBeenCalledWith(
      expect.objectContaining({ href: "/sign-in", replace: false }),
    );

    // 排他性: 他の2状態のマーカーは出ない
    expect(screen.queryByTestId(PROTECTED_TEST_ID)).toBeNull();
    expect(screen.queryByText(/読み込み中/)).toBeNull();
    expect(activityIndicatorCount()).toBe(0);
  });

  it("replace={true} のとき、/sign-in への Link に replace を渡す", async () => {
    mockUseSession.mockReturnValue({
      isLoading: false,
      session: null,
      signIn: jest.fn(),
      signOut: jest.fn(),
    });

    await renderRequireAuth(true);

    expect(mockLink).toHaveBeenCalledWith(
      expect.objectContaining({ href: "/sign-in", replace: true }),
    );
  });

  it("isLoading: false かつ session が非null(認証済み) のとき、children のみを表示する", async () => {
    mockUseSession.mockReturnValue({
      isLoading: false,
      session: "xxx",
      signIn: jest.fn(),
      signOut: jest.fn(),
    });

    await renderRequireAuth();

    // 状態3: children がそのまま描画される
    expect(screen.getByTestId(PROTECTED_TEST_ID)).toBeOnTheScreen();

    // 排他性: 他の2状態のマーカーは出ない
    expect(mockLink).not.toHaveBeenCalled();
    expect(screen.queryByText(/サインインが必要/)).toBeNull();
    expect(screen.queryByText(/読み込み中/)).toBeNull();
    expect(activityIndicatorCount()).toBe(0);
  });

  // 境界値: session は SessionContext.signIn() が常に固定文字列 "xxx" をセットし、
  // useStorageState の永続化層(SecureStore/localStorage)も未設定時は null を返すため、
  // 実運用で空文字列になることはない。その上で、SignInScreen/AuthenticatedScreen 等、
  // このコードベース全体が session を「非null か」ではなく falsy かどうかで判定する規約に
  // 統一されているため、RequireAuth もこれに合わせて "" を未認証側として扱う。
  it("isLoading: false かつ session が空文字列のとき、他のfalsy値と同じく未認証として扱う", async () => {
    mockUseSession.mockReturnValue({
      isLoading: false,
      session: "",
      signIn: jest.fn(),
      signOut: jest.fn(),
    });

    await renderRequireAuth();

    expect(screen.queryByTestId(PROTECTED_TEST_ID)).toBeNull();
    expect(screen.getByText(/サインインが必要/)).toBeOnTheScreen();
    expect(mockLink).toHaveBeenCalledWith(expect.objectContaining({ href: "/sign-in" }));
  });
});
