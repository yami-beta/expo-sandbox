import type { ReactElement } from "react";
import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import { LinkList, type LinkItem } from "../../../../../components/link-list/LinkList";

export default function ContainedModalIntermediate(): ReactElement {
  const { t } = useLingui();
  const list = [
    // on root 版は #113 で追加する
    // {
    //   href: "/navigation-patterns/contained-modal/on-root",
    //   text: <Trans>on root</Trans>,
    // },
    {
      href: "/navigation-patterns/contained-modal/in-tab",
      text: <Trans>in tab</Trans>,
    },
  ] as const satisfies LinkItem[];

  return (
    <>
      <Stack.Screen.Title>{t`containedModal`}</Stack.Screen.Title>
      <LinkList data={list} />
    </>
  );
}
