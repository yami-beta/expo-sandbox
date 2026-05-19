import type { ReactElement } from "react";
import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import { PresentationSampleScreen } from "../../../components/presentation-sample/PresentationSampleScreen";

export default function FormSheetSample(): ReactElement {
  const { t } = useLingui();

  return (
    <>
      <Stack.Screen.Title>{t`formSheet`}</Stack.Screen.Title>
      <PresentationSampleScreen
        presentationValue="formSheet"
        heading={<Trans>シート表示（detent 対応）</Trans>}
        iosBehavior={
          <Trans>
            UIModalPresentationFormSheet で表示される。detent (snap point)
            を任意の数だけ指定可。sheetGrabberVisible で上端のつまみを表示できる。
          </Trans>
        }
        androidBehavior={
          <Trans>
            BottomSheetBehavior で表示される。detent は最大 3 つまで。sheetGrabberVisible
            は無視され、代わりに sheetElevation 等の Android 専用オプションがある。
          </Trans>
        }
        dismissNote={
          <Trans>
            下方向の swipe、grabber のドラッグ、または「閉じる」ボタンで閉じる。Android
            では戻る操作でも閉じる。
          </Trans>
        }
      />
    </>
  );
}
