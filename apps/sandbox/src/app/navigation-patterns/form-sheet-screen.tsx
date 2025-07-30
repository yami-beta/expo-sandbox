import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  TextInput,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useThemeContext } from "../../theme/ThemeContext";
import { useState } from "react";

export default function FormSheetScreen() {
  const { theme } = useThemeContext();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    // In a real app, you would handle form submission here
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            フォームシートの例
          </Text>
          <View style={styles.headerButtons}>
            <Pressable
              style={({ pressed }) => [
                styles.headerButton,
                pressed && styles.headerButtonPressed,
              ]}
              onPress={handleCancel}
            >
              <Text
                style={[styles.cancelButtonText, { color: theme.colors.text }]}
              >
                キャンセル
              </Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.headerButton,
                pressed && styles.headerButtonPressed,
              ]}
              onPress={handleSubmit}
            >
              <Text
                style={[styles.doneButtonText, { color: theme.colors.primary }]}
              >
                完了
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={[styles.subtitle, { color: theme.colors.text }]}>
            {Platform.OS === "ios"
              ? "フォームシート表示"
              : "モーダルフォーム（Android）"}
          </Text>

          <Text style={[styles.description, { color: theme.colors.text }]}>
            これは {Platform.OS === "ios" ? "フォームシート" : "モーダル"}
            で表示されたフォームのデモです。
            {Platform.OS === "ios" &&
              "背景に親画面が見えることに注目してください。"}
          </Text>

          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                名前
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.colors.card,
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                  },
                ]}
                value={name}
                onChangeText={setName}
                placeholder="名前を入力"
                placeholderTextColor={theme.colors.text + "80"}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                メールアドレス
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.colors.card,
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                  },
                ]}
                value={email}
                onChangeText={setEmail}
                placeholder="メールアドレスを入力"
                placeholderTextColor={theme.colors.text + "80"}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                メッセージ
              </Text>
              <TextInput
                style={[
                  styles.textArea,
                  {
                    backgroundColor: theme.colors.card,
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                  },
                ]}
                value={message}
                onChangeText={setMessage}
                placeholder="メッセージを入力"
                placeholderTextColor={theme.colors.text + "80"}
                multiline
                numberOfLines={4}
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.submitButton,
                {
                  backgroundColor: pressed
                    ? theme.colors.border
                    : theme.colors.primary,
                },
              ]}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>フォームを送信</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
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
    fontSize: 20,
    fontWeight: "bold",
  },
  headerButtons: {
    flexDirection: "row",
    gap: 15,
  },
  headerButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  headerButtonPressed: {
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  cancelButtonText: {
    fontSize: 16,
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    padding: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 25,
  },
  form: {
    marginBottom: 30,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
  },
  buttonContainer: {
    alignItems: "center",
  },
  submitButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    minWidth: 200,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
