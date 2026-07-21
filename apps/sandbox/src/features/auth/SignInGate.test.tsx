import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { screen } from "@testing-library/react-native";
import { renderWithProviders } from "../../test-utils/render";
import { SignInGate } from "./SignInGate";

// RequireAuth.test.tsx と同型: useSession を直接モックし、
// SessionProvider / expo-secure-store は一切介在させない。
const mockUseSession = jest.fn();
jest.mock("./useSession", () => ({
  useSession: () => mockUseSession(),
}));

// SignInScreen 自体の挙動(isLoading分岐等)は SignInScreen.test.tsx で検証済みのため、
// ここでは SignInGate 自身の出し分け(呼ばれたかどうか)だけを見る。
const mockSignInScreen = jest.fn(() => null);
jest.mock("./SignInScreen", () => ({
  SignInScreen: () => mockSignInScreen(),
}));

const mockLink = jest.fn();
jest.mock("expo-router", () => ({
  Link: (props: { href: string }) => {
    mockLink(props);
    return null;
  },
}));

describe("SignInGate", () => {
  beforeEach(() => {
    mockUseSession.mockReset();
    mockSignInScreen.mockClear();
    mockLink.mockClear();
  });

  it("session: null(未認証)のとき SignInScreen を表示する", async () => {
    mockUseSession.mockReturnValue({
      isLoading: false,
      session: null,
      signIn: jest.fn(),
      signOut: jest.fn(),
    });

    await renderWithProviders(<SignInGate />);

    expect(mockSignInScreen).toHaveBeenCalledTimes(1);
    expect(screen.queryByText(/サインインしています/)).toBeNull();
    expect(mockLink).not.toHaveBeenCalled();
  });

  it("session が非null(認証済み)のとき、サインイン済みの案内と /account への Link を表示する", async () => {
    mockUseSession.mockReturnValue({
      isLoading: false,
      session: "xxx",
      signIn: jest.fn(),
      signOut: jest.fn(),
    });

    await renderWithProviders(<SignInGate />);

    expect(screen.getByText(/サインインしています/)).toBeOnTheScreen();
    expect(mockLink).toHaveBeenCalledWith(expect.objectContaining({ href: "/account" }));
    expect(mockSignInScreen).not.toHaveBeenCalled();
  });
});
