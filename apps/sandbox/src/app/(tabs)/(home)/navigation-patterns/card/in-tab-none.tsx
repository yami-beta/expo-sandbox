import type { ReactElement } from "react";
import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import { PresentationSampleScreen } from "../../../../../features/navigation-patterns/presentation-sample/PresentationSampleScreen";

export default function CardNoneSample(): ReactElement {
  const { t } = useLingui();

  return (
    <>
      <Stack.Screen.Title>{t`card + none`}</Stack.Screen.Title>
      <PresentationSampleScreen
        presentationValue="card + none"
        heading={<Trans>card 遷移のアニメーションを無くす (none)</Trans>}
        iosBehavior={
          <Trans>
            card は既定だと右からスライドして push されるが、`animation: none` を指定すると
            アニメーションなしで即座に切り替わる。in-tab なので遷移先でもタブバーは残る。左端からの
            swipe back ジェスチャーは有効。
          </Trans>
        }
        androidBehavior={
          <Trans>
            既定の OS 標準遷移 (多くは右からスライド)
            ではなく、アニメーションなしで即座に切り替わる。 in-tab
            なのでタブバーは表示されたまま。システムの戻るボタン / ジェスチャーで戻れる。
          </Trans>
        }
        dismissNote={
          <Trans>
            ヘッダー左の戻るボタン、または OS のジェスチャーで前画面に戻る。戻り (pop) も同じく
            アニメーションなしで即座に切り替わる。animation 未指定の in-tab 版 (右からスライド) との
            差分を見比べると分かりやすい。
          </Trans>
        }
        additionalNotes={
          <Trans>
            プログラムによる画面差し替えや、独自トランジションを別途実装する場合など、ネイティブの
            遷移アニメーションを抑制したいケースに向く。
          </Trans>
        }
      />
    </>
  );
}
