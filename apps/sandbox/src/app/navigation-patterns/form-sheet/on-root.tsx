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
        heading={<Trans>ルート Stack 上のシート表示 (推奨配置)</Trans>}
        iosBehavior={
          <Trans>
            UIModalPresentationFormSheet で表示される。detent (snap point)
            を任意の数だけ指定可。sheetGrabberVisible で上端のつまみを表示できる。 ルート Stack
            配下なのでタブバーを覆ってシートが下から出る形になる (formSheet は通常 modal
            同様タブバー上に乗るのが期待される挙動)。
          </Trans>
        }
        androidBehavior={
          <Trans>
            BottomSheetBehavior で表示される。detent は最大 3 つまで。sheetGrabberVisible
            は無視され、代わりに sheetElevation 等の Android 専用オプションがある。 ルート Stack
            配下なのでタブバーを覆ってシートが出る。
          </Trans>
        }
        dismissNote={
          <Trans>
            下方向の swipe、grabber のドラッグ、または「閉じる」ボタンで閉じる。Android
            では戻る操作でも閉じる。タブバーごと覆うのが in-tab 版との差分 (実プロダクトでは
            このルート配置が推奨)。
          </Trans>
        }
      />
    </>
  );
}
