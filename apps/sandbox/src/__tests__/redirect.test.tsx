import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";
import RedirectCompleteScreen from "../app/(tabs)/(home)/redirect/complete";
import RedirectDemo from "../app/(tabs)/(home)/redirect/index";
import { renderWithProviders } from "../test-utils/render";

const mockRedirect = jest.fn();

// Stack.Screen.Title は実際のナビゲーションコンテキストを要求するため、
// 画面遷移(Redirect)の検証に不要な部分ごとモックする。
jest.mock("expo-router", () => ({
  Redirect: (props: { href: string }) => {
    mockRedirect(props);
    return null;
  },
  Stack: {
    Screen: {
      Title: (_props: { children?: ReactNode }) => null,
    },
  },
}));

describe("redirect サンプル (index)", () => {
  beforeEach(() => {
    mockRedirect.mockClear();
  });

  it("初期表示では送信ボタンを表示し、Redirect は呼ばれない", async () => {
    await renderWithProviders(<RedirectDemo />);

    expect(screen.getByText("送信する")).toBeOnTheScreen();
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("送信すると送信中の表示に切り替わり、完了後に /redirect/complete への Redirect が呼ばれる", async () => {
    await renderWithProviders(<RedirectDemo />);

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

describe("redirect サンプル (complete)", () => {
  it("送信完了の案内を表示する", async () => {
    await renderWithProviders(<RedirectCompleteScreen />);

    expect(screen.getByText("送信が完了しました")).toBeOnTheScreen();
  });
});
