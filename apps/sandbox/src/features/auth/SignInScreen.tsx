import { Trans } from "@lingui/react/macro";
import type { ReactElement } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Button } from "../../components/button/Button";
import { ScreenScrollView } from "../../components/screen-scroll-view/ScreenScrollView";
import { ThemedText } from "../../components/themed-text/ThemedText";
import { useTheme } from "../../theme/useTheme";
import { useSession } from "./useSession";

export function SignInScreen(): ReactElement {
  const { isLoading, signIn } = useSession();
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

  const handleSignIn = () => {
    signIn();
  };

  return (
    <ScreenScrollView>
      <ThemedText type="body">
        <Trans>タップすると即座にサインインするサンプルです(実際の認証処理は行いません)。</Trans>
      </ThemedText>
      <View style={styles.buttonRow}>
        <Button onPress={handleSignIn}>
          <Trans>サインインする</Trans>
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
