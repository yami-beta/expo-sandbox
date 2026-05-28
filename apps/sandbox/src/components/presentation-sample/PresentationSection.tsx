import type { ReactElement, ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { Spacing } from "../../theme/tokens/spacing";
import { useTheme } from "../../theme/useTheme";
import { ThemedText } from "../themed-text/ThemedText";

interface PresentationSectionProps {
  title: ReactNode;
  children: ReactNode;
}

export function PresentationSection({ title, children }: PresentationSectionProps): ReactElement {
  const { tokens } = useTheme();

  return (
    <View
      style={[
        styles.section,
        {
          backgroundColor: tokens.color.background.surface,
          borderColor: tokens.color.border.subtle,
        },
      ]}
    >
      <ThemedText type="caption" tone="secondary" style={styles.sectionTitle}>
        {title}
      </ThemedText>
      <ThemedText type="body">{children}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.sm,
    padding: Spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Spacing.sm,
  },
  sectionTitle: {
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
