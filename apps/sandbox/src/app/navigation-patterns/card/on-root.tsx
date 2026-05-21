import type { ReactElement } from "react";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Trans, useLingui } from "@lingui/react/macro";
import { PresentationSampleScreen } from "../../../components/presentation-sample/PresentationSampleScreen";

export default function CardSample(): ReactElement {
  const { t } = useLingui();

  return (
    <>
      <Stack.Screen.Title>{t`card`}</Stack.Screen.Title>
      <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
        <PresentationSampleScreen
          presentationValue="card"
          heading={<Trans>ルート Stack に push される card 遷移</Trans>}
          iosBehavior={
            <Trans>
              右からスライドして push されるネイティブ遷移。ルート Stack 配下に push
              するため、遷移先ではタブバーが消える (タブ表示は (tabs)
              グループの中だけに存在し、ルート Stack の sibling screen
              にはタブが描画されないため)。左端からの swipe back ジェスチャーで戻れる。
            </Trans>
          }
          androidBehavior={
            <Trans>
              OS / テーマに応じたスライドアニメーションで push される。ルート Stack
              配下なので遷移先ではタブバーが消える。システムの戻るボタン / ジェスチャーで戻れる。
            </Trans>
          }
          dismissNote={
            <Trans>
              ヘッダー左の戻るボタン、または OS
              のジェスチャーで前画面に戻る。ルート版ではタブバーが消えるのが in-tab 版との差分。
            </Trans>
          }
        />
      </SafeAreaView>
    </>
  );
}
