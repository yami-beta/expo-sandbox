import type { ReactElement } from "react";
import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import {
  type LauncherSection,
  PresentationLauncherList,
} from "../../../../../components/presentation-launcher/PresentationLauncherList";

export default function CardIntermediate(): ReactElement {
  const { t } = useLingui();

  const sections = [
    {
      data: [
        {
          href: "/navigation-patterns/card/on-root",
          text: <Trans>on root</Trans>,
          description: <Trans>navigation root から表示</Trans>,
          preview: "push",
          scope: "root",
        },
        {
          href: "/navigation-patterns/card/in-tab",
          text: <Trans>in tab</Trans>,
          description: <Trans>tab navigator 内から表示</Trans>,
          preview: "push",
          scope: "tab",
        },
      ],
    },
    {
      title: <Trans>animation バリエーション</Trans>,
      footer: <Trans>presentation に animation を組み合わせたサンプルです。</Trans>,
      data: [
        {
          href: "/navigation-patterns/card/in-tab-fade",
          text: <Trans>in tab + fade</Trans>,
          description: <Trans>クロスフェードで遷移</Trans>,
          preview: "push",
          scope: "tab",
        },
        {
          href: "/navigation-patterns/card/in-tab-none",
          text: <Trans>in tab + none</Trans>,
          description: <Trans>アニメーションなしで即時切替</Trans>,
          preview: "push",
          scope: "tab",
        },
      ],
    },
  ] as const satisfies LauncherSection[];

  return (
    <>
      <Stack.Screen.Title>{t`card`}</Stack.Screen.Title>
      <PresentationLauncherList sections={sections} />
    </>
  );
}
