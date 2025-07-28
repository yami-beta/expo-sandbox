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
          title: "Navigation Patterns",
        }}
      />
      <Stack.Screen
        name="modal"
        options={{
          title: "Modal Sample",
        }}
      />
      <Stack.Screen
        name="form-sheet"
        options={{
          title: "Form Sheet Sample",
        }}
      />
      <Stack.Screen
        name="modal-screen"
        options={{
          title: "Modal Screen",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="form-sheet-screen"
        options={{
          title: "Form Sheet Screen",
          presentation: "formSheet",
          sheetGrabberVisible: true,
        }}
      />
    </Stack>
  );
}
