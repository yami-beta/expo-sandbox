import type { ReactElement } from "react";
import { Stack, usePathname, useRouter } from "expo-router";
import { useLingui } from "@lingui/react/macro";
import { Button } from "../../../components/button/Button";
import { ScreenScrollView } from "../../../components/screen-scroll-view/ScreenScrollView";
import { ThemedText } from "../../../components/themed-text/ThemedText";

export default function TabBDetail(): ReactElement {
  const { t } = useLingui();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      <Stack.Screen.Title>{t`タブB 詳細`}</Stack.Screen.Title>
      <ScreenScrollView>
        <ThemedText type="headline">{t`タブB 詳細（anchor なし）`}</ThemedText>
        <ThemedText tone="secondary">
          {t`anchor 未指定のタブの詳細です。アプリ内 push で来た場合は index が表示済みのため「戻る」でタブBトップへ戻れますが、これは anchor の効果ではありません。`}
        </ThemedText>
        <ThemedText tone="secondary">
          {t`違いはコールド起動のディープリンクで現れます。アプリを終了し次のコマンドで起動すると、detail が起点になり「戻る」が出ません（anchor: index のタブAとの差）。`}
        </ThemedText>
        <ThemedText type="code" tone="secondary" selectable>
          {'xcrun simctl openurl booted "sandbox://tab-b/detail"'}
        </ThemedText>
        <ThemedText type="caption" tone="tertiary" selectable>
          {t`現在地: ${pathname}`}
        </ThemedText>

        <Button variant="soft" onPress={() => router.push("/cross-nav/detail")}>
          {t`ルート Stack 画面へ`}
        </Button>
      </ScreenScrollView>
    </>
  );
}
