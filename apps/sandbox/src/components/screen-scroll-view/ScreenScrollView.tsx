import type { ReactElement, ReactNode } from "react";
import { ScrollView } from "react-native";
import { useTheme } from "../../theme/useTheme";

interface ScreenScrollViewProps {
  children: ReactNode;
}

/**
 * スクリーン直下に置くスクロールコンテナの規約
 * (canvas 背景 + padding xl + セクション間 gap xl)。
 * `GroupedList` は SectionList ベースのため同じ規約を自前で実装しており対になる。
 */
export function ScreenScrollView({ children }: ScreenScrollViewProps): ReactElement {
  const { tokens } = useTheme();

  return (
    <ScrollView
      style={{ backgroundColor: tokens.color.background.canvas }}
      contentContainerStyle={{ padding: tokens.spacing.xl, gap: tokens.spacing.xl }}
    >
      {children}
    </ScrollView>
  );
}
