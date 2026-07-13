import { Stack } from "expo-router";
import { useLingui } from "@lingui/react/macro";
import type { ReactElement } from "react";
import { RedirectDemoScreen } from "../../../../features/redirect/RedirectDemoScreen";

export default function RedirectDemo(): ReactElement {
  const { t } = useLingui();

  return (
    <>
      <Stack.Screen.Title>{t`Redirect`}</Stack.Screen.Title>
      <RedirectDemoScreen />
    </>
  );
}
