import { StyleSheet, Text, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useThemeContext } from "../../theme/ThemeContext";

export default function ModalSample() {
  const { theme } = useThemeContext();
  const router = useRouter();

  const openModal = () => {
    router.push("/navigation-patterns/modal-screen");
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Modal Presentation Sample
        </Text>

        <Text style={[styles.description, { color: theme.colors.text }]}>
          Tap the button below to open a screen with modal presentation.
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
          onPress={openModal}
        >
          <Text style={styles.buttonText}>Open Modal</Text>
        </Pressable>

        <View style={styles.infoBox}>
          <Text style={[styles.infoTitle, { color: theme.colors.text }]}>
            About Modal Presentation:
          </Text>
          <Text style={[styles.infoText, { color: theme.colors.text }]}>
            • Covers the entire screen{"\n"}• Animates from bottom to top{"\n"}•
            Can be dismissed with swipe down gesture{"\n"}• Blocks interaction
            with the parent screen
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
