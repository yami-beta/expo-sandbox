import { Platform } from "react-native";

export const Colors = {
  light: {
    text: "#000000",
    textSecondary: "#60646C",
    background: "#ffffff",
    backgroundElement: "#F0F0F3",
    backgroundSelected: "#E0E1E6",
    backgroundHeader: "rgb(255, 255, 255)",
    border: "rgb(216, 216, 216)",
    primary: "rgb(0, 122, 255)",
    onPrimary: "#ffffff",
  },
  dark: {
    text: "#ffffff",
    textSecondary: "#B0B4BA",
    background: "#000000",
    backgroundElement: "#212225",
    backgroundSelected: "#2E3135",
    backgroundHeader: "rgb(18, 18, 18)",
    border: "rgb(39, 39, 41)",
    primary: "rgb(10, 132, 255)",
    onPrimary: "#000000",
  },
} as const;

export type ColorScheme = keyof typeof Colors;
export type ColorTokenName = keyof (typeof Colors)["light"];
export type ColorTokens = Readonly<Record<ColorTokenName, string>>;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export type SpacingName = keyof typeof Spacing;

interface FontFamily {
  sans: string;
  serif: string;
  rounded: string;
  mono: string;
}

export const Fonts: FontFamily = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  android: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
});
