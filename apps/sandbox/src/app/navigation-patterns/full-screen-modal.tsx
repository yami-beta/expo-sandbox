import type { ReactElement } from "react";
import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import { PresentationSampleScreen } from "../../components/presentation-sample/PresentationSampleScreen";

export default function FullScreenModalSample(): ReactElement {
  const { t } = useLingui();

  return (
    <>
      <Stack.Screen.Title>{t`fullScreenModal`}</Stack.Screen.Title>
      <PresentationSampleScreen
        presentationValue="fullScreenModal"
        heading={<Trans>swipe で閉じられない全画面モーダル</Trans>}
        iosBehavior={
          <Trans>
            UIModalPresentationFullScreen で画面全体を覆う。`containedModal` が presentation context
            の bounds 内に収まるのに対し、`fullScreenModal` は presentation context
            に関係なく画面全体を覆う。React Navigation 公式に「ジェスチャーで dismiss
            できない」と明記されているため (`A screen using this presentation style cannot be
            dismissed by gesture.`)、swipe
            で閉じない挙動はライブラリの保証として依拠できる。明示的な閉じる操作が必須。
          </Trans>
        }
        androidBehavior={
          <Trans>
            ネイティブの対応 presentation がないため modal にフォールバックする。アニメーションも
            modal 同様 `animation` 未指定なら OS 標準の遷移になる。戻るボタン /
            システムジェスチャーで閉じられる点が iOS との大きな差分。
          </Trans>
        }
        dismissNote={
          <Trans>
            iOS では「閉じる」ボタンが必須（swipe down 不可）。Android では戻る操作でも閉じる。
          </Trans>
        }
      />
    </>
  );
}
