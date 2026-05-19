import type { ReactElement } from "react";
import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import { PresentationSampleScreen } from "../../../components/presentation-sample/PresentationSampleScreen";

export default function ContainedModalSample(): ReactElement {
  const { t } = useLingui();

  return (
    <>
      <Stack.Screen.Title>{t`containedModal`}</Stack.Screen.Title>
      <PresentationSampleScreen
        presentationValue="containedModal"
        heading={<Trans>current context 上の modal</Trans>}
        iosBehavior={
          <Trans>
            UIModalPresentationCurrentContext で表示される。`definesPresentationContext: true`
            を持つ最も近い祖先 view controller の bounds 内に重なる。本サンプルはホームタブの内側
            Stack 配下に配置しているため、開いてもタブバーが残ったままになるのが観察できる (ルート
            Stack 配下に置くと画面全体を覆い、`fullScreenModal`との差が消える)。swipe down
            では閉じない (UIKit の `UIModalPresentationCurrentContext` 自体が sheet
            ジェスチャーを持たないため)。ただしこれは React Navigation
            公式が明示的に保証している挙動ではない点に注意。
          </Trans>
        }
        androidBehavior={
          <Trans>
            ネイティブの対応 presentation がないため modal にフォールバックする。アニメーションも
            modal と同様、`animation` 未指定なら OS
            標準の遷移（多くは右からスライド）になり「下から上」にはならない。
          </Trans>
        }
        dismissNote={
          <Trans>
            iOS では「閉じる」ボタンが必須 (swipe down は効かない)。Android では戻る操作でも閉じる。
          </Trans>
        }
      />
    </>
  );
}
