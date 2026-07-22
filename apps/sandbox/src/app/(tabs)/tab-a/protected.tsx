import type { ReactElement } from "react";
import { Stack } from "expo-router";
import { useLingui } from "@lingui/react/macro";
import { ScreenScrollView } from "../../../components/screen-scroll-view/ScreenScrollView";
import { ThemedText } from "../../../components/themed-text/ThemedText";
import { RequireAuth } from "../../../features/auth/RequireAuth";

export default function TabAProtected(): ReactElement {
  const { t } = useLingui();

  return (
    <>
      <Stack.Screen.Title>{t`保護ページ`}</Stack.Screen.Title>
      <RequireAuth>
        <ScreenScrollView>
          <ThemedText type="headline">{t`保護ページ`}</ThemedText>
          <ThemedText tone="secondary">
            {t`このページは RequireAuth でラップされているため、未認証では表示されず案内とサインイン導線に置き換わります。どのタブ・どの Stack にあるページでも、同じコンポーネントで包むだけで保護を後付けできます。`}
          </ThemedText>
          <ThemedText tone="secondary">
            {t`セッションはグローバルなサインイン画面・マイページ(/account)と共有しています。そちらでサインイン/サインアウトすると、このページの表示もあわせて切り替わります。`}
          </ThemedText>
        </ScreenScrollView>
      </RequireAuth>
    </>
  );
}
