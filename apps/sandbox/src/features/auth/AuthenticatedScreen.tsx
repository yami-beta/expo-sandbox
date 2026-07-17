import { Trans } from "@lingui/react/macro";
import type { ReactElement } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Button } from "../../components/button/Button";
import { ScreenScrollView } from "../../components/screen-scroll-view/ScreenScrollView";
import { ThemedText } from "../../components/themed-text/ThemedText";
import { useTheme } from "../../theme/useTheme";
import { useSession } from "./useSession";

export function AuthenticatedScreen(): ReactElement {
  const { isLoading, session, signOut } = useSession();
  const { tokens } = useTheme();

  if (isLoading) {
    return (
      <ScreenScrollView>
        <View style={[styles.pendingRow, { gap: tokens.spacing.sm }]}>
          <ActivityIndicator color={tokens.color.text.secondary} />
          <ThemedText type="body" tone="secondary">
            <Trans>読み込み中…</Trans>
          </ThemedText>
        </View>
      </ScreenScrollView>
    );
  }

  const handleSignOut = () => {
    signOut();
  };

  return (
    <ScreenScrollView>
      <ThemedText type="body">
        <Trans>サインインしています。</Trans>
      </ThemedText>
      <ThemedText type="body" tone="secondary">
        {session}
      </ThemedText>
      <View style={styles.buttonRow}>
        <Button onPress={handleSignOut}>
          <Trans>サインアウト</Trans>
        </Button>
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  pendingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonRow: {
    flexDirection: "row",
  },
});
