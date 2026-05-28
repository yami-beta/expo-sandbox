// WCAG コントラスト比 (light / dark で text vs background):
// - text.primary (#1A1A1A on #FFFFFF / #FAFAFA on #0B0B0B) ≈ 17.8:1 / 18.5:1 (AAA)
// - text.secondary on canvas ≈ 6.97:1 / 9.85:1 (AAA)
// 参考: docs.expo.dev のアクセシビリティガイド / WCAG 2.2

export type ColorScheme = "light" | "dark";

type GrayScale = readonly [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
];

const lightNeutral: GrayScale = [
  "#FFFFFF",
  "#FCFCFC",
  "#F8F8F8",
  "#F1F1F1",
  "#EBEBEB",
  "#E4E4E4",
  "#DCDCDC",
  "#D2D2D2",
  "#C0C0C0",
  "#8F8F8F",
  "#7C7C7C",
  "#5F5F5F",
  "#1A1A1A",
];

const darkNeutral: GrayScale = [
  "#0B0B0B",
  "#111111",
  "#151515",
  "#1E1E1E",
  "#232323",
  "#282828",
  "#2E2E2E",
  "#383838",
  "#494949",
  "#6F6F6F",
  "#888888",
  "#B0B0B0",
  "#FAFAFA",
];

const lightAccent: GrayScale = [
  "#FBFDFF",
  "#F4FAFF",
  "#E6F2FF",
  "#D5E9FF",
  "#C2DEFF",
  "#ACD0FF",
  "#8EBDFF",
  "#5FA2FF",
  "#3B8BFF",
  "#007AFF",
  "#006FE7",
  "#005EC4",
  "#002F66",
];

const darkAccent: GrayScale = [
  "#0A1421",
  "#0E1E33",
  "#102844",
  "#133358",
  "#16406C",
  "#1A4F87",
  "#1F61A9",
  "#2778CC",
  "#0568D9",
  "#0A84FF",
  "#2F90FF",
  "#7CB6FF",
  "#E2EEFF",
];

export const palette = {
  light: { neutral: lightNeutral, accent: lightAccent },
  dark: { neutral: darkNeutral, accent: darkAccent },
} as const;

interface SemanticColorTokens {
  background: {
    canvas: string;
    surface: string;
    surfaceElevated: string;
    subtle: string;
    pressed: string;
  };
  border: {
    subtle: string;
    default: string;
    strong: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    disabled: string;
    onAccent: string;
    link: string;
  };
  accent: {
    solid: string;
    solidHover: string;
    text: string;
  };
}

export type { SemanticColorTokens };

const buildSemantic = (n: GrayScale, a: GrayScale): SemanticColorTokens => ({
  background: {
    canvas: n[0],
    surface: n[1],
    surfaceElevated: n[2],
    subtle: n[3],
    pressed: n[4],
  },
  border: {
    subtle: n[5],
    default: n[7],
    strong: n[8],
  },
  text: {
    primary: n[12],
    secondary: n[11],
    tertiary: n[10],
    disabled: n[8],
    onAccent: n[0],
    link: a[11],
  },
  accent: {
    solid: a[9],
    solidHover: a[10],
    text: a[11],
  },
});

export const semanticColors = {
  light: buildSemantic(lightNeutral, lightAccent),
  dark: buildSemantic(darkNeutral, darkAccent),
} as const;
