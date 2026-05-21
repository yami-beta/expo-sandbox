import type { ReactElement, ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { Spacing } from "../../constants/theme";
import { useTheme } from "../../theme/useTheme";
import { ThemedText } from "../themed-text/ThemedText";

interface PresentationSectionProps {
  title: ReactNode;
  children: ReactNode;
}

export function PresentationSection({ title, children }: PresentationSectionProps): ReactElement {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.section,
        { backgroundColor: colors.backgroundElement, borderColor: colors.border },
      ]}
    >
      <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionTitle}>
        {title}
      </ThemedText>
      <ThemedText type="default">{children}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Spacing.two,
  },
  sectionTitle: {
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
