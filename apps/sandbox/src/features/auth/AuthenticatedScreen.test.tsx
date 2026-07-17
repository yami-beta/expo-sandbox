import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { fireEvent, screen } from "@testing-library/react-native";
import { renderWithProviders } from "../../test-utils/render";
import { AuthenticatedScreen } from "./AuthenticatedScreen";

// SignInScreen.test.tsx と同型: useSession を直接モックし、
// SessionProvider / expo-secure-store は一切介在させない。
// サインアウト後の画面遷移は Stack.Protected のガード再評価のみで行われる
// (auth/_layout.tsx 側で検証済み) ため、expo-router のモックは不要。
const mockUseSession = jest.fn();
jest.mock("./useSession", () => ({
  useSession: () => mockUseSession(),
}));

describe("AuthenticatedScreen", () => {
  beforeEach(() => {
    mockUseSession.mockReset();
  });

  it("isLoading: true の間は「サインアウト」ボタンを表示しない", async () => {
    mockUseSession.mockReturnValue({
      isLoading: true,
      session: null,
      signIn: jest.fn(),
      signOut: jest.fn(),
    });

    await renderWithProviders(<AuthenticatedScreen />);

    expect(screen.queryByText("サインアウト")).toBeNull();
  });

  it("isLoading: false のときセッション文字列を表示し、「サインアウト」タップで signOut が呼ばれる", async () => {
    const mockSignOut = jest.fn();
    mockUseSession.mockReturnValue({
      isLoading: false,
      session: "xxx",
      signIn: jest.fn(),
      signOut: mockSignOut,
    });

    await renderWithProviders(<AuthenticatedScreen />);

    expect(screen.getByText("xxx")).toBeOnTheScreen();

    const button = screen.getByText("サインアウト");
    await fireEvent.press(button);

    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });
});
