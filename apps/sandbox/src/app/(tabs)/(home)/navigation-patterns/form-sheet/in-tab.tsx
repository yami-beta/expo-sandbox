import type { ReactElement } from "react";
import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import { PresentationSampleScreen } from "../../../../../components/presentation-sample/PresentationSampleScreen";

export default function FormSheetSample(): ReactElement {
  const { t } = useLingui();

  return (
    <>
      <Stack.Screen.Title>{t`formSheet`}</Stack.Screen.Title>
      <PresentationSampleScreen
        presentationValue="formSheet"
        heading={<Trans>タブ内 Stack 上のシート表示</Trans>}
        iosBehavior={
          <Trans>
            UIModalPresentationFormSheet で表示される。タブ内 Stack 配下に置いても iOS の formSheet
            は UIKit 上の最前面に出るため、タブバーを覆って表示される (on-root
            版とほぼ同じ見た目)。detent (snap point) や sheetGrabberVisible
            の挙動は配置に依存しない。
          </Trans>
        }
        androidBehavior={
          <Trans>
            BottomSheetBehavior で表示される。タブ内 Stack 配下に置くと、**タブバーが残った まま**
            tab content の領域内にボトムシートが出る形になる (Android は presentation context
            の概念がないため、Stack の階層が反映される)。detent は最大 3 つまで。
          </Trans>
        }
        dismissNote={
          <Trans>
            下方向の swipe、grabber のドラッグ、または「閉じる」ボタンで閉じる。Android
            では戻る操作でも閉じる。**Android でタブバーが残ったままシートが出る**のが on-root
            版との最大の差分。実プロダクトではルート配置を推奨。
          </Trans>
        }
        additionalNotes={
          <Trans>
            Android の formSheet は CoordinatorLayout 上の BottomSheetBehavior
            として実装される。シート内に ScrollView を置く場合は `nestedScrollEnabled` を true
            にしてシートの drag と nested scroll を連携させる必要がある (詳細:
            react-native-screens#2687)。
            {"\n\n"}
            さらに RN 0.83 の Android ScrollView には「コンテンツの実高さが ScrollView
            より短い場合、OnInterceptTouchEvent が常に false を返し nested scroll event を一切
            dispatch しない」既知の挙動があり、シート内コンテンツが領域に収まる
            場合は下スワイプによるシートの dismiss が動かなくなる。RN 側のフィックス
            (facebook/react-native#55239) は `useNestedScrollViewAndroid` feature flag 経由で RN
            0.84 以降に入る見込み。
            {"\n\n"}
            そのため SDK 55 ではシート内のコンテンツがシート高さを上回るボリュームに
            なるよう設計するか、grabber や明示的な閉じるボタンを必ず併設するのが安全。
            このサンプル画面はその制約を満たすためにこのメモ自体でコンテンツを伸ばして いる。
          </Trans>
        }
      />
    </>
  );
}
