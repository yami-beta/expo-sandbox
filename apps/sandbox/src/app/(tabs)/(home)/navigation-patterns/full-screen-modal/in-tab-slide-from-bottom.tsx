import type { ReactElement } from "react";
import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import { PresentationSampleScreen } from "../../../../../components/presentation-sample/PresentationSampleScreen";

export default function FullScreenModalSlideFromBottomSample(): ReactElement {
  const { t } = useLingui();

  return (
    <>
      <Stack.Screen.Title>{t`fullScreenModal + slide_from_bottom`}</Stack.Screen.Title>
      <PresentationSampleScreen
        presentationValue="fullScreenModal + slide_from_bottom"
        heading={<Trans>全画面モーダルを両 OS で下からスライドさせる</Trans>}
        iosBehavior={
          <Trans>
            UIModalPresentationFullScreen で画面全体を覆う。`animation: slide_from_bottom` を
            指定すると下から上にスライドして全画面を覆う。`gestureEnabled: false` のため swipe では
            閉じられず、明示的な閉じる操作が必須。
          </Trans>
        }
        androidBehavior={
          <Trans>
            ネイティブの対応 presentation がないため modal にフォールバックするが、`animation:
            slide_from_bottom` を指定すると下から上にスライドして表示される。animation 未指定だと OS
            標準の遷移になり tab 内 push 風に出ることがある点との差分が分かりやすい。
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
            全画面モーダルを両 OS で「下から上」に統一したい場合に使う。`gestureEnabled: false` で
            誤操作による dismiss を防ぐ。
          </Trans>
        }
      />
    </>
  );
}
