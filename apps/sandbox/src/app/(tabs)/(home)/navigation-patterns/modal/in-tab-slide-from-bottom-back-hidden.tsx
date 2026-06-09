import type { ReactElement } from "react";
import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import { PresentationSampleScreen } from "../../../../../components/presentation-sample/PresentationSampleScreen";

export default function ModalSlideFromBottomBackHiddenSample(): ReactElement {
  const { t } = useLingui();

  return (
    <>
      <Stack.Screen.Title>{t`modal + slide_from_bottom + back hidden`}</Stack.Screen.Title>
      <PresentationSampleScreen
        presentationValue="modal + slide_from_bottom + back hidden"
        heading={<Trans>ヘッダー左の戻る/閉じるボタンを非表示にする (in-tab)</Trans>}
        iosBehavior={
          <Trans>
            `headerBackVisible: false` でヘッダー左の戻る/閉じる要素が出ない。dismiss は swipe down
            または画面内の閉じるボタンに頼る形。
          </Trans>
        }
        androidBehavior={
          <Trans>
            Toolbar の navigationIcon が消える。dismiss は OS の戻る操作 / 画面内の閉じるボタンが
            必要。slide_from_bottom により「下からスライド」の見た目は維持される。
          </Trans>
        }
        dismissNote={
          <Trans>
            画面下部の「閉じる」ボタン、iOS の swipe down、Android のシステム戻るで閉じる。ヘッダー
            からは閉じる動線が無くなる。
          </Trans>
        }
        additionalNotes={
          <Trans>ヘッダーをタイトルだけにして、閉じる動線は本文側に集約するパターン。</Trans>
        }
      />
    </>
  );
}
