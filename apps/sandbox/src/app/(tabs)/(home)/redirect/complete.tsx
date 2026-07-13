import { Stack } from "expo-router";
import { useLingui } from "@lingui/react/macro";
import type { ReactElement } from "react";
import { RedirectCompleteScreen } from "../../../../features/redirect/RedirectCompleteScreen";

export default function RedirectComplete(): ReactElement {
  const { t } = useLingui();

  return (
    <>
      <Stack.Screen.Title>{t`送信完了`}</Stack.Screen.Title>
      <RedirectCompleteScreen />
    </>
  );
}
