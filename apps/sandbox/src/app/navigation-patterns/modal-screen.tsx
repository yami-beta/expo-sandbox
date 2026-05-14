import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useTheme } from "../../theme/useTheme";
import { Trans, useLingui } from "@lingui/react/macro";

export default function ModalScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { t } = useLingui();

  const closeModal = () => {
    router.back();
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Stack.Screen.Title>{t`モーダル画面`}</Stack.Screen.Title>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          <Trans>モーダル画面</Trans>
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.closeButton,
            {
              backgroundColor: pressed ? "rgba(0,0,0,0.1)" : "transparent",
            },
          ]}
          onPress={closeModal}
        >
          <Text style={[styles.closeButtonText, { color: colors.primary }]}>
            <Trans>閉じる</Trans>
          </Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          <Trans>これはモーダル表示です</Trans>
        </Text>

        <Text style={[styles.description, { color: colors.text }]}>
          <Trans>
            この画面はモーダル表示スタイルで表示されています。 以下の方法で閉じることができます：
          </Trans>
        </Text>

        <View style={styles.list}>
          <Text style={[styles.listItem, { color: colors.text }]}>
            <Trans>• 「閉じる」ボタンをタップ</Trans>
          </Text>
          <Text style={[styles.listItem, { color: colors.text }]}>
            <Trans>• 上から下へスワイプ（iOS）</Trans>
          </Text>
          <Text style={[styles.listItem, { color: colors.text }]}>
            <Trans>• 戻るジェスチャーを使用（Android）</Trans>
          </Text>
        </View>

        <View style={[styles.demoBox, { backgroundColor: colors.backgroundHeader }]}>
          <Text style={[styles.demoTitle, { color: colors.text }]}>
            <Trans>デモコンテンツ</Trans>
          </Text>
          <Text style={[styles.demoText, { color: colors.text }]}>
            <Trans>
              このモーダルにはフォーム、画像、インタラクティブな要素など、
              あらゆるコンテンツを含めることができます。
            </Trans>
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            {
              backgroundColor: pressed ? colors.border : colors.primary,
            },
          ]}
          onPress={closeModal}
        >
          <Text style={styles.primaryButtonText}>
            <Trans>完了</Trans>
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  closeButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    padding: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  list: {
    marginBottom: 30,
  },
  listItem: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 5,
  },
  demoBox: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
  },
  demoTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  demoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  primaryButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
