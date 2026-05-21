import type { ReactElement } from "react";
import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import { PresentationSampleOverlay } from "../../../components/presentation-sample/PresentationSampleOverlay";

export default function TransparentModalSample(): ReactElement {
  const { t } = useLingui();

  return (
    <>
      <Stack.Screen.Title>{t`transparentModal`}</Stack.Screen.Title>
      <PresentationSampleOverlay
        presentationValue="transparentModal"
        heading={<Trans>ルート Stack 上の背景透過モーダル</Trans>}
        iosBehavior={
          <Trans>
            背景を透明にしたまま modal が重なる。ルート Stack 配下に出るため、画面全体
            (タブバーごと) を覆う透過オーバーレイになる。前画面が透けて見えるので、自前の
            バックドロップを描画する。
          </Trans>
        }
        androidBehavior={
          <Trans>
            同等の透過モーダルとして重なる。ルート Stack 配下なのでタブバーごと前景に出る。
            戻るボタンで閉じる挙動は modal と同じ。
          </Trans>
        }
        dismissNote={
          <Trans>
            背景の半透明エリアをタップ、または「閉じる」ボタンで閉じる。バックドロップタップ
            判定は画面側で実装する必要がある。タブバーごと透過させるのが in-tab 版との差分。
          </Trans>
        }
      />
    </>
  );
}
