import { Ionicons } from "@react-native-vector-icons/ionicons/static";
import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import { StyleSheet, View } from "react-native";
import { GroupedList, type ListSection } from "../../../components/grouped-list/GroupedList";
import { ThemedText } from "../../../components/themed-text/ThemedText";
import { useTheme } from "../../../theme/useTheme";

export default function SettingsScreen() {
  const { t } = useLingui();
  const { tokens } = useTheme();

  const versionBadge = (
    <View
      style={[
        styles.badge,
        {
          paddingHorizontal: tokens.spacing.sm,
          borderRadius: tokens.radius.sm,
          backgroundColor: tokens.color.background.subtle,
        },
      ]}
    >
      <ThemedText type="caption" tone="secondary">
        v1.0
      </ThemedText>
    </View>
  );

  const sections = [
    {
      title: <Trans>一般</Trans>,
      iconSlotReserved: true,
      data: [
        {
          href: "/settings/language",
          text: <Trans>言語</Trans>,
          description: <Trans>システム / 日本語 / 英語</Trans>,
          leadingIcon: (
            <Ionicons
              name="language-outline"
              size={22}
              color={tokens.color.text.secondary}
              accessibilityElementsHidden={true}
              importantForAccessibility="no-hide-descendants"
            />
          ),
        },
      ],
    },
    {
      title: <Trans>外観</Trans>,
      iconSlotReserved: true,
      data: [
        {
          href: "/settings/theme",
          text: <Trans>テーマ</Trans>,
          description: <Trans>ライト / ダーク / システム</Trans>,
          leadingIcon: (
            <Ionicons
              name="contrast-outline"
              size={22}
              color={tokens.color.text.secondary}
              accessibilityElementsHidden={true}
              importantForAccessibility="no-hide-descendants"
            />
          ),
        },
      ],
    },
    {
      title: <Trans>情報</Trans>,
      iconSlotReserved: true,
      data: [
        {
          disabled: true,
          text: <Trans>アプリ情報</Trans>,
          leadingIcon: (
            <Ionicons
              name="information-circle-outline"
              size={22}
              color={tokens.color.text.tertiary}
              accessibilityElementsHidden={true}
              importantForAccessibility="no-hide-descendants"
            />
          ),
          trailingBadge: versionBadge,
        },
        {
          disabled: true,
          text: <Trans>ライセンス</Trans>,
          leadingIcon: (
            <Ionicons
              name="document-text-outline"
              size={22}
              color={tokens.color.text.tertiary}
              accessibilityElementsHidden={true}
              importantForAccessibility="no-hide-descendants"
            />
          ),
        },
      ],
    },
  ] as const satisfies ListSection[];

  return (
    <>
      <Stack.Screen.Title>{t`設定`}</Stack.Screen.Title>
      <GroupedList sections={sections} />
    </>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 2,
  },
});
