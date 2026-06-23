import type { ReactElement } from "react";
import { Stack, usePathname, useRouter } from "expo-router";
import { useLingui } from "@lingui/react/macro";
import { Button } from "../../../components/button/Button";
import { ScreenScrollView } from "../../../components/screen-scroll-view/ScreenScrollView";
import { ThemedText } from "../../../components/themed-text/ThemedText";

export default function TabAIndex(): ReactElement {
  const { t } = useLingui();
  const router = useRouter();
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

        <Button onPress={() => router.push("/tab-a/detail")}>{t`タブA 詳細へ push`}</Button>
        <Button variant="soft" onPress={() => router.push("/cross-nav/detail")}>
          {t`ルート Stack 画面へ`}
        </Button>
        <Button variant="soft" onPress={() => router.push("/tab-b/detail")}>
          {t`タブB 詳細へ cross-tab`}
        </Button>
      </ScreenScrollView>
    </>
  );
}
