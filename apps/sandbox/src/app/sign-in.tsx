import { Stack } from "expo-router";
import { useLingui } from "@lingui/react/macro";
import type { ReactElement } from "react";
import { SignInScreen } from "../features/auth/SignInScreen";

// RequireAuth のフォールバックやホーム画面「サインインのサンプル」からの遷移先となる
// グローバルなサインイン画面。認証済みでこの画面へ遷移しようとした場合は Stack.Protected
// (app/_layout.tsx) のフォールバックで (tabs) に戻されるため、ここには未認証状態で
// しか到達しない。
export default function SignIn(): ReactElement {
  const { t } = useLingui();

  return (
    <>
      <Stack.Screen.Title>{t`サインイン`}</Stack.Screen.Title>
      <SignInScreen />
    </>
  );
}
