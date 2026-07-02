import type { ReactElement } from "react";
import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import { PresentationSampleScreen } from "../../../../../features/navigation-patterns/presentation-sample/PresentationSampleScreen";

export default function FullScreenModalSlideFromBottomCloseSample(): ReactElement {
  const { t } = useLingui();

  return (
    <>
      <Stack.Screen.Title>{t`fullScreenModal + slide_from_bottom + close icon`}</Stack.Screen.Title>
      <PresentationSampleScreen
        presentationValue="fullScreenModal + slide_from_bottom + close icon"
        heading={<Trans>全画面モーダルのヘッダー戻るを × に差し替える (in-tab)</Trans>}
        iosBehavior={
          <Trans>
            `headerBackIcon` でネイティブ back button のグリフ画像を差し替える。fullScreenModal は
            UIModalPresentationFullScreen で全画面を覆う。
          </Trans>
        }
        androidBehavior={
          <Trans>
            Toolbar の navigationIcon の drawable が差し替わる。位置・タッチ範囲・ripple・色 tint は
            ネイティブ標準のまま、グリフだけ ← → ×。Material 3 full-screen dialog の規範に沿う。
          </Trans>
        }
        dismissNote={
          <Trans>
            ヘッダー左の × タップで dismiss。`gestureEnabled: false` のため swipe では閉じられない。
            Android は戻る操作でも閉じる。
          </Trans>
        }
        additionalNotes={
          <Trans>
            ネイティブ navigation icon slot を使うので、`headerLeft` の React Component 方式と違い
            ズレが出ない。
          </Trans>
        }
      />
    </>
  );
}
