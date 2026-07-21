import { Stack } from "expo-router";
import { useLingui } from "@lingui/react/macro";
import type { ReactElement } from "react";
import { SignInGate } from "../features/auth/SignInGate";

// RequireAuth からの遷移、ホーム画面「サインインのサンプル」からの直接遷移など、
// どのページ・どのタブからでも開けるグローバルなサインイン画面。
export default function SignIn(): ReactElement {
  const { t } = useLingui();

  return (
    <>
      <Stack.Screen.Title>{t`サインイン`}</Stack.Screen.Title>
      <SignInGate />
    </>
  );
}
