import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import type { ReactElement, ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, type ButtonVariant } from "../../../../components/button/Button";
import { Icon, type IconName } from "../../../../components/icon/Icon";
import { ThemedText } from "../../../../components/themed-text/ThemedText";
import { useTheme } from "../../../../theme/useTheme";

const ICON_NAMES: readonly IconName[] = [
  "gear",
  "palette",
  "bell",
  "heart",
  "star",
  "trash",
  "info",
  "grid",
  "download",
  "document",
  "chevron-right",
];

const BUTTON_VARIANTS: readonly ButtonVariant[] = ["solid", "soft", "outline", "ghost"];

export default function ComponentsScreen(): ReactElement {
  const { t } = useLingui();
  const { tokens } = useTheme();

  return (
    <>
      <Stack.Screen.Title>{t`コンポーネント`}</Stack.Screen.Title>
      <ScrollView
        style={{ backgroundColor: tokens.color.background.canvas }}
        contentContainerStyle={{ padding: tokens.spacing.xl, gap: tokens.spacing.xl }}
      >
        <ShowcaseSection
          title={<Trans>アイコン</Trans>}
          description={
            <Trans>iOS は SF Symbols、Android / Web は Material Icons にフォールバック</Trans>
          }
        >
          <View style={[styles.iconGrid, { gap: tokens.spacing.lg }]}>
            {ICON_NAMES.map((name) => (
              <View key={name} style={[styles.iconCell, { gap: tokens.spacing.xs }]}>
                <Icon name={name} size={28} color={tokens.color.text.secondary} />
                <ThemedText type="caption" tone="tertiary">
                  {name}
                </ThemedText>
              </View>
            ))}
          </View>
        </ShowcaseSection>

        <ShowcaseSection
          title={<Trans>ボタン</Trans>}
          description={<Trans>variant: solid / soft / outline / ghost</Trans>}
        >
          <View style={{ gap: tokens.spacing.md }}>
            {BUTTON_VARIANTS.map((variant) => (
              <View key={variant} style={[styles.buttonRow, { gap: tokens.spacing.sm }]}>
                <Button variant={variant} leadingIcon="star">
                  {variant}
                </Button>
                <Button variant={variant} disabled>
                  <Trans>無効</Trans>
                </Button>
              </View>
            ))}
            <View style={[styles.buttonRow, { gap: tokens.spacing.sm }]}>
              <Button size="sm">sm</Button>
              <Button size="md">md</Button>
              <Button size="lg">lg</Button>
            </View>
          </View>
        </ShowcaseSection>
      </ScrollView>
    </>
  );
}

interface ShowcaseSectionProps {
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
}

/**
 * showcase 画面内の 1 セクション (見出し + 説明 + 見本)。
 * 第3段の各コンポーネント PR がこの画面にセクションを足していく。
 */
export function ShowcaseSection({
  title,
  description,
  children,
}: ShowcaseSectionProps): ReactElement {
  const { tokens } = useTheme();
  return (
    <View style={{ gap: tokens.spacing.md }}>
      <View style={{ gap: tokens.spacing.xs }}>
        <ThemedText type="headline">{title}</ThemedText>
        {description ? (
          <ThemedText type="caption" tone="secondary">
            {description}
          </ThemedText>
        ) : null}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  iconCell: {
    width: 72,
    alignItems: "center",
  },
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
});
