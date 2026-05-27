// Intl APIのPolyfill（React Native向け）
// 他のインポートより前に配置する必要がある
import "@formatjs/intl-locale/polyfill-force.js";
import "@formatjs/intl-pluralrules/polyfill-force.js";
import "@formatjs/intl-pluralrules/locale-data/ja.js"; // 日本語のlocale data
import "@formatjs/intl-pluralrules/locale-data/en.js"; // 英語のlocale data
import "@formatjs/intl-relativetimeformat/polyfill-force.js";
import "@formatjs/intl-relativetimeformat/locale-data/ja.js"; // 日本語のlocale data
import "@formatjs/intl-relativetimeformat/locale-data/en.js"; // 英語のlocale data

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { I18nProvider } from "@lingui/react";
import { i18n } from "@lingui/core";
import { ThemeProvider } from "../theme/ThemeContext";
import { useTheme } from "../theme/useTheme";
import { buildStackScreenOptions } from "../theme/navigationScreenOptions";
import { initializeI18n } from "../i18n";

// アプリ起動時に一度だけi18nを初期化（デバイスの言語設定を読み込む）
initializeI18n();

function RootLayoutContent() {
  const { colorScheme, tokens } = useTheme();

  return (
    <>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Stack screenOptions={buildStackScreenOptions(tokens.color, colorScheme)}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="navigation-patterns/modal/on-root"
          options={{ presentation: "modal" }}
        />
        <Stack.Screen
          name="navigation-patterns/transparent-modal/on-root"
          options={{
            presentation: "transparentModal",
            animation: "fade",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="navigation-patterns/full-screen-modal/on-root"
          options={{
            presentation: "fullScreenModal",
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="navigation-patterns/form-sheet/on-root"
          options={{ presentation: "formSheet", sheetGrabberVisible: true }}
        />
        <Stack.Screen
          name="navigation-patterns/contained-modal/on-root"
          options={{ presentation: "containedModal" }}
        />
        <Stack.Screen
          name="navigation-patterns/contained-transparent-modal/on-root"
          options={{
            presentation: "containedTransparentModal",
            animation: "fade",
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <I18nProvider i18n={i18n}>
      <ThemeProvider>
        <RootLayoutContent />
      </ThemeProvider>
    </I18nProvider>
  );
}
