import type { ReactElement } from "react";
import { Link, Stack, usePathname } from "expo-router";
import { useLingui } from "@lingui/react/macro";
import { Button } from "../../../components/button/Button";
import { ScreenScrollView } from "../../../components/screen-scroll-view/ScreenScrollView";
import { ThemedText } from "../../../components/themed-text/ThemedText";

export default function TabAIndex(): ReactElement {
  const { t } = useLingui();
  const pathname = usePathname();

  return (
    <>
      <Stack.Screen.Title>{t`タブA`}</Stack.Screen.Title>
      <ScreenScrollView>
        <ThemedText type="headline">{t`タブA トップ`}</ThemedText>
        <ThemedText tone="secondary">
          {t`このタブの Stack は anchor: index を設定しています。ただし anchor が効くのはコールド起動のディープリンク時のみで、アプリ内の遷移では無視されます（index は既定の初期ルートなので明示は冗長です）。`}
        </ThemedText>
        <ThemedText type="caption" tone="tertiary" selectable>
          {t`現在地: ${pathname}`}
        </ThemedText>

        <Link href="/tab-a/detail" push asChild>
          <Button>{t`タブA 詳細へ push`}</Button>
        </Link>
        <Link href="/cross-nav/detail" push asChild>
          <Button variant="soft">{t`ルート Stack 画面へ`}</Button>
        </Link>
        <Link href="/tab-b/detail" push asChild>
          <Button variant="soft">{t`タブB 詳細へ cross-tab`}</Button>
        </Link>
      </ScreenScrollView>
    </>
  );
}
