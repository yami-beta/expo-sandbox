import type { ReactElement } from "react";
import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import { LinkList, type LinkItem } from "../../../../../components/link-list/LinkList";

export default function CardIntermediate(): ReactElement {
  const { t } = useLingui();
  const list = [
    {
      href: "/navigation-patterns/card/on-root",
      text: <Trans>on root</Trans>,
    },
    {
      href: "/navigation-patterns/card/in-tab",
      text: <Trans>in tab</Trans>,
    },
  ] as const satisfies LinkItem[];

  return (
    <>
      <Stack.Screen.Title>{t`card`}</Stack.Screen.Title>
      <LinkList data={list} />
    </>
  );
}
