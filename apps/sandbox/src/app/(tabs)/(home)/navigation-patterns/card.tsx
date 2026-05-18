import type { ReactElement } from "react";
import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import { PresentationSampleScreen } from "../../../../components/presentation-sample/PresentationSampleScreen";

export default function CardSample(): ReactElement {
  const { t } = useLingui();

  return (
    <>
      <Stack.Screen.Title>{t`card`}</Stack.Screen.Title>
      <PresentationSampleScreen
        presentationValue="card"
        heading={<Trans>標準の push 遷移</Trans>}
        iosBehavior={
          <Trans>
            右からスライドして push されるネイティブ遷移。左端からの swipe back
            ジェスチャーで戻れる。
          </Trans>
        }
        androidBehavior={
          <Trans>
            OS / テーマに応じたスライドアニメーションで push される。システムの戻るボタン /
            ジェスチャーで戻れる。
          </Trans>
        }
        dismissNote={
          <Trans>
            ヘッダー左の戻るボタン、または OS
            のジェスチャーで前画面に戻る。タブバーは表示されたまま維持される。
          </Trans>
        }
      />
    </>
  );
}
