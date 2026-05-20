import type { ReactElement } from "react";
import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import { PresentationSampleScreen } from "../../../../../components/presentation-sample/PresentationSampleScreen";

export default function CardSample(): ReactElement {
  const { t } = useLingui();

  return (
    <>
      <Stack.Screen.Title>{t`card`}</Stack.Screen.Title>
      <PresentationSampleScreen
        isInTab
        presentationValue="card"
        heading={<Trans>タブ内 Stack に push される card 遷移</Trans>}
        iosBehavior={
          <Trans>
            右からスライドして push されるネイティブ遷移。タブ内 Stack 配下なので push
            先でもタブバーが残ったまま維持される。左端からの swipe back ジェスチャーで戻れる。
          </Trans>
        }
        androidBehavior={
          <Trans>
            OS / テーマに応じたスライドアニメーションで push される。タブ内 Stack
            配下なのでタブバーは表示されたまま。システムの戻るボタン / ジェスチャーで戻れる。
          </Trans>
        }
        dismissNote={
          <Trans>
            ヘッダー左の戻るボタン、または OS
            のジェスチャーで前画面に戻る。タブバーが残ったまま維持されるのが on-root 版との差分。
          </Trans>
        }
      />
    </>
  );
}
