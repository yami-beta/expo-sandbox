import type { ReactElement } from "react";
import { Link, Stack, useNavigation, usePathname } from "expo-router";
import { useLingui } from "@lingui/react/macro";
import { Button } from "../../../components/button/Button";
import { ScreenScrollView } from "../../../components/screen-scroll-view/ScreenScrollView";
import { ThemedText } from "../../../components/themed-text/ThemedText";

export default function TabADetail(): ReactElement {
  const { t } = useLingui();
  const pathname = usePathname();
  // このタブ (tab-a) の Stack に積まれている画面数。push で増え、
  // navigate（既存の詳細へ unwind）で減る様子を観察するために表示する。
  const navigation = useNavigation();
  const stackDepth = navigation.getState()?.routes.length ?? 0;

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

        <Link href="/cross-nav/detail" push asChild>
          <Button variant="soft">{t`ルート Stack 画面へ`}</Button>
        </Link>

        <ThemedText type="label" tone="secondary">
          {t`push と navigate の違い`}
        </ThemedText>
        <ThemedText tone="secondary">
          {t`push ボタンを数回押すと画面数が増えます。その後 navigate ボタンを押すと、最初の詳細まで戻り（重複を作らず）画面数が減ります。`}
        </ThemedText>
        <ThemedText type="caption" tone="tertiary" selectable>
          {t`タブA スタックの画面数（index 含む）: ${stackDepth}`}
        </ThemedText>
        <Link href="/tab-a/detail" push asChild>
          <Button>{t`同じ詳細を push（重ねる）`}</Button>
        </Link>
        <Link href="/tab-a/detail" asChild>
          <Button variant="soft">{t`同じ詳細へ navigate（重複しない）`}</Button>
        </Link>
      </ScreenScrollView>
    </>
  );
}
