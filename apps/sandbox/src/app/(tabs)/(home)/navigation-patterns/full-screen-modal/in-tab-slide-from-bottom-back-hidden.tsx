import type { ReactElement } from "react";
import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import { PresentationSampleScreen } from "../../../../../features/navigation-patterns/presentation-sample/PresentationSampleScreen";

export default function FullScreenModalSlideFromBottomBackHiddenSample(): ReactElement {
  const { t } = useLingui();

  return (
    <>
      <Stack.Screen.Title>{t`fullScreenModal + slide_from_bottom + back hidden`}</Stack.Screen.Title>
      <PresentationSampleScreen
        presentationValue="fullScreenModal + slide_from_bottom + back hidden"
        heading={<Trans>全画面モーダルでヘッダー左の戻るを非表示にする (in-tab)</Trans>}
        iosBehavior={
          <Trans>
            `headerBackVisible: false` でヘッダー左の要素が出ない。`gestureEnabled: false` と
            組み合わせると、画面内の閉じるボタンが唯一の dismiss 経路。
          </Trans>
        }
        androidBehavior={
          <Trans>
            Toolbar の navigationIcon が消える。dismiss は OS の戻る操作 / 画面内の閉じるボタンが
            必要。
          </Trans>
        }
        dismissNote={
          <Trans>iOS は画面内の「閉じる」ボタンが必須。Android は戻る操作でも閉じる。</Trans>
        }
        additionalNotes={
          <Trans>ヘッダーをタイトルだけにして、閉じる動線を本文に集約するパターン。</Trans>
        }
      />
    </>
  );
}
