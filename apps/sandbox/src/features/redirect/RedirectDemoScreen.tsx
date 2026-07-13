import { Redirect } from "expo-router";
import { Trans } from "@lingui/react/macro";
import { type ReactElement, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Button } from "../../components/button/Button";
import { ScreenScrollView } from "../../components/screen-scroll-view/ScreenScrollView";
import { ThemedText } from "../../components/themed-text/ThemedText";
import { useTheme } from "../../theme/useTheme";

type SubmitStatus = "idle" | "pending" | "done";

function simulateSubmit(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 1200));
}

export function RedirectDemoScreen(): ReactElement {
  const [status, setStatus] = useState<SubmitStatus>("idle");

  const handleSubmit = () => {
    setStatus("pending");
    void simulateSubmit().then(() => setStatus("done"));
  };

  if (status === "done") {
    return <Redirect href="/redirect/complete" />;
  }

  return (
    <ScreenScrollView>
      <ThemedText type="body">
        <Trans>
          フォーム送信のような非同期処理を模したサンプルです。「送信する」を押すと、処理の完了を待って
          Redirect が完了画面へ遷移させます。
        </Trans>
      </ThemedText>
      <ActionArea status={status} onSubmit={handleSubmit} />
    </ScreenScrollView>
  );
}

interface ActionAreaProps {
  status: Exclude<SubmitStatus, "done">;
  onSubmit: () => void;
}

function ActionArea({ status, onSubmit }: ActionAreaProps): ReactElement {
  const { tokens } = useTheme();

  switch (status) {
    case "idle":
      return (
        <View style={styles.buttonRow}>
          <Button onPress={onSubmit}>
            <Trans>送信する</Trans>
          </Button>
        </View>
      );
    case "pending":
      return (
        <View style={[styles.pendingRow, { gap: tokens.spacing.sm }]}>
          <ActivityIndicator color={tokens.color.text.secondary} />
          <ThemedText type="body" tone="secondary">
            <Trans>送信中…</Trans>
          </ThemedText>
        </View>
      );
  }
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
