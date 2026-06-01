import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import type { ReactElement, ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { BlurOverlay } from "../../../../components/blur-overlay/BlurOverlay";
import { Button, type ButtonVariant } from "../../../../components/button/Button";
import { Card } from "../../../../components/card/Card";
import type { HapticStyle } from "../../../../components/haptics/usePressHaptics";
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

const HAPTIC_STYLES: readonly HapticStyle[] = [
  "light",
  "medium",
  "heavy",
  "selection",
  "success",
  "warning",
  "error",
];

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

        <ShowcaseSection
          title={<Trans>カード</Trans>}
          description={<Trans>surface elevation + padding 規約 (dark は border で階層)</Trans>}
        >
          <View style={{ gap: tokens.spacing.md }}>
            <Card>
              <View style={{ gap: tokens.spacing.md }}>
                <View style={{ gap: tokens.spacing.xs }}>
                  <ThemedText type="bodyEmphasis">
                    <Trans>surface カード</Trans>
                  </ThemedText>
                  <ThemedText type="caption" tone="secondary">
                    <Trans>tone: surface / elevation: sm / padding: lg</Trans>
                  </ThemedText>
                </View>
                <View style={{ alignSelf: "flex-start" }}>
                  <Button size="sm" variant="soft" leadingIcon="heart">
                    <Trans>アクション</Trans>
                  </Button>
                </View>
              </View>
            </Card>
            <Card tone="surfaceElevated" elevation="md">
              <View style={{ gap: tokens.spacing.xs }}>
                <ThemedText type="bodyEmphasis">
                  <Trans>surfaceElevated カード</Trans>
                </ThemedText>
                <ThemedText type="caption" tone="secondary">
                  <Trans>tone: surfaceElevated / elevation: md</Trans>
                </ThemedText>
              </View>
            </Card>
          </View>
        </ShowcaseSection>

        <ShowcaseSection
          title={<Trans>触覚フィードバック</Trans>}
          description={<Trans>expo-haptics 連動の押下フィードバック。Web は no-op</Trans>}
        >
          <View style={[styles.buttonRow, { gap: tokens.spacing.sm }]}>
            {HAPTIC_STYLES.map((style) => (
              <Button key={style} variant="soft" size="sm" haptic={style}>
                {style}
              </Button>
            ))}
          </View>
        </ShowcaseSection>

        <ShowcaseSection
          title={<Trans>ブラー (BlurView)</Trans>}
          description={<Trans>colorScheme 連動の半透明ブラー。ヘッダ / overlay 用途</Trans>}
        >
          <View style={[styles.blurDemo, { borderRadius: tokens.radius.lg }]}>
            <View style={styles.blurBackdrop}>
              <View style={{ flex: 1, backgroundColor: tokens.color.accent.solid }} />
              <View style={{ flex: 1, backgroundColor: tokens.color.accent.softHover }} />
              <View style={{ flex: 1, backgroundColor: tokens.color.accent.solidHover }} />
              <View style={{ flex: 1, backgroundColor: tokens.color.background.surface }} />
            </View>
            <BlurOverlay style={styles.blurHeader}>
              <ThemedText type="bodyEmphasis">
                <Trans>ブラーヘッダ</Trans>
              </ThemedText>
            </BlurOverlay>
            <BlurOverlay style={styles.blurFooter}>
              <ThemedText type="caption" tone="secondary">
                <Trans>下部 overlay</Trans>
              </ThemedText>
            </BlurOverlay>
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
  blurDemo: {
    height: 180,
    overflow: "hidden",
  },
  blurBackdrop: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
  },
  blurHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 56,
    justifyContent: "center",
  },
  blurFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
