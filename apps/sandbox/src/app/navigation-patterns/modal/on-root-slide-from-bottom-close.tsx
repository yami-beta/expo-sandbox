import type { ReactElement } from "react";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Trans, useLingui } from "@lingui/react/macro";
import { PresentationSampleScreen } from "../../../features/navigation-patterns/presentation-sample/PresentationSampleScreen";

export default function ModalSlideFromBottomCloseOnRootSample(): ReactElement {
  const { t } = useLingui();

  return (
    <>
      <Stack.Screen.Title>{t`modal + slide_from_bottom + close icon`}</Stack.Screen.Title>
      <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
        <PresentationSampleScreen
          presentationValue="modal + slide_from_bottom + close icon"
          heading={<Trans>ヘッダー左の戻るアイコンを × (閉じる) に差し替える</Trans>}
          iosBehavior={
            <Trans>
              `headerBackIcon` (type: image, source: PNG) でネイティブの back button のグリフ画像を
              差し替える。modal なのでもともと iOS の navigation header の戻るは出ないことが多く、
              差し替えても表示への影響は限定的。
            </Trans>
          }
          androidBehavior={
            <Trans>
              Toolbar の navigationIcon の drawable が差し替わる。位置・タッチ範囲・ripple・色 tint
              は すべてネイティブ Toolbar の navigation slot 標準のまま、グリフだけが ← から ×
              になる。 Material 3 の full-screen dialog ガイドラインに沿った見た目。
            </Trans>
          }
          dismissNote={
            <Trans>
              ヘッダー左の × タップで dismiss (内部的には back navigation)。画面下部の「閉じる」
              ボタン、iOS の swipe down、Android の戻る操作でも閉じられる。
            </Trans>
          }
          additionalNotes={
            <Trans>
              ネイティブの navigation icon slot を使うため、`headerLeft` で React Component を返す
              方式と違い位置・スタイルがネイティブと完全一致する。代償として PNG (24/48/72dp) を
              プロジェクトに同梱する必要がある。
            </Trans>
          }
        />
      </SafeAreaView>
    </>
  );
}
