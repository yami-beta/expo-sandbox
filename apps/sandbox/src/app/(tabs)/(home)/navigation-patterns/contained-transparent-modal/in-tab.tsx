import type { ReactElement } from "react";
import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import { PresentationSampleOverlay } from "../../../../../features/navigation-patterns/presentation-sample/PresentationSampleOverlay";

export default function ContainedTransparentModalSample(): ReactElement {
  const { t } = useLingui();

  return (
    <>
      <Stack.Screen.Title>{t`containedTransparentModal`}</Stack.Screen.Title>
      <PresentationSampleOverlay
        presentationValue="containedTransparentModal"
        heading={<Trans>タブ内 Stack 上の containedTransparentModal (本来挙動)</Trans>}
        iosBehavior={
          <Trans>
            UIModalPresentationOverCurrentContext で表示される。透過を保ったまま current context
            の上に重なる。本サンプルはホームタブの内側 Stack 配下に配置しているため、開いても
            current context の範囲 (タブバーを除いた tab content 領域) に透過オーバーレイが 収まる
            ── これが containedTransparentModal の本来期待される挙動。タブバーは前面に
            残ったままになる。
          </Trans>
        }
        androidBehavior={
          <Trans>
            ネイティブの対応 presentation がないため transparentModal にフォールバックする。 Android
            は current context の概念に依存しないため、配置 Stack による挙動差はなく、 on-root
            版と同じ挙動になる。
          </Trans>
        }
        dismissNote={
          <Trans>
            背景の半透明エリアをタップ、または「閉じる」ボタンで閉じる。iOS では
            **透過オーバーレイがタブバーを越えず tab content の bounds に収まる**のが on-root
            版との最大の差分。
          </Trans>
        }
      />
    </>
  );
}
