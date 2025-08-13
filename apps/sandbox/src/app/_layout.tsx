// Intl APIのPolyfill（React Native向け）
// 他のインポートより前に配置する必要がある
import "@formatjs/intl-locale/polyfill-force";
import "@formatjs/intl-pluralrules/polyfill-force";
import "@formatjs/intl-pluralrules/locale-data/ja"; // 日本語のlocale data
import "@formatjs/intl-pluralrules/locale-data/en"; // 英語のlocale data

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { I18nProvider } from "@lingui/react";
import { i18n } from "@lingui/core";
import { ThemeProvider, useThemeContext } from "../theme/ThemeContext";
import { initializeI18n } from "../i18n";

// アプリ起動時に一度だけi18nを初期化（デバイスの言語設定を読み込む）
initializeI18n();

function RootLayoutContent() {
  const { isDark } = useThemeContext();

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false, title: "Home" }}
        />
        <Stack.Screen
          name="navigation-patterns"
          options={{ headerShown: false }}
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
