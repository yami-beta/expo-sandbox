import type { ReactElement } from "react";
import { Link, Stack, usePathname } from "expo-router";
import { useLingui } from "@lingui/react/macro";
import { Button } from "../../../components/button/Button";
import { ScreenScrollView } from "../../../components/screen-scroll-view/ScreenScrollView";
import { ThemedText } from "../../../components/themed-text/ThemedText";

export default function TabBIndex(): ReactElement {
  const { t } = useLingui();
  const pathname = usePathname();

  return (
    <>
      <Stack.Screen.Title>{t`タブB`}</Stack.Screen.Title>
      <ScreenScrollView>
        <ThemedText type="headline">{t`タブB トップ`}</ThemedText>
        <ThemedText tone="secondary">
          {t`このタブの Stack は anchor を指定していません。まず「タブB ページ」へ進み、各種遷移を試してください。anchor 未指定の影響はコールド起動のディープリンク時のみ現れます（「タブB 詳細」を参照）。`}
        </ThemedText>
        <ThemedText type="caption" tone="tertiary" selectable>
          {t`現在地: ${pathname}`}
        </ThemedText>

        <Link href="/tab-b/page" push asChild>
          <Button>{t`タブB ページへ push`}</Button>
        </Link>
      </ScreenScrollView>
    </>
  );
}
