import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import { LinkList, LinkSection, type LinkItem } from "../../../../components/link-list/LinkList";

export default function NavigationPatterns() {
  const { t } = useLingui();
  const list = [
    {
      href: "/navigation-patterns/card",
      text: <Trans>card (push)</Trans>,
    },
    {
      href: "/navigation-patterns/modal",
      text: <Trans>modal</Trans>,
    },
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
    {
      href: "/navigation-patterns/form-sheet",
      text: <Trans>formSheet</Trans>,
    },
  ] as const satisfies LinkItem[];

  return (
    <>
      <Stack.Screen.Title>{t`ナビゲーションパターン`}</Stack.Screen.Title>
      <LinkList>
        <LinkSection
          title={<Trans>Presentation オプション</Trans>}
          footer={<Trans>Stack.Screen の presentation に渡せる値のサンプルです。</Trans>}
          data={list}
        />
      </LinkList>
    </>
  );
}
