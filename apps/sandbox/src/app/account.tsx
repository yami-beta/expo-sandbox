import { Stack } from "expo-router";
import { useLingui } from "@lingui/react/macro";
import type { ReactElement } from "react";
import { AuthenticatedScreen } from "../features/auth/AuthenticatedScreen";
import { RequireAuth } from "../features/auth/RequireAuth";

export default function Account(): ReactElement {
  const { t } = useLingui();
  return (
    <>
      <Stack.Screen.Title>{t`マイページ`}</Stack.Screen.Title>
      <RequireAuth>
        <AuthenticatedScreen />
      </RequireAuth>
    </>
  );
}
