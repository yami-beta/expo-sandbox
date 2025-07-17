import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  TextInput,
  Platform,
} from "react-native";
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
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Form Sheet Example
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
              Cancel
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
              Done
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={[styles.subtitle, { color: theme.colors.text }]}>
          {Platform.OS === "ios"
            ? "Form Sheet Presentation"
            : "Modal Form (Android)"}
        </Text>

        <Text style={[styles.description, { color: theme.colors.text }]}>
          This demonstrates a form presented in a{" "}
          {Platform.OS === "ios" ? "form sheet" : "modal"}.
          {Platform.OS === "ios" &&
            " Notice how you can see the parent screen in the background."}
        </Text>

        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Name
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
              placeholder="Enter your name"
              placeholderTextColor={theme.colors.text + "80"}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Email
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
              placeholder="Enter your email"
              placeholderTextColor={theme.colors.text + "80"}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Message
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
              placeholder="Enter your message"
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
                  ? theme.colors.primaryLight
                  : theme.colors.primary,
              },
            ]}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Submit Form</Text>
          </Pressable>
        </View>
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
