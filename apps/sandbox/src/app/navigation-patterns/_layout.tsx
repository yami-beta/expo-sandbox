import { Stack } from "expo-router";
import { useThemeContext } from "../../theme/ThemeContext";

export default function NavigationPatternsLayout() {
  const { theme } = useThemeContext();

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
          title: "ナビゲーションパターン",
        }}
      />
      <Stack.Screen
        name="modal"
        options={{
          title: "モーダルサンプル",
        }}
      />
      <Stack.Screen
        name="form-sheet"
        options={{
          title: "フォームシートサンプル",
        }}
      />
      <Stack.Screen
        name="modal-screen"
        options={{
          title: "モーダル画面",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="form-sheet-screen"
        options={{
          title: "フォームシート画面",
          presentation: "formSheet",
          sheetGrabberVisible: true,
        }}
      />
    </Stack>
  );
}
