import type { ReactElement } from "react";
import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import { PresentationSampleScreen } from "../../../../../components/presentation-sample/PresentationSampleScreen";

export default function ModalSample(): ReactElement {
  const { t } = useLingui();

  return (
    <>
      <Stack.Screen.Title>{t`modal`}</Stack.Screen.Title>
      <PresentationSampleScreen
        presentationValue="modal"
        heading={<Trans>標準のモーダル表示</Trans>}
        iosBehavior={
          <Trans>
            下から上にスライドして表示される。上端からの swipe down で閉じられる（page sheet 風）。
          </Trans>
        }
        androidBehavior={
          <Trans>
            presentation 形式は modal になるが、画面遷移アニメーションは独立した `animation`
            プロパティで決まる。`animation` 未指定だと `card` と同じ OS 標準の遷移
            (多くは右からスライド) になり、iOS
            のような「下から上」にはならない。下から上にしたい場合は `animation: slide_from_bottom`
            を明示する。戻るボタン / システムジェスチャーで閉じられる。
          </Trans>
        }
        dismissNote={
          <Trans>「閉じる」ボタン、iOS の swipe down、Android の戻る操作で閉じる。</Trans>
        }
      />
    </>
  );
}
