import type { ReactElement } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Spacing } from "../../../theme/tokens/spacing";
import { useTheme } from "../../../theme/useTheme";
import { PresentationSampleBody, type PresentationSampleBodyProps } from "./PresentationSampleBody";

export type PresentationSampleOverlayProps = PresentationSampleBodyProps;

export function PresentationSampleOverlay(props: PresentationSampleOverlayProps): ReactElement {
  const router = useRouter();
  const { colors } = useTheme();

  const close = () => {
    router.back();
  };

  return (
    <View style={styles.backdrop} accessibilityViewIsModal={true}>
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={close}
        accessibilityElementsHidden={true}
        importantForAccessibility="no-hide-descendants"
      />
      <View
        style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}
      >
        <ScrollView contentContainerStyle={styles.cardScroll}>
          <PresentationSampleBody {...props} />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
  },
  card: {
    maxHeight: "85%",
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Spacing.lg,
    overflow: "hidden",
  },
  cardScroll: {
    padding: Spacing.lg,
  },
});
