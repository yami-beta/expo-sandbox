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
        heading={<Trans>タブ内 Stack 上のモーダル表示</Trans>}
        iosBehavior={
          <Trans>
            下から上にスライドして表示される page sheet 風 modal。タブ内 Stack 配下に置いても iOS の
            modal は UIKit 上の最前面に出るため、結局タブバーを覆って表示される
            (ルート版とほぼ同じ見た目になる)。上端からの swipe down で閉じられる。
          </Trans>
        }
        androidBehavior={
          <Trans>
            presentation 形式は modal だが、Android では animation 未指定だと OS 標準の遷移
            (多くは右からスライド) になる。タブ内 Stack
            に置いた場合、タブバーが残った状態でスライドインするため、 標準の card push
            と見た目の区別がほぼつかなくなる。「下から上」にしたい場合は `animation:
            slide_from_bottom` を明示する。戻るボタン / システムジェスチャーで閉じられる。
          </Trans>
        }
        dismissNote={
          <Trans>
            「閉じる」ボタン、iOS の swipe down、Android の戻る操作で閉じる。Android
            ではタブバー越しに見ても card push と区別がつかなくなりやすい点が on-root 版との差分。
          </Trans>
        }
      />
    </>
  );
}
