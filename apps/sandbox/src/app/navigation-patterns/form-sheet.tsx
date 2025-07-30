import { StyleSheet, Text, View, Pressable, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useThemeContext } from "../../theme/ThemeContext";

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
          フォームシート表示サンプル
        </Text>

        <Text style={[styles.description, { color: theme.colors.text }]}>
          下のボタンをタップしてフォームシート表示で画面を開きます。
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
          <Text style={styles.buttonText}>フォームシートを開く</Text>
        </Pressable>

        <View style={styles.infoBox}>
          <Text style={[styles.infoTitle, { color: theme.colors.text }]}>
            フォームシート表示について：
          </Text>
          <Text style={[styles.infoText, { color: theme.colors.text }]}>
            •{" "}
            {Platform.OS === "ios"
              ? "画面全体を覆わない小さめのモーダル"
              : "Androidでは通常のモーダルとして動作"}
            {"\n"}•{" "}
            {Platform.OS === "ios"
              ? "背景に親画面を表示"
              : "Androidでは画面全体を覆います"}
            {"\n"}•{" "}
            {Platform.OS === "ios"
              ? "フォームや集中的なタスクに最適"
              : "プラットフォーム固有の動作"}
            {"\n"}• 下へのスワイプジェスチャーで閉じることができます
          </Text>
        </View>

        {Platform.OS === "android" && (
          <View
            style={[styles.noteBox, { backgroundColor: theme.colors.card }]}
          >
            <Text style={[styles.noteText, { color: theme.colors.text }]}>
              注意：フォームシート表示はiOS固有です。Androidでは通常のモーダルとして
              表示されます。
            </Text>
          </View>
        )}
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
  noteBox: {
    padding: 15,
    borderRadius: 8,
    opacity: 0.9,
  },
  noteText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
