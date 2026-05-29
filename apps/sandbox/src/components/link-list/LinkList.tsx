import type { ReactElement, ReactNode } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useTheme } from "../../theme/useTheme";

export { LinkListItem } from "./LinkListItem";
export { LinkSection } from "./LinkSection";

interface LinkListProps {
  children: ReactNode;
}

export function LinkList({ children }: LinkListProps): ReactElement {
  const { tokens } = useTheme();

  return (
    <ScrollView
      style={{ backgroundColor: tokens.color.background.canvas }}
      contentContainerStyle={[
        styles.container,
        { padding: tokens.spacing.xl, gap: tokens.spacing.xl },
      ]}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});
