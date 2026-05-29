import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import { GroupedList, type ListSection } from "../../../../components/grouped-list/GroupedList";

export default function NavigationPatterns() {
  const { t } = useLingui();

  const sections = [
    {
      title: <Trans>Presentation オプション</Trans>,
      footer: <Trans>Stack.Screen の presentation に渡せる値のサンプルです。</Trans>,
      data: [
        { href: "/navigation-patterns/card", text: <Trans>card (push)</Trans> },
        { href: "/navigation-patterns/modal", text: <Trans>modal</Trans> },
        {
          href: "/navigation-patterns/transparent-modal",
          text: <Trans>transparentModal</Trans>,
        },
        {
          href: "/navigation-patterns/contained-modal",
          text: <Trans>containedModal</Trans>,
        },
        {
          href: "/navigation-patterns/contained-transparent-modal",
          text: <Trans>containedTransparentModal</Trans>,
        },
        {
          href: "/navigation-patterns/full-screen-modal",
          text: <Trans>fullScreenModal</Trans>,
        },
        { href: "/navigation-patterns/form-sheet", text: <Trans>formSheet</Trans> },
      ],
    },
  ] as const satisfies ListSection[];

  return (
    <>
      <Stack.Screen.Title>{t`ナビゲーションパターン`}</Stack.Screen.Title>
      <GroupedList sections={sections} />
    </>
  );
}
