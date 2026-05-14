import { StyleSheet, Text, View, Pressable } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useTheme } from "../../theme/useTheme";
import { Trans, useLingui } from "@lingui/react/macro";

export default function ModalSample() {
  const { colors } = useTheme();
  const router = useRouter();
  const { t } = useLingui();

  const openModal = () => {
    router.push("/navigation-patterns/modal-screen");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen.Title>{t`モーダルサンプル`}</Stack.Screen.Title>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          <Trans>モーダル表示サンプル</Trans>
        </Text>

        <Text style={[styles.description, { color: colors.text }]}>
          <Trans>下のボタンをタップしてモーダル表示で画面を開きます。</Trans>
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: pressed ? colors.border : colors.primary,
            },
          ]}
          onPress={openModal}
        >
          <Text style={styles.buttonText}>
            <Trans>モーダルを開く</Trans>
          </Text>
        </Pressable>

        <View style={styles.infoBox}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>
            <Trans>モーダル表示について：</Trans>
          </Text>
          <Text style={[styles.infoText, { color: colors.text }]}>
            <Trans>
              • 画面全体を覆います{"\n"}• 下から上へアニメーションします{"\n"}•
              下へのスワイプジェスチャーで閉じることができます{"\n"}• 親画面との対話をブロックします
            </Trans>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 30,
    lineHeight: 24,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 30,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  infoBox: {
    padding: 15,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
