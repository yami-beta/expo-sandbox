import type { ReactElement } from "react";
import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import { PresentationSampleOverlay } from "../../../../../components/presentation-sample/PresentationSampleOverlay";

export default function TransparentModalSample(): ReactElement {
  const { t } = useLingui();

  return (
    <>
      <Stack.Screen.Title>{t`transparentModal`}</Stack.Screen.Title>
      <PresentationSampleOverlay
        presentationValue="transparentModal"
        heading={<Trans>タブ内 Stack 上の背景透過モーダル</Trans>}
        iosBehavior={
          <Trans>
            背景を透明にしたまま modal が重なる。タブ内 Stack 配下に置くと、 透過オーバーレイは tab
            content の領域に描かれ、タブバーは前面に残ったままになる (タブ内 Stack の Navigator が
            UIKit 上で current context として振る舞うため)。
            前画面が透けて見えるので、自前のバックドロップを描画する。
          </Trans>
        }
        androidBehavior={
          <Trans>
            同等の透過モーダルとして重なる。タブ内 Stack 配下なのでタブバーは残った状態で tab
            content の上に透過オーバーレイが乗る。戻るボタンで閉じる挙動は modal と同じ。
          </Trans>
        }
        dismissNote={
          <Trans>
            背景の半透明エリアをタップ、または「閉じる」ボタンで閉じる。タブバーが
            残ったまま透過オーバーレイが乗るのが on-root 版との差分。
          </Trans>
        }
      />
    </>
  );
}
