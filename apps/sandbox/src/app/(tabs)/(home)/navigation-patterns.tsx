import { StyleSheet, Text, View, ScrollView } from "react-native";
import { Link } from "expo-router";
import { useThemeContext } from "../../../theme/ThemeContext";

export default function NavigationPatterns() {
  const { theme } = useThemeContext();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Navigation Patterns
        </Text>

        <Text style={[styles.description, { color: theme.colors.text }]}>
          This screen demonstrates navigation patterns in Expo Router with
          nested navigators.
        </Text>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Current Route Structure:
          </Text>
          <Text style={[styles.code, { color: theme.colors.text }]}>
            /navigation-patterns
          </Text>
        </View>

        <View style={styles.section}>
          <Link
            href="/settings"
            style={[styles.link, { color: theme.colors.primary }]}
          >
            Go to Settings Tab
          </Link>
        </View>

        <View style={styles.section}>
          <Link
            href="/settings/theme"
            style={[styles.link, { color: theme.colors.primary }]}
          >
            Go directly to Theme Settings
          </Link>
        </View>
      </View>
    </ScrollView>
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
    marginBottom: 20,
    lineHeight: 24,
  },
  section: {
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
  },
  code: {
    fontFamily: "monospace",
    fontSize: 14,
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 5,
  },
  link: {
    fontSize: 16,
    textDecorationLine: "underline",
    paddingVertical: 5,
  },
});
