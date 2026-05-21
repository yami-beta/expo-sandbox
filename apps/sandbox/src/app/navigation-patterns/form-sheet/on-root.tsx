import type { ReactElement } from "react";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Trans, useLingui } from "@lingui/react/macro";
import { PresentationSampleScreen } from "../../../components/presentation-sample/PresentationSampleScreen";

export default function FormSheetSample(): ReactElement {
  const { t } = useLingui();

  return (
    <>
      <Stack.Screen.Title>{t`formSheet`}</Stack.Screen.Title>
      <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
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
          additionalNotes={
            <Trans>
              Android の formSheet は CoordinatorLayout 上の BottomSheetBehavior
              として実装される。シート内に ScrollView を置く場合は `nestedScrollEnabled` を true
              にしてシートの drag と nested scroll を連携させる必要がある (詳細:
              react-native-screens#2687)。
              {"\n\n"}
              さらに RN 0.83 の Android ScrollView には「コンテンツの実高さが ScrollView
              より短い場合、OnInterceptTouchEvent が常に false を返し nested scroll event を一切
              dispatch しない」既知の挙動があり、シート内コンテンツが領域に
              収まる場合は下スワイプによるシートの dismiss が動かなくなる。RN 側のフィックス
              (facebook/react-native#55239) は `useNestedScrollViewAndroid` feature flag 経由で RN
              0.84 以降に入る見込み。
              {"\n\n"}
              そのため SDK 55 ではシート内のコンテンツがシート高さを上回るボリュームに
              なるよう設計するか、grabber や明示的な閉じるボタンを必ず併設するのが安全。
              このサンプル画面はその制約を満たすためにこのメモ自体でコンテンツを伸ばして いる。
            </Trans>
          }
        />
      </SafeAreaView>
    </>
  );
}
