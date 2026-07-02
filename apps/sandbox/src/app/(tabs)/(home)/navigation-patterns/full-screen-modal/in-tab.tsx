import type { ReactElement } from "react";
import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import { PresentationSampleScreen } from "../../../../../features/navigation-patterns/presentation-sample/PresentationSampleScreen";

export default function FullScreenModalSample(): ReactElement {
  const { t } = useLingui();

  return (
    <>
      <Stack.Screen.Title>{t`fullScreenModal`}</Stack.Screen.Title>
      <PresentationSampleScreen
        presentationValue="fullScreenModal"
        heading={<Trans>タブ内 Stack 上の全画面モーダル</Trans>}
        iosBehavior={
          <Trans>
            UIModalPresentationFullScreen で画面全体を覆う。`fullScreenModal` は presentation
            context に関係なく画面全体を覆うので、タブ内 Stack 配下に置いてもタブバーごと
            画面全体を覆う (on-root 版と iOS では同じ見た目になる)。React Navigation
            公式に「ジェスチャーで dismiss できない」と明記されているため、swipe
            で閉じない挙動はライブラリの保証として依拠できる。明示的な閉じる操作が必須。
          </Trans>
        }
        androidBehavior={
          <Trans>
            ネイティブの対応 presentation がないため modal にフォールバックするが、タブ内 Stack
            配下に置くと **tab 内に push 風に出る**ケースがある (Android は presentation context
            の概念に依存せず、Stack の階層がそのまま遷移先のレイアウトに反映されるため)。
            `animation` 未指定なら OS 標準の遷移。戻るボタン / システムジェスチャーで閉じられる。
          </Trans>
        }
        dismissNote={
          <Trans>
            iOS では「閉じる」ボタンが必須 (swipe down 不可)。Android では戻る操作でも閉じる。
            **Android で tab 内 push 風に出る可能性がある**のが on-root 版との最大の差分。
          </Trans>
        }
      />
    </>
  );
}
