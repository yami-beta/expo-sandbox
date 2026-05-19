import type { ReactElement } from "react";
import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import { PresentationSampleScreen } from "../../../../../components/presentation-sample/PresentationSampleScreen";

export default function TransparentModalSample(): ReactElement {
  const { t } = useLingui();

  return (
    <>
      <Stack.Screen.Title>{t`transparentModal`}</Stack.Screen.Title>
      <PresentationSampleScreen
        variant="transparent-overlay"
        presentationValue="transparentModal"
        heading={<Trans>背景透過モーダル</Trans>}
        iosBehavior={
          <Trans>
            背景を透明にしたまま modal
            が重なる。前画面が透けて見えるので、自前のバックドロップを描画する。
          </Trans>
        }
        androidBehavior={
          <Trans>同等の透過モーダルとして重なる。戻るボタンで閉じる挙動は modal と同じ。</Trans>
        }
        dismissNote={
          <Trans>
            背景の半透明エリアをタップ、または「閉じる」ボタンで閉じる。バックドロップタップ判定は画面側で実装する必要がある。
          </Trans>
        }
      />
    </>
  );
}
