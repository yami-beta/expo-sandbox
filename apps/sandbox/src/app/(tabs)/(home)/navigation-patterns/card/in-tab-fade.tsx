import type { ReactElement } from "react";
import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import { PresentationSampleScreen } from "../../../../../components/presentation-sample/PresentationSampleScreen";

export default function CardFadeSample(): ReactElement {
  const { t } = useLingui();

  return (
    <>
      <Stack.Screen.Title>{t`card + fade`}</Stack.Screen.Title>
      <PresentationSampleScreen
        presentationValue="card + fade"
        heading={<Trans>card 遷移を fade (クロスフェード) にする</Trans>}
        iosBehavior={
          <Trans>
            card は既定だと右からスライドして push されるが、`animation: fade` を指定すると push /
            pop がクロスフェードに変わる。in-tab なので遷移先でもタブバーは残る。左端からの swipe
            back ジェスチャーは有効。
          </Trans>
        }
        androidBehavior={
          <Trans>
            既定の OS 標準遷移 (多くは右からスライド) ではなく、クロスフェードで切り替わる。in-tab
            なのでタブバーは表示されたまま。システムの戻るボタン / ジェスチャーで戻れる。
          </Trans>
        }
        dismissNote={
          <Trans>
            ヘッダー左の戻るボタン、または OS のジェスチャーで前画面に戻る。戻り (pop) も同じく
            クロスフェードになる。animation 未指定の in-tab 版 (右からスライド) との差分を見比べると
            分かりやすい。
          </Trans>
        }
        additionalNotes={
          <Trans>
            スプラッシュ →
            本体や、内容だけ差し替えたい画面など、位置の移動を伴わない切り替えに向く。
          </Trans>
        }
      />
    </>
  );
}
