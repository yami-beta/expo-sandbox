import type { ReactElement } from "react";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Trans, useLingui } from "@lingui/react/macro";
import { PresentationSampleScreen } from "../../../features/navigation-patterns/presentation-sample/PresentationSampleScreen";

export default function FullScreenModalSlideFromBottomBackHiddenOnRootSample(): ReactElement {
  const { t } = useLingui();

  return (
    <>
      <Stack.Screen.Title>{t`fullScreenModal + slide_from_bottom + back hidden`}</Stack.Screen.Title>
      <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
        <PresentationSampleScreen
          presentationValue="fullScreenModal + slide_from_bottom + back hidden"
          heading={<Trans>全画面モーダルでヘッダー左の戻るボタンを非表示にする</Trans>}
          iosBehavior={
            <Trans>
              `headerBackVisible: false` でヘッダー左の要素が出ない。`gestureEnabled: false` と
              組み合わせると swipe down も無効化されるため、画面内の閉じるボタンが唯一の dismiss
              経路になる。
            </Trans>
          }
          androidBehavior={
            <Trans>
              Toolbar の navigationIcon が消える。dismiss は OS の戻る操作 / 画面内の閉じるボタンが
              必要。タブバーごと全画面を覆う見た目は変わらない。
            </Trans>
          }
          dismissNote={
            <Trans>
              iOS は画面内の「閉じる」ボタンが必須 (swipe down 不可・ヘッダーからの dismiss
              経路なし)。 Android は戻る操作でも閉じる。
            </Trans>
          }
          additionalNotes={
            <Trans>
              「ヘッダーをタイトルだけにする」スタイル。`gestureEnabled: false` と
              headerBackVisible: false を併用する場合は、本文の閉じるボタンが唯一の dismiss
              経路になるため必ず到達 可能な位置に配置する。
            </Trans>
          }
        />
      </SafeAreaView>
    </>
  );
}
