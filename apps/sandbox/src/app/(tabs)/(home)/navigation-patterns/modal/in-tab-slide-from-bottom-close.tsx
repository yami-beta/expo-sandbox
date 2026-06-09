import type { ReactElement } from "react";
import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import { PresentationSampleScreen } from "../../../../../components/presentation-sample/PresentationSampleScreen";

export default function ModalSlideFromBottomCloseSample(): ReactElement {
  const { t } = useLingui();

  return (
    <>
      <Stack.Screen.Title>{t`modal + slide_from_bottom + close icon`}</Stack.Screen.Title>
      <PresentationSampleScreen
        presentationValue="modal + slide_from_bottom + close icon"
        heading={<Trans>ヘッダー左の戻るアイコンを × (閉じる) に差し替える (in-tab)</Trans>}
        iosBehavior={
          <Trans>
            `headerBackIcon` (type: image, source: PNG) でネイティブの back button のグリフ画像を
            差し替える。modal なので navigation header の戻る自体出ないことが多く、影響は限定的。
          </Trans>
        }
        androidBehavior={
          <Trans>
            Toolbar の navigationIcon の drawable が差し替わる。位置・タッチ範囲・ripple・色 tint は
            ネイティブ Toolbar の navigation slot 標準のまま、グリフだけ ← → ×。Material 3 の
            full-screen dialog ガイドラインに沿った見た目。
          </Trans>
        }
        dismissNote={
          <Trans>
            ヘッダー左の × タップで dismiss。画面下部の「閉じる」ボタン、iOS の swipe down、Android
            の戻る操作でも閉じる。
          </Trans>
        }
        additionalNotes={
          <Trans>
            `headerLeft` で React Component を返す方式と違い、ネイティブ標準の navigation icon slot
            を 使うので位置・余白が完全に揃う。代償として PNG (24/48/72dp) を同梱する必要がある。
          </Trans>
        }
      />
    </>
  );
}
