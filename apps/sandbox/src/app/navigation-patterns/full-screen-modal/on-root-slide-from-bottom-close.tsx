import type { ReactElement } from "react";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Trans, useLingui } from "@lingui/react/macro";
import { PresentationSampleScreen } from "../../../components/presentation-sample/PresentationSampleScreen";

export default function FullScreenModalSlideFromBottomCloseOnRootSample(): ReactElement {
  const { t } = useLingui();

  return (
    <>
      <Stack.Screen.Title>{t`fullScreenModal + slide_from_bottom + close icon`}</Stack.Screen.Title>
      <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
        <PresentationSampleScreen
          presentationValue="fullScreenModal + slide_from_bottom + close icon"
          heading={<Trans>全画面モーダルのヘッダー戻るアイコンを × に差し替える</Trans>}
          iosBehavior={
            <Trans>
              `headerBackIcon` でネイティブの back button のグリフ画像を差し替える。 fullScreenModal
              は UIKit の UIModalPresentationFullScreen で全画面を覆う。
            </Trans>
          }
          androidBehavior={
            <Trans>
              Toolbar の navigationIcon が差し替わる。位置・タッチ範囲・ripple・色 tint は
              ネイティブ Toolbar の navigation slot 標準のまま、グリフだけ ← → ×。タブバーごと
              全画面を覆う見た目で、Material 3 full-screen dialog の規範に沿う。
            </Trans>
          }
          dismissNote={
            <Trans>
              ヘッダー左の × タップで dismiss。`gestureEnabled: false` のため swipe で閉じることは
              できない。Android は戻る操作でも閉じる。
            </Trans>
          }
          additionalNotes={
            <Trans>
              ネイティブ navigation icon slot をそのまま使うので、`headerLeft` の React Component
              方式と違いズレが出ない。代償として PNG アセット (24/48/72dp) の同梱が必要。
            </Trans>
          }
        />
      </SafeAreaView>
    </>
  );
}
