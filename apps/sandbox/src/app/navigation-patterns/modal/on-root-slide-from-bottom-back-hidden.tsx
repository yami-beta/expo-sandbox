import type { ReactElement } from "react";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Trans, useLingui } from "@lingui/react/macro";
import { PresentationSampleScreen } from "../../../components/presentation-sample/PresentationSampleScreen";

export default function ModalSlideFromBottomBackHiddenOnRootSample(): ReactElement {
  const { t } = useLingui();

  return (
    <>
      <Stack.Screen.Title>{t`modal + slide_from_bottom + back hidden`}</Stack.Screen.Title>
      <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
        <PresentationSampleScreen
          presentationValue="modal + slide_from_bottom + back hidden"
          heading={<Trans>ヘッダー左の戻る/閉じるボタンを非表示にする</Trans>}
          iosBehavior={
            <Trans>
              `headerBackVisible: false` を指定するとヘッダー左の戻る/閉じる要素が出ない。modal の
              dismiss は swipe down または画面内の閉じるボタンに頼る形になる。
            </Trans>
          }
          androidBehavior={
            <Trans>
              `headerBackVisible: false` で Toolbar の navigationIcon が消える。dismiss は OS の戻る
              操作 / システムジェスチャー / 画面内の閉じるボタンが必要。slide_from_bottom
              により下から スライドして全画面を覆う見た目は同じだが、ヘッダー左が完全に空になる。
            </Trans>
          }
          dismissNote={
            <Trans>
              画面下部の「閉じる」ボタン、iOS の swipe down、Android
              のシステム戻るで閉じる。ヘッダー からは閉じる動線が無くなるため、本文側の閉じる UI
              が必須になる。
            </Trans>
          }
          additionalNotes={
            <Trans>
              「ヘッダーをタイトルだけにし、閉じる動線は本文に集約する」スタイル。iOS の swipe down
              が 使える前提なら自然に成立する一方、`gestureEnabled: false`
              を併用する場合は本文の閉じる ボタンが唯一の dismiss
              経路になるため、必ず到達可能な位置に配置すること。
            </Trans>
          }
        />
      </SafeAreaView>
    </>
  );
}
