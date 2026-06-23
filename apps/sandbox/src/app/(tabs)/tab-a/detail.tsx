import type { ReactElement } from "react";
import { Stack, usePathname, useRouter } from "expo-router";
import { useLingui } from "@lingui/react/macro";
import { Button } from "../../../components/button/Button";
import { ScreenScrollView } from "../../../components/screen-scroll-view/ScreenScrollView";
import { ThemedText } from "../../../components/themed-text/ThemedText";

export default function TabADetail(): ReactElement {
  const { t } = useLingui();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      <Stack.Screen.Title>{t`タブA 詳細`}</Stack.Screen.Title>
      <ScreenScrollView>
        <ThemedText type="headline">{t`タブA 詳細（anchor あり）`}</ThemedText>
        <ThemedText tone="secondary">
          {t`anchor: index のタブの詳細です。アプリ内の cross-tab 遷移では anchor は無視され、戻ると自タブ（タブA）の index に着地します（遷移元タブには戻りません）。`}
        </ThemedText>
        <ThemedText tone="secondary">
          {t`anchor の効果はコールド起動のディープリンクで現れます。アプリを終了し、次のコマンドで起動すると下に index が敷かれ、「戻る」でタブAトップへ戻れます。`}
        </ThemedText>
        <ThemedText type="code" tone="secondary" selectable>
          {'xcrun simctl openurl booted "sandbox://tab-a/detail"'}
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
