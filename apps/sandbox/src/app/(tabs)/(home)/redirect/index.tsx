import { Redirect, Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import { type ReactElement, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Button } from "../../../../components/button/Button";
import { ScreenScrollView } from "../../../../components/screen-scroll-view/ScreenScrollView";
import { ThemedText } from "../../../../components/themed-text/ThemedText";
import { useTheme } from "../../../../theme/useTheme";

type SubmitStatus = "idle" | "pending" | "done";

function simulateSubmit(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 1200));
}

export default function RedirectDemo(): ReactElement {
  const { t } = useLingui();
  const { tokens } = useTheme();
  const [status, setStatus] = useState<SubmitStatus>("idle");

  const handleSubmit = () => {
    setStatus("pending");
    void simulateSubmit().then(() => setStatus("done"));
  };

  return (
    <>
      {/*
        Stack.Screen.Title は useSafeLayoutEffect でヘッダーオプションを登録/解除する。
        status === "done" の分岐をトップレベルの早期 return にすると、Redirect への
        差し替えと同時にこのタイトルがアンマウントされてオプション解除が走り、Redirect の
        router.replace (画面のスタックからの除去) と競合して Android で
        "ScreenStackFragment added into a non-stack container" のクラッシュを起こす。
        画面が生きている間は常にマウントし、本文だけを出し分ける。
      */}
      <Stack.Screen.Title>{t`Redirect`}</Stack.Screen.Title>
      {status === "done" ? (
        <Redirect href="/redirect/complete" />
      ) : (
        <ScreenScrollView>
          <ThemedText type="body">
            <Trans>
              フォーム送信のような非同期処理を模したサンプルです。「送信する」を押すと、処理の完了を待って
              Redirect が完了画面へ遷移させます。
            </Trans>
          </ThemedText>
          {status === "pending" ? (
            <View style={[styles.pendingRow, { gap: tokens.spacing.sm }]}>
              <ActivityIndicator color={tokens.color.text.secondary} />
              <ThemedText type="body" tone="secondary">
                <Trans>送信中…</Trans>
              </ThemedText>
            </View>
          ) : (
            <View style={styles.buttonRow}>
              <Button onPress={handleSubmit}>
                <Trans>送信する</Trans>
              </Button>
            </View>
          )}
        </ScreenScrollView>
      )}
    </>
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
