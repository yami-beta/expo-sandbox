import type { ReactElement } from "react";
import { Stack, usePathname, useRouter } from "expo-router";
import { useLingui } from "@lingui/react/macro";
import { Button } from "../../components/button/Button";
import { ScreenScrollView } from "../../components/screen-scroll-view/ScreenScrollView";
import { ThemedText } from "../../components/themed-text/ThemedText";

export default function CrossNavDetail(): ReactElement {
  const { t } = useLingui();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      <Stack.Screen.Title>{t`ルート Stack 画面`}</Stack.Screen.Title>
      <ScreenScrollView>
        <ThemedText type="headline">{t`ルート Stack 画面（共通遷移先）`}</ThemedText>
        <ThemedText tone="secondary">
          {t`(tabs) の外側、ルート Stack に登録された画面です。card 遷移で (tabs) ごと覆うため、表示中はタブバーが隠れます。タブA・タブB どちらの画面からでも遷移でき、戻ると遷移元の画面（とそのタブ）に復帰します。`}
        </ThemedText>
        <ThemedText type="caption" tone="tertiary" selectable>
          {t`現在地: ${pathname}`}
        </ThemedText>

        <Button variant="soft" onPress={() => router.back()}>
          {t`戻る`}
        </Button>
      </ScreenScrollView>
    </>
  );
}
