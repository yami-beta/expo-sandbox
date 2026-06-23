import { Stack } from "expo-router";
import { useTheme } from "../../../theme/useTheme";
import { buildStackScreenOptions } from "../../../theme/navigationScreenOptions";
import { closeHeaderBackIcon } from "../../../theme/headerCloseIcon";

// anchor（旧 initialRouteName）。コールド起動のディープリンク時のみ効く。
// このスタックは <Stack.Screen> を明示宣言しているため、anchor を指定しないと
// 初期ルートが index に固定されず、宣言順の先頭 (card/in-tab-fade) になってしまう。
// 例: sandbox://tab-b/detail でコールド起動後にホームタブを選ぶと card+fade が出る。
// anchor: index で index をスタック底に固定し、常にホームへ着地できるようにする。
export const unstable_settings = { anchor: "index" };

export default function HomeLayout() {
  const { colorScheme, tokens } = useTheme();

  return (
    <Stack screenOptions={buildStackScreenOptions(tokens.color, colorScheme)}>
      <Stack.Screen name="navigation-patterns/card/in-tab-fade" options={{ animation: "fade" }} />
      <Stack.Screen name="navigation-patterns/card/in-tab-none" options={{ animation: "none" }} />
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
        name="navigation-patterns/modal/in-tab-slide-from-bottom"
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="navigation-patterns/modal/in-tab-slide-from-bottom-back-hidden"
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="navigation-patterns/modal/in-tab-slide-from-bottom-close"
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
          headerBackIcon: closeHeaderBackIcon,
        }}
      />
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
        name="navigation-patterns/full-screen-modal/in-tab-slide-from-bottom"
        options={{
          presentation: "fullScreenModal",
          animation: "slide_from_bottom",
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="navigation-patterns/full-screen-modal/in-tab-slide-from-bottom-back-hidden"
        options={{
          presentation: "fullScreenModal",
          animation: "slide_from_bottom",
          gestureEnabled: false,
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="navigation-patterns/full-screen-modal/in-tab-slide-from-bottom-close"
        options={{
          presentation: "fullScreenModal",
          animation: "slide_from_bottom",
          gestureEnabled: false,
          headerBackIcon: closeHeaderBackIcon,
        }}
      />
      <Stack.Screen
        name="navigation-patterns/form-sheet/in-tab"
        options={{ presentation: "formSheet", sheetGrabberVisible: true }}
      />
    </Stack>
  );
}
