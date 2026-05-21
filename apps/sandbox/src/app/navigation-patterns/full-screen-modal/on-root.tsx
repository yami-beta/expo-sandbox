import type { ReactElement } from "react";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Trans, useLingui } from "@lingui/react/macro";
import { PresentationSampleScreen } from "../../../components/presentation-sample/PresentationSampleScreen";

export default function FullScreenModalSample(): ReactElement {
  const { t } = useLingui();

  return (
    <>
      <Stack.Screen.Title>{t`fullScreenModal`}</Stack.Screen.Title>
      <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
        <PresentationSampleScreen
          presentationValue="fullScreenModal"
          heading={<Trans>ルート Stack 上の全画面モーダル (標準挙動)</Trans>}
          iosBehavior={
            <Trans>
              UIModalPresentationFullScreen で画面全体を覆う。`containedModal` が presentation
              context の bounds 内に収まるのに対し、`fullScreenModal` は presentation context
              に関係なく画面全体を覆う。ルート Stack 配下に置いた場合の標準挙動。 React Navigation
              公式に「ジェスチャーで dismiss できない」と明記されているため (`A screen using this
              presentation style cannot be dismissed by gesture.`)、swipe
              で閉じない挙動はライブラリの保証として依拠できる。明示的な閉じる操作が必須。
            </Trans>
          }
          androidBehavior={
            <Trans>
              ネイティブの対応 presentation がないため modal にフォールバックする。ルート Stack
              配下なのでタブバーごと覆う形になる。アニメーションも modal 同様 `animation` 未指定なら
              OS 標準の遷移になる。戻るボタン / システムジェスチャーで閉じられる点が iOS
              との大きな差分。
            </Trans>
          }
          dismissNote={
            <Trans>
              iOS では「閉じる」ボタンが必須 (swipe down 不可)。Android では戻る操作でも閉じる。
              ルート版は配置 Stack が presentation context に影響しないため、in-tab 版とも iOS
              では同じ挙動。Android では in-tab 版が tab 内 push 風に出る点が差分。
            </Trans>
          }
        />
      </SafeAreaView>
    </>
  );
}
