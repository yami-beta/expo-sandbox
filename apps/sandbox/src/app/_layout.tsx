import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { I18nProvider } from "@lingui/react";
import { i18n } from "@lingui/core";
import { ThemeProvider, useThemeContext } from "../theme/ThemeContext";
import { initI18n } from "../i18n";

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
  // i18nを同期的に初期化
  useEffect(() => {
    initI18n();
  }, []);

  return (
    <I18nProvider i18n={i18n}>
      <ThemeProvider>
        <RootLayoutContent />
      </ThemeProvider>
    </I18nProvider>
  );
}
