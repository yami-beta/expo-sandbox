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
import { ThemeProvider, useThemeContext } from "../theme/ThemeContext";
import { initializeI18n } from "../i18n";
import { useLingui } from "@lingui/react/macro";

// アプリ起動時に一度だけi18nを初期化（デバイスの言語設定を読み込む）
initializeI18n();

function RootLayoutContent() {
  const { isDark, theme } = useThemeContext();
  const { t } = useLingui();

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.card,
          },
          headerTintColor: theme.colors.text,
          headerShadowVisible: !theme.dark,
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false, title: t`ホーム` }}
        />
        <Stack.Screen
          name="navigation-patterns/index"
          options={{
            title: t`ナビゲーションパターン`,
          }}
        />
        <Stack.Screen
          name="navigation-patterns/modal"
          options={{
            title: t`モーダルサンプル`,
          }}
        />
        <Stack.Screen
          name="navigation-patterns/form-sheet"
          options={{
            title: t`フォームシートサンプル`,
          }}
        />
        <Stack.Screen
          name="navigation-patterns/modal-screen"
          options={{
            title: t`モーダル画面`,
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="navigation-patterns/form-sheet-screen"
          options={{
            title: t`フォームシート画面`,
            presentation: "formSheet",
            sheetGrabberVisible: true,
          }}
        />
        <Stack.Screen
          name="lingui-examples/index"
          options={{
            title: t`Lingui学習サンプル`,
          }}
        />
        <Stack.Screen
          name="lingui-examples/plural-examples"
          options={{
            title: t`Pluralコンポーネント`,
          }}
        />
        <Stack.Screen
          name="lingui-examples/select-examples"
          options={{
            title: t`Selectマクロ`,
          }}
        />
        <Stack.Screen
          name="lingui-examples/selectordinal-examples"
          options={{
            title: t`SelectOrdinalマクロ`,
          }}
        />
        <Stack.Screen
          name="lingui-examples/format-examples"
          options={{
            title: t`フォーマット機能`,
          }}
        />
        <Stack.Screen
          name="lingui-examples/navigation-tabbar-examples"
          options={{
            title: t`タブバーの動的機能`,
          }}
        />
        <Stack.Screen
          name="lingui-examples/navigation-breadcrumb-examples"
          options={{
            title: t`パンくずリスト`,
          }}
        />
        <Stack.Screen
          name="lingui-examples/modal-dialog-examples"
          options={{
            title: t`モーダルダイアログ`,
          }}
        />
        <Stack.Screen
          name="lingui-examples/dynamic-content-examples"
          options={{
            title: t`動的コンテンツの翻訳`,
          }}
        />
        <Stack.Screen
          name="lingui-examples/error-handling-examples"
          options={{
            title: t`エラーハンドリング`,
          }}
        />
        <Stack.Screen
          name="lingui-examples/notification-alert-examples"
          options={{
            title: t`通知とアラート`,
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
