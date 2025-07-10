import { StyleSheet, Text, View } from "react-native";
import { useThemeContext } from "../../theme/ThemeContext";

export default function Index() {
  const { theme } = useThemeContext();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text style={[styles.text, { color: theme.colors.text }]}>
        Welcome to the app!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "500",
  },
});
