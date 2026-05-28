import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import { StyleSheet, View } from "react-native";
import { LinkList, LinkSection, type LinkItem } from "../../../components/link-list/LinkList";
import { ThemedText } from "../../../components/themed-text/ThemedText";
import { useTheme } from "../../../theme/useTheme";

export default function SettingsScreen() {
  const { t } = useLingui();
  const { tokens } = useTheme();

  const appearanceItems = [
    {
      href: "/settings/theme",
      text: <Trans>テーマ</Trans>,
      description: <Trans>ライト / ダーク / システム</Trans>,
      leadingIcon: (
        <Ionicons name="contrast-outline" size={22} color={tokens.color.text.secondary} />
      ),
    },
  ] as const satisfies LinkItem[];

  const infoItems = [
    {
      href: "/settings",
      text: <Trans>アプリ情報</Trans>,
      leadingIcon: (
        <Ionicons name="information-circle-outline" size={22} color={tokens.color.text.tertiary} />
      ),
      trailingBadge: (
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
      ),
      disabled: true,
    },
    {
      href: "/settings",
      text: <Trans>ライセンス</Trans>,
      leadingIcon: (
        <Ionicons name="document-text-outline" size={22} color={tokens.color.text.tertiary} />
      ),
      disabled: true,
    },
  ] as const satisfies LinkItem[];

  return (
    <>
      <Stack.Screen.Title>{t`設定`}</Stack.Screen.Title>
      <LinkList>
        <LinkSection title={<Trans>外観</Trans>} data={appearanceItems} />
        <LinkSection title={<Trans>情報</Trans>} data={infoItems} />
      </LinkList>
    </>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 2,
  },
});
