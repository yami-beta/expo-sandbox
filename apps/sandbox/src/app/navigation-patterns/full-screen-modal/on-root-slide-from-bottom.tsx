import type { ReactElement } from "react";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Trans, useLingui } from "@lingui/react/macro";
import { PresentationSampleScreen } from "../../../components/presentation-sample/PresentationSampleScreen";

export default function FullScreenModalSlideFromBottomOnRootSample(): ReactElement {
  const { t } = useLingui();

  return (
    <>
      <Stack.Screen.Title>{t`fullScreenModal + slide_from_bottom`}</Stack.Screen.Title>
      <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
        <PresentationSampleScreen
          presentationValue="fullScreenModal + slide_from_bottom"
          heading={<Trans>ルート Stack で全画面モーダルを両 OS で下からスライドさせる</Trans>}
          iosBehavior={
            <Trans>
              UIModalPresentationFullScreen で画面全体を覆う。`animation: slide_from_bottom` を
              指定すると下から上にスライドして全画面を覆う。ルート Stack 配下の標準挙動。
              `gestureEnabled: false` のため swipe では閉じられず、明示的な閉じる操作が必須。
            </Trans>
          }
          androidBehavior={
            <Trans>
              ネイティブの対応 presentation がないため modal にフォールバックするが、`animation:
              slide_from_bottom` を指定すると画面全体を覆ったまま下から上にスライドする。ルート
              Stack 配下なのでタブバーごと覆う。animation 未指定だと OS 標準の遷移になる点との差分が
              分かりやすい。
            </Trans>
          }
          dismissNote={
            <Trans>
              iOS では「閉じる」ボタンが必須 (swipe down 不可)。Android では戻る操作でも閉じる。
              `gestureEnabled: false` を踏襲しているため、ジェスチャーでは閉じられない。
            </Trans>
          }
          additionalNotes={
            <Trans>
              全画面モーダルを両 OS で「下から上」に統一したい場合に使う。in-tab
              版と並べると、Android で tab 内 push 風に出るかどうかの配置差も同時に確認できる。
            </Trans>
          }
        />
      </SafeAreaView>
    </>
  );
}
