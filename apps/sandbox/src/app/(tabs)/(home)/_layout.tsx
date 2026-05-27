import { Stack } from "expo-router";
import { useTheme } from "../../../theme/useTheme";
import { buildStackScreenOptions } from "../../../theme/navigationScreenOptions";

export default function HomeLayout() {
  const { colorScheme, tokens } = useTheme();

  return (
    <Stack screenOptions={buildStackScreenOptions(tokens.color, colorScheme)}>
      <Stack.Screen
        name="navigation-patterns/contained-modal/in-tab"
        options={{ presentation: "containedModal" }}
      />
      <Stack.Screen
        name="navigation-patterns/contained-transparent-modal/in-tab"
        options={{
          presentation: "containedTransparentModal",
          animation: "fade",
          headerShown: false,
        }}
      />
      <Stack.Screen name="navigation-patterns/modal/in-tab" options={{ presentation: "modal" }} />
      <Stack.Screen
        name="navigation-patterns/transparent-modal/in-tab"
        options={{
          presentation: "transparentModal",
          animation: "fade",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="navigation-patterns/full-screen-modal/in-tab"
        options={{
          presentation: "fullScreenModal",
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="navigation-patterns/form-sheet/in-tab"
        options={{ presentation: "formSheet", sheetGrabberVisible: true }}
      />
    </Stack>
  );
}
