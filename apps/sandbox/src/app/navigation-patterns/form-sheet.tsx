import { StyleSheet, Text, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useThemeContext } from "../../theme/ThemeContext";
import { Trans } from "@lingui/react/macro";

export default function FormSheetSample() {
  const { theme } = useThemeContext();
  const router = useRouter();

  const openFormSheet = () => {
    router.push("/navigation-patterns/form-sheet-screen");
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          <Trans>フォームシート表示サンプル</Trans>
        </Text>

        <Text style={[styles.description, { color: theme.colors.text }]}>
          <Trans>
            下のボタンをタップしてフォームシート表示で画面を開きます。
          </Trans>
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: pressed
                ? theme.colors.border
                : theme.colors.primary,
            },
          ]}
          onPress={openFormSheet}
        >
          <Text style={styles.buttonText}>
            <Trans>フォームシートを開く</Trans>
          </Text>
        </Pressable>

        <View style={styles.infoBox}>
          <Text style={[styles.infoTitle, { color: theme.colors.text }]}>
            <Trans>フォームシート表示について：</Trans>
          </Text>
          <Text style={[styles.infoText, { color: theme.colors.text }]}>
            <Trans>
              【iOS】{"\n"}• 画面全体を覆わない小さめのモーダル{"\n"}•
              背景に親画面を表示{"\n"}• フォームや集中的なタスクに最適{"\n"}
              {"\n"}
              【Android】{"\n"}• 通常のモーダルとして動作{"\n"}•
              画面全体を覆います{"\n"}• プラットフォーム固有の動作{"\n"}
              {"\n"}
              【共通】{"\n"}• 下へのスワイプジェスチャーで閉じることができます
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
    marginBottom: 20,
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
