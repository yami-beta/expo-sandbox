import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import type { ReactElement } from "react";
import { ScreenScrollView } from "../../../../components/screen-scroll-view/ScreenScrollView";
import { ThemedText } from "../../../../components/themed-text/ThemedText";

export default function RedirectCompleteScreen(): ReactElement {
  const { t } = useLingui();

  return (
    <>
      <Stack.Screen.Title>{t`送信完了`}</Stack.Screen.Title>
      <ScreenScrollView>
        <ThemedText type="headline">
          <Trans>送信が完了しました</Trans>
        </ThemedText>
        <ThemedText type="body">
          <Trans>
            処理の完了を検知した Redirect によってこの画面に遷移しました。Redirect は内部で replace
            によるナビゲーションを行うため、送信前の画面は履歴に残りません。戻るボタンを押すと送信前のフォームを経由せず、一覧画面まで戻ります(二重送信の防止にもなります)。
          </Trans>
        </ThemedText>
      </ScreenScrollView>
    </>
  );
}
