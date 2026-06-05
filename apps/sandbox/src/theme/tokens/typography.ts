import { Platform, type TextStyle } from "react-native";

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

export type TypographyTokenName =
  | "displayLg"
  | "title"
  | "headline"
  | "body"
  | "bodyEmphasis"
  | "label"
  | "caption"
  | "code"
  | "overline";

// lineHeight は端末フォント倍率 1.0 時の基準値。RN の <Text> は allowFontScaling 既定で
// fontSize を倍率追従させるが px 指定の lineHeight は追従しないため、描画側 (ThemedText) で
// 同じ倍率を掛けてスケールさせる。トークンを直接 <Text> に渡す場合も同様の対応が要る。
export const Typography: Record<TypographyTokenName, TextStyle> = {
  displayLg: { fontSize: 34, lineHeight: 40, fontWeight: "700" },
  title: { fontSize: 28, lineHeight: 34, fontWeight: "700" },
  headline: { fontSize: 20, lineHeight: 26, fontWeight: "600" },
  body: { fontSize: 16, lineHeight: 24, fontWeight: "400" },
  bodyEmphasis: { fontSize: 16, lineHeight: 24, fontWeight: "600" },
  label: { fontSize: 14, lineHeight: 20, fontWeight: "500" },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: "400" },
  code: { fontSize: 14, lineHeight: 20, fontWeight: "400", fontFamily: Fonts.mono },
  overline: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "400",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
};
