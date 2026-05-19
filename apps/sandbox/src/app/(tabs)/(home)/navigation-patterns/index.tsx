import { Stack } from "expo-router";
import { LinkList, type LinkItem } from "../../../../components/link-list/LinkList";
import { Trans, useLingui } from "@lingui/react/macro";

export default function NavigationPatterns() {
  const { t } = useLingui();
  const list = [
    {
      href: "/navigation-patterns/card/in-tab",
      text: <Trans>card (push)</Trans>,
    },
    {
      href: "/navigation-patterns/modal/on-root",
      text: <Trans>modal</Trans>,
    },
    {
      href: "/navigation-patterns/transparent-modal/on-root",
      text: <Trans>transparentModal</Trans>,
    },
    {
      href: "/navigation-patterns/contained-modal/in-tab",
      text: <Trans>containedModal</Trans>,
    },
    {
      href: "/navigation-patterns/contained-transparent-modal/in-tab",
      text: <Trans>containedTransparentModal</Trans>,
    },
    {
      href: "/navigation-patterns/full-screen-modal/on-root",
      text: <Trans>fullScreenModal</Trans>,
    },
    {
      href: "/navigation-patterns/form-sheet/on-root",
      text: <Trans>formSheet</Trans>,
    },
  ] as const satisfies LinkItem[];

  return (
    <>
      <Stack.Screen.Title>{t`ナビゲーションパターン`}</Stack.Screen.Title>
      <LinkList data={list} />
    </>
  );
}
