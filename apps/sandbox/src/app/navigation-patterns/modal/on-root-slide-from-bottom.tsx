import type { ReactElement } from "react";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Trans, useLingui } from "@lingui/react/macro";
import { PresentationSampleScreen } from "../../../features/navigation-patterns/presentation-sample/PresentationSampleScreen";

export default function ModalSlideFromBottomOnRootSample(): ReactElement {
  const { t } = useLingui();

  return (
    <>
      <Stack.Screen.Title>{t`modal + slide_from_bottom`}</Stack.Screen.Title>
      <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
        <PresentationSampleScreen
          presentationValue="modal + slide_from_bottom"
          heading={<Trans>ルート Stack で modal を両 OS で下からスライドさせる</Trans>}
          iosBehavior={
            <Trans>
              modal は iOS では元から下から上にスライドするため、`animation: slide_from_bottom` を
              足しても見た目の差は小さい。ルート Stack
              配下なのでタブバーごと画面全体を覆う。上端からの swipe down で閉じられる。
            </Trans>
          }
          androidBehavior={
            <Trans>
              animation 未指定だと OS 標準の遷移 (多くは右からスライド) でタブバーが消えた push
              同様に なるが、`animation: slide_from_bottom`
              を指定すると画面全体を覆ったまま「下から上」に スライドする。in-tab
              版と違いタブバーごと覆うので modal らしい全画面の遷移になる。戻る ボタン /
              システムジェスチャーで閉じられる。
            </Trans>
          }
          dismissNote={
            <Trans>
              「閉じる」ボタン、iOS の swipe down、Android の戻る操作で閉じる。同じ on-root の
              animation 未指定版 (Android は右スライド) と見比べると slide_from_bottom の効果が
              分かりやすい。
            </Trans>
          }
          additionalNotes={
            <Trans>
              modal を両 OS で確実に「下から上」かつ全画面で出したい場合の定番。in-tab
              版と並べると、 タブバーを覆うかどうかの配置差も同時に確認できる。
            </Trans>
          }
        />
      </SafeAreaView>
    </>
  );
}
