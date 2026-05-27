import { Platform, type ViewStyle } from "react-native";
import type { ColorScheme } from "./colors";

export type ShadowTokenName = "none" | "sm" | "md" | "lg";

type ShadowValue = Pick<
  ViewStyle,
  "shadowColor" | "shadowOffset" | "shadowOpacity" | "shadowRadius" | "elevation"
>;

export type ShadowTokens = Readonly<Record<ShadowTokenName, ShadowValue>>;

const baseColor = "#000000";

const iosShadows = (opacityScale: number): ShadowTokens => ({
  none: {},
  sm: {
    shadowColor: baseColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06 * opacityScale,
    shadowRadius: 4,
  },
  md: {
    shadowColor: baseColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08 * opacityScale,
    shadowRadius: 10,
  },
  lg: {
    shadowColor: baseColor,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12 * opacityScale,
    shadowRadius: 20,
  },
});

const androidShadows: ShadowTokens = {
  none: { elevation: 0 },
  sm: { elevation: 1 },
  md: { elevation: 4 },
  lg: { elevation: 10 },
};

// dark テーマでは shadow を控えめにし border 強化で階層を表現する。
// 完全に 0 にはせず、Modal / sheet の浮き感は維持する。
const makeShadows = (colorScheme: ColorScheme): ShadowTokens => {
  const opacityScale = colorScheme === "dark" ? 2.5 : 1;
  return Platform.select({
    ios: iosShadows(opacityScale),
    android: androidShadows,
    default: { none: {}, sm: {}, md: {}, lg: {} } as ShadowTokens,
  });
};

export const shadowsByScheme = {
  light: makeShadows("light"),
  dark: makeShadows("dark"),
} as const;
