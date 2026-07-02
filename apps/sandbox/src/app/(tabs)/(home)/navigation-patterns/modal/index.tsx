import type { ReactElement } from "react";
import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import {
  type LauncherSection,
  PresentationLauncherList,
} from "../../../../../features/navigation-patterns/presentation-launcher/PresentationLauncherList";

export default function ModalIntermediate(): ReactElement {
  const { t } = useLingui();

  const sections = [
    {
      data: [
        {
          href: "/navigation-patterns/modal/on-root",
          text: <Trans>on root</Trans>,
          description: <Trans>navigation root から表示</Trans>,
          preview: "sheet",
          scope: "root",
        },
        {
          href: "/navigation-patterns/modal/in-tab",
          text: <Trans>in tab</Trans>,
          description: <Trans>tab navigator 内から表示</Trans>,
          preview: "sheet",
          scope: "tab",
        },
      ],
    },
    {
      title: <Trans>slide_from_bottom バリエーション</Trans>,
      footer: (
        <Trans>
          `animation: slide_from_bottom` で両 OS
          を下からスライドに統一した上で、ヘッダー左の戻る要素を 3 通りに切り替えたサンプル。on-root
          はタブバーごと覆う / in-tab は Android がタブ内、の挙動差も 同時に確認できる。
        </Trans>
      ),
      data: [
        {
          href: "/navigation-patterns/modal/on-root-slide-from-bottom",
          text: <Trans>on root + slide_from_bottom</Trans>,
          description: <Trans>デフォルトの戻る ←</Trans>,
          preview: "sheet",
          scope: "root",
        },
        {
          href: "/navigation-patterns/modal/on-root-slide-from-bottom-back-hidden",
          text: <Trans>on root + slide_from_bottom + back hidden</Trans>,
          description: <Trans>headerBackVisible: false でヘッダー左を非表示</Trans>,
          preview: "sheet",
          scope: "root",
        },
        {
          href: "/navigation-patterns/modal/on-root-slide-from-bottom-close",
          text: <Trans>on root + slide_from_bottom + close icon</Trans>,
          description: <Trans>headerBackIcon でネイティブの戻るグリフを × に差し替え</Trans>,
          preview: "sheet",
          scope: "root",
        },
        {
          href: "/navigation-patterns/modal/in-tab-slide-from-bottom",
          text: <Trans>in tab + slide_from_bottom</Trans>,
          description: <Trans>デフォルトの戻る ←</Trans>,
          preview: "sheet",
          scope: "tab",
        },
        {
          href: "/navigation-patterns/modal/in-tab-slide-from-bottom-back-hidden",
          text: <Trans>in tab + slide_from_bottom + back hidden</Trans>,
          description: <Trans>headerBackVisible: false でヘッダー左を非表示</Trans>,
          preview: "sheet",
          scope: "tab",
        },
        {
          href: "/navigation-patterns/modal/in-tab-slide-from-bottom-close",
          text: <Trans>in tab + slide_from_bottom + close icon</Trans>,
          description: <Trans>headerBackIcon でネイティブの戻るグリフを × に差し替え</Trans>,
          preview: "sheet",
          scope: "tab",
        },
      ],
    },
  ] as const satisfies LauncherSection[];

  return (
    <>
      <Stack.Screen.Title>{t`modal`}</Stack.Screen.Title>
      <PresentationLauncherList sections={sections} />
    </>
  );
}
