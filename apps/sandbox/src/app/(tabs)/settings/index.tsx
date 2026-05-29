import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import { StyleSheet, View } from "react-native";
import { LinkList, LinkListItem, LinkSection } from "../../../components/link-list/LinkList";
import { ThemedText } from "../../../components/themed-text/ThemedText";
import { useTheme } from "../../../theme/useTheme";

export default function SettingsScreen() {
  const { t } = useLingui();
  const { tokens } = useTheme();

  return (
    <>
      <Stack.Screen.Title>{t`設定`}</Stack.Screen.Title>
      <LinkList>
        <LinkSection title={<Trans>外観</Trans>}>
          <LinkListItem
            href="/settings/theme"
            text={<Trans>テーマ</Trans>}
            description={<Trans>ライト / ダーク / システム</Trans>}
            leadingIcon={
              <Ionicons name="contrast-outline" size={22} color={tokens.color.text.secondary} />
            }
          />
        </LinkSection>
        <LinkSection title={<Trans>情報</Trans>}>
          <LinkListItem
            disabled
            text={<Trans>アプリ情報</Trans>}
            leadingIcon={
              <Ionicons
                name="information-circle-outline"
                size={22}
                color={tokens.color.text.tertiary}
              />
            }
            trailingBadge={
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
            }
          />
          <LinkListItem
            disabled
            text={<Trans>ライセンス</Trans>}
            leadingIcon={
              <Ionicons name="document-text-outline" size={22} color={tokens.color.text.tertiary} />
            }
          />
        </LinkSection>
      </LinkList>
    </>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 2,
  },
});
