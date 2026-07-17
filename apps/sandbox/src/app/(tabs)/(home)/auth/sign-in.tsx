import { Stack } from "expo-router";
import { useLingui } from "@lingui/react/macro";
import type { ReactElement } from "react";
import { SignInScreen } from "../../../../features/auth/SignInScreen";

export default function SignIn(): ReactElement {
  const { t } = useLingui();
  return (
    <>
      <Stack.Screen.Title>{t`サインイン`}</Stack.Screen.Title>
      <SignInScreen />
    </>
  );
}
