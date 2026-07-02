import type { ReactElement } from "react";
import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import { PresentationSampleOverlay } from "../../../features/navigation-patterns/presentation-sample/PresentationSampleOverlay";

export default function ContainedTransparentModalSample(): ReactElement {
  const { t } = useLingui();

  return (
    <>
      <Stack.Screen.Title>{t`containedTransparentModal`}</Stack.Screen.Title>
      <PresentationSampleOverlay
        presentationValue="containedTransparentModal"
        heading={<Trans>ルート Stack に置いた containedTransparentModal (観察用)</Trans>}
        iosBehavior={
          <Trans>
            UIModalPresentationOverCurrentContext で表示される。透過を保ったまま current context
            の上に重なる挙動だが、ルート Stack 配下に置くと current context はアプリのルート view
            controller になり、結果として画面全体 (タブバーを含む領域全体)
            に透過オーバーレイが展開してしまう。これでは `transparentModal` と見た目の差が
            なくなり、containedTransparentModal を使う意味が消える ── 本来は tab content の bounds
            に収まることを期待する presentation 値なので、ルート配置は推奨されない (観察用)。
          </Trans>
        }
        androidBehavior={
          <Trans>
            ネイティブの対応 presentation がないため transparentModal にフォールバックする。 Android
            は元々 current context の概念に依存しないため、配置 Stack によらず transparentModal
            と同等の挙動になる。
          </Trans>
        }
        dismissNote={
          <Trans>
            背景の半透明エリアをタップ、または「閉じる」ボタンで閉じる。 **ルート版は
            transparentModal とほぼ同じ挙動になりフォールバック相当**。 挙動差を観察したい場合は
            in-tab 版と並べて比較する。
          </Trans>
        }
      />
    </>
  );
}
