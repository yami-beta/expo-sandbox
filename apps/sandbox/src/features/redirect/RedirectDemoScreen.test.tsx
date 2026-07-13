import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { renderWithProviders } from "../../test-utils/render";
import { RedirectDemoScreen } from "./RedirectDemoScreen";

const mockRedirect = jest.fn();

jest.mock("expo-router", () => ({
  Redirect: (props: { href: string }) => {
    mockRedirect(props);
    return null;
  },
}));

describe("RedirectDemoScreen", () => {
  beforeEach(() => {
    mockRedirect.mockClear();
  });

  it("初期表示では送信ボタンを表示し、Redirect は呼ばれない", async () => {
    await renderWithProviders(<RedirectDemoScreen />);

    expect(screen.getByText("送信する")).toBeOnTheScreen();
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("送信すると送信中の表示に切り替わり、完了後に /redirect/complete への Redirect が呼ばれる", async () => {
    await renderWithProviders(<RedirectDemoScreen />);

    await fireEvent.press(screen.getByText("送信する"));

    expect(screen.getByText("送信中…")).toBeOnTheScreen();

    await waitFor(
      () => {
        expect(mockRedirect).toHaveBeenCalledWith(
          expect.objectContaining({ href: "/redirect/complete" }),
        );
      },
      { timeout: 2000 },
    );
  });
});
