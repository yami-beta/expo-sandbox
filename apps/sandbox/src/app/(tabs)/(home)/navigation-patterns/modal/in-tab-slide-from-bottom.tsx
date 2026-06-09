import type { ReactElement } from "react";
import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import { PresentationSampleScreen } from "../../../../../components/presentation-sample/PresentationSampleScreen";

export default function ModalSlideFromBottomSample(): ReactElement {
  const { t } = useLingui();

  return (
    <>
      <Stack.Screen.Title>{t`modal + slide_from_bottom`}</Stack.Screen.Title>
      <PresentationSampleScreen
        presentationValue="modal + slide_from_bottom"
        heading={<Trans>modal を両 OS で下からスライドさせる</Trans>}
        iosBehavior={
          <Trans>
            modal は iOS では元から下から上にスライドして表示されるため、`animation:
            slide_from_bottom` を足しても見た目の差は小さい。上端からの swipe down で閉じられる。
          </Trans>
        }
        androidBehavior={
          <Trans>
            animation 未指定だと OS 標準の遷移 (多くは右からスライド) になり card push と区別が
            つきにくいが、`animation: slide_from_bottom` を指定すると iOS と同じく「下から上」に
            スライドして表示される。戻るボタン / システムジェスチャーで閉じられる。
          </Trans>
        }
        dismissNote={
          <Trans>
            「閉じる」ボタン、iOS の swipe down、Android の戻る操作で閉じる。animation 未指定の
            in-tab 版 (Android は右スライド) との差分を見比べると分かりやすい。
          </Trans>
        }
        additionalNotes={
          <Trans>
            modal を両 OS で確実に「下から上」に出したい場合の定番。presentation だけでは Android で
            意図通りにならないため、animation を明示する。
          </Trans>
        }
      />
    </>
  );
}
