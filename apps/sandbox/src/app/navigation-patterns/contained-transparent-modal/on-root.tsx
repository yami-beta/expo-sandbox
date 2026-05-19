import type { ReactElement } from "react";
import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import { PresentationSampleScreen } from "../../../components/presentation-sample/PresentationSampleScreen";

export default function ContainedTransparentModalSample(): ReactElement {
  const { t } = useLingui();

  return (
    <>
      <Stack.Screen.Title>{t`containedTransparentModal`}</Stack.Screen.Title>
      <PresentationSampleScreen
        variant="transparent-overlay"
        presentationValue="containedTransparentModal"
        heading={<Trans>current context 上の透過 modal</Trans>}
        iosBehavior={
          <Trans>
            UIModalPresentationOverCurrentContext で表示される。透過を保ったまま current context
            の上に重なる。本サンプルはホームタブの内側 Stack 配下に配置しているため、開いても
            current context の範囲 (タブバーを除いた領域) に透過オーバーレイが収まる。
          </Trans>
        }
        androidBehavior={
          <Trans>
            ネイティブの対応 presentation がないため transparentModal
            にフォールバックする。標準の透過モーダルとして開く。
          </Trans>
        }
        dismissNote={
          <Trans>
            背景の半透明エリアをタップ、または「閉じる」ボタンで閉じる。iOS では current context
            の範囲を越えない。
          </Trans>
        }
      />
    </>
  );
}
