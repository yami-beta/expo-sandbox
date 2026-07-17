import { Stack } from "expo-router";
import { useLingui } from "@lingui/react/macro";
import type { ReactElement } from "react";
import { AuthenticatedScreen } from "../../../../features/auth/AuthenticatedScreen";

export default function Authenticated(): ReactElement {
  const { t } = useLingui();
  return (
    <>
      <Stack.Screen.Title>{t`マイページ`}</Stack.Screen.Title>
      <AuthenticatedScreen />
    </>
  );
}
