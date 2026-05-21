import type { ReactElement } from "react";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Trans, useLingui } from "@lingui/react/macro";
import { PresentationSampleScreen } from "../../../components/presentation-sample/PresentationSampleScreen";

export default function ModalSample(): ReactElement {
  const { t } = useLingui();

  return (
    <>
      <Stack.Screen.Title>{t`modal`}</Stack.Screen.Title>
      <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
        <PresentationSampleScreen
          presentationValue="modal"
          heading={<Trans>ルート Stack 上のモーダル表示</Trans>}
          iosBehavior={
            <Trans>
              下から上にスライドして表示される標準の page sheet 風 modal。ルート Stack
              配下なので、タブバーごと画面全体を覆う形で重なる (in-tab 版でも iOS では modal
              がタブバーを覆うため見た目はほぼ同じ)。上端からの swipe down で閉じられる。
            </Trans>
          }
          androidBehavior={
            <Trans>
              presentation 形式は modal になるが、画面遷移アニメーションは独立した `animation`
              プロパティで決まる。`animation` 未指定だと `card` と同じ OS 標準の遷移
              (多くは右からスライド) になり、iOS のような「下から上」にはならない。下から上
              にしたい場合は `animation: slide_from_bottom` を明示する。ルート Stack に出るので
              遷移先ではタブバーが消える。戻るボタン / システムジェスチャーで閉じられる。
            </Trans>
          }
          dismissNote={
            <Trans>
              「閉じる」ボタン、iOS の swipe down、Android の戻る操作で閉じる。ルート版は、Android
              で animation 未指定だとタブバーが消えた push 同様の遷移になり、in-tab 版の「Android
              push と区別がつかない」と挙動が近づく。
            </Trans>
          }
        />
      </SafeAreaView>
    </>
  );
}
