import type { ReactElement } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Spacing } from "../../constants/theme";
import { useTheme } from "../../theme/useTheme";
import { PresentationSampleBody, type PresentationSampleBodyProps } from "./PresentationSampleBody";

export type PresentationSampleScreenProps = PresentationSampleBodyProps;

export function PresentationSampleScreen(props: PresentationSampleScreenProps): ReactElement {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContent}
        nestedScrollEnabled
      >
        <PresentationSampleBody {...props} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.three,
    gap: Spacing.three,
  },
});
