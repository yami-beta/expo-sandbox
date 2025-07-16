import { Stack } from "expo-router";

export default function NavigationPatternsLayout() {
  return (
    <Stack>
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
        }}
      />
    </Stack>
  );
}
