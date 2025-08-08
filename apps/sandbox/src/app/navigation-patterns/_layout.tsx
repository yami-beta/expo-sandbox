import { Stack } from "expo-router";
import { useThemeContext } from "../../theme/ThemeContext";
import { useLingui } from "@lingui/react/macro";

export default function NavigationPatternsLayout() {
  const { theme } = useThemeContext();
  const { t } = useLingui();

  return (
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
        name="index"
        options={{
          title: t`ナビゲーションパターン`,
        }}
      />
      <Stack.Screen
        name="modal"
        options={{
          title: t`モーダルサンプル`,
        }}
      />
      <Stack.Screen
        name="form-sheet"
        options={{
          title: t`フォームシートサンプル`,
        }}
      />
      <Stack.Screen
        name="modal-screen"
        options={{
          title: t`モーダル画面`,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="form-sheet-screen"
        options={{
          title: t`フォームシート画面`,
          presentation: "formSheet",
          sheetGrabberVisible: true,
        }}
      />
    </Stack>
  );
}
