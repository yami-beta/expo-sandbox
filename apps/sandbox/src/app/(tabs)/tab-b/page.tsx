import type { ReactElement } from "react";
import { Stack, usePathname, useRouter } from "expo-router";
import { useLingui } from "@lingui/react/macro";
import { Button } from "../../../components/button/Button";
import { ScreenScrollView } from "../../../components/screen-scroll-view/ScreenScrollView";
import { ThemedText } from "../../../components/themed-text/ThemedText";

export default function TabBPage(): ReactElement {
  const { t } = useLingui();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      <Stack.Screen.Title>{t`タブB ページ`}</Stack.Screen.Title>
      <ScreenScrollView>
        <ThemedText type="headline">{t`タブB ページ（遷移の起点）`}</ThemedText>
        <ThemedText tone="secondary">
          {t`タブB 配下の一段深いページです。ここを起点に、別タブ（タブA）配下の画面やルート Stack 画面へ遷移し、タブ切り替えと戻る挙動を観察してください。`}
        </ThemedText>
        <ThemedText type="caption" tone="tertiary" selectable>
          {t`現在地: ${pathname}`}
        </ThemedText>

        <ThemedText type="label" tone="secondary">
          {t`タブを跨いだ遷移（cross-tab・タブバーは維持）`}
        </ThemedText>
        <Button onPress={() => router.push("/tab-a/detail")}>{t`タブA 詳細へ push`}</Button>
        <Button variant="soft" onPress={() => router.navigate("/tab-a/detail")}>
          {t`タブA 詳細へ navigate`}
        </Button>

        <ThemedText type="label" tone="secondary">
          {t`ルート Stack 画面へ（タブバーを覆う）`}
        </ThemedText>
        <Button onPress={() => router.push("/cross-nav/detail")}>{t`ルート Stack 画面へ`}</Button>

        <ThemedText type="caption" tone="tertiary">
          {t`※これらはアプリ内遷移のため anchor の差は出ません。anchor の比較はコールド起動のディープリンクで行います（タブA / タブB 詳細を参照）。`}
        </ThemedText>
      </ScreenScrollView>
    </>
  );
}
