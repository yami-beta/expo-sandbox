import type { ReactElement } from "react";
import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import { PresentationSampleScreen } from "../../../../../components/presentation-sample/PresentationSampleScreen";

export default function ContainedModalSample(): ReactElement {
  const { t } = useLingui();

  return (
    <>
      <Stack.Screen.Title>{t`containedModal`}</Stack.Screen.Title>
      <PresentationSampleScreen
        presentationValue="containedModal"
        heading={<Trans>タブ内 Stack 上の containedModal (本来挙動)</Trans>}
        iosBehavior={
          <Trans>
            UIModalPresentationCurrentContext で表示される。`definesPresentationContext: true`
            を持つ最も近い祖先 view controller (タブ内 Stack の Navigator) の bounds 内に
            重なる。本サンプルはホームタブの内側 Stack 配下に配置しているため、開いてもタブバーが
            残ったままになるのが観察できる ── これが containedModal の本来期待される挙動。 swipe
            down では閉じない (UIKit の `UIModalPresentationCurrentContext` 自体が sheet
            ジェスチャーを持たないため)。ただしこれは React Navigation
            公式が明示的に保証している挙動ではない点に注意。
          </Trans>
        }
        androidBehavior={
          <Trans>
            ネイティブの対応 presentation がないため modal にフォールバックする。Android は current
            context の概念に依存しないため、配置 Stack による挙動差はなく、 on-root
            版と同じ挙動になる。`animation` 未指定なら OS 標準の遷移 (多くは右からスライド) になる。
          </Trans>
        }
        dismissNote={
          <Trans>
            iOS では「閉じる」ボタンが必須 (swipe down は効かない)。Android では戻る操作でも閉じる。
            iOS で **タブバーが残ったまま重なる**のが on-root 版との最大の差分。
          </Trans>
        }
      />
    </>
  );
}
