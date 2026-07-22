import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { fireEvent, screen } from "@testing-library/react-native";
import { renderWithProviders } from "../../test-utils/render";
import { SignInScreen } from "./SignInScreen";

// AuthenticatedScreen.test.tsx と同型: useSession を直接モックし、
// SessionProvider / expo-secure-store は一切介在させない。
// SignInScreen 自体はナビゲーションを一切行わない(signIn() を呼ぶだけ)。
// signIn() 後の遷移はルート Stack の Stack.Protected(app/_layout.tsx)が session の変化を
// 見て /sign-in をフィルタし、anchor((tabs))へフォールバックさせるため、expo-router の
// モックは不要。
const mockUseSession = jest.fn();
jest.mock("./useSession", () => ({
  useSession: () => mockUseSession(),
}));

describe("SignInScreen", () => {
  beforeEach(() => {
    mockUseSession.mockReset();
  });

  it("isLoading: true の間は「サインインする」ボタンを表示しない", async () => {
    mockUseSession.mockReturnValue({
      isLoading: true,
      session: null,
      signIn: jest.fn(),
      signOut: jest.fn(),
    });

    await renderWithProviders(<SignInScreen />);

    expect(screen.queryByText("サインインする")).toBeNull();
  });

  it("isLoading: false のとき「サインインする」ボタンをタップすると signIn が呼ばれる", async () => {
    const mockSignIn = jest.fn();
    mockUseSession.mockReturnValue({
      isLoading: false,
      session: null,
      signIn: mockSignIn,
      signOut: jest.fn(),
    });

    await renderWithProviders(<SignInScreen />);

    const button = screen.getByText("サインインする");
    expect(button).toBeOnTheScreen();

    await fireEvent.press(button);

    expect(mockSignIn).toHaveBeenCalledTimes(1);
  });
});
