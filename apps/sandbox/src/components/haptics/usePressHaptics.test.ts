import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { renderHook } from "@testing-library/react-native";
import { usePressHaptics } from "./usePressHaptics";

// expo-haptics の非同期 API はテストでは呼び出し有無だけ確認したいので、解決済み Promise を返すモックに差し替える。
jest.mock("expo-haptics", () => ({
  __esModule: true,
  ImpactFeedbackStyle: { Light: "light", Medium: "medium", Heavy: "heavy" },
  NotificationFeedbackType: { Success: "success", Warning: "warning", Error: "error" },
  impactAsync: jest.fn(() => Promise.resolve()),
  selectionAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
}));

const impactAsync = jest.mocked(Haptics.impactAsync);
const selectionAsync = jest.mocked(Haptics.selectionAsync);
const notificationAsync = jest.mocked(Haptics.notificationAsync);

describe("usePressHaptics", () => {
  const originalOS = Platform.OS;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    Platform.OS = originalOS;
  });

  it("ios では style に応じた impactAsync を呼ぶ", async () => {
    Platform.OS = "ios";
    const { result } = await renderHook(() => usePressHaptics("light"));

    result.current();

    expect(impactAsync).toHaveBeenCalledTimes(1);
    expect(impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
  });

  it("ios では selection / notification 系の style も対応する API を呼ぶ", async () => {
    Platform.OS = "ios";
    const selection = await renderHook(() => usePressHaptics("selection"));
    selection.result.current();
    expect(selectionAsync).toHaveBeenCalledTimes(1);

    const success = await renderHook(() => usePressHaptics("success"));
    success.result.current();
    expect(notificationAsync).toHaveBeenCalledWith(Haptics.NotificationFeedbackType.Success);
  });

  it("web では触覚 API を一切呼ばない (no-op)", async () => {
    Platform.OS = "web";
    const { result } = await renderHook(() => usePressHaptics("medium"));

    result.current();

    expect(impactAsync).not.toHaveBeenCalled();
    expect(selectionAsync).not.toHaveBeenCalled();
    expect(notificationAsync).not.toHaveBeenCalled();
  });
});
