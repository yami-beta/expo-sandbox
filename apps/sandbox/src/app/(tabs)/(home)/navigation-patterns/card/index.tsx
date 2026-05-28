import type { ReactElement } from "react";
import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import { LinkList, LinkSection, type LinkItem } from "../../../../../components/link-list/LinkList";

export default function CardIntermediate(): ReactElement {
  const { t } = useLingui();
  const list = [
    {
      href: "/navigation-patterns/card/on-root",
      text: <Trans>on root</Trans>,
      description: <Trans>navigation root から表示</Trans>,
    },
    {
      href: "/navigation-patterns/card/in-tab",
      text: <Trans>in tab</Trans>,
      description: <Trans>tab navigator 内から表示</Trans>,
    },
  ] as const satisfies LinkItem[];

  return (
    <>
      <Stack.Screen.Title>{t`card`}</Stack.Screen.Title>
      <LinkList>
        <LinkSection data={list} />
      </LinkList>
    </>
  );
}
