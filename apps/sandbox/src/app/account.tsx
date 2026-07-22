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
      {/* サインイン画面とこの画面は同じ認証状態を映す1箇所なので、往復でスタックを
          積み上げないよう replace で遷移する(features/auth/RequireAuth.tsx 参照) */}
      <RequireAuth replace>
        <AuthenticatedScreen />
      </RequireAuth>
    </>
  );
}
