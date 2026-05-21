import type { ReactElement } from "react";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Trans, useLingui } from "@lingui/react/macro";
import { PresentationSampleScreen } from "../../../components/presentation-sample/PresentationSampleScreen";

export default function ContainedModalSample(): ReactElement {
  const { t } = useLingui();

  return (
    <>
      <Stack.Screen.Title>{t`containedModal`}</Stack.Screen.Title>
      <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
        <PresentationSampleScreen
          presentationValue="containedModal"
          heading={<Trans>ルート Stack に置いた containedModal (観察用)</Trans>}
          iosBehavior={
            <Trans>
              UIModalPresentationCurrentContext で表示される。`definesPresentationContext: true`
              を持つ最も近い祖先 view controller の bounds 内に重なる挙動だが、ルート Stack
              配下に置くと presentation context はアプリのルート view controller になり、結果
              として画面全体 (タブバーごと) を覆ってしまう。これでは `fullScreenModal` と
              見た目の差がなくなり、containedModal を使う意味が消える ── 本来は tab content の
              bounds に収まることを期待する presentation 値なので、ルート配置は推奨されない
              (観察用)。swipe down では閉じない。
            </Trans>
          }
          androidBehavior={
            <Trans>
              ネイティブの対応 presentation がないため modal にフォールバックする。Android は元々
              current context の概念に依存しないため、配置 Stack によらず modal
              と同等の挙動になる。`animation` 未指定なら OS 標準の遷移 (多くは右からスライド)
              になる。
            </Trans>
          }
          dismissNote={
            <Trans>
              iOS では「閉じる」ボタンが必須 (swipe down は効かない)。Android
              では戻る操作でも閉じる。 **ルート版は fullScreenModal
              とほぼ同じ挙動になりフォールバック相当**。挙動差を 観察したい場合は in-tab
              版と並べて比較する。
            </Trans>
          }
        />
      </SafeAreaView>
    </>
  );
}
