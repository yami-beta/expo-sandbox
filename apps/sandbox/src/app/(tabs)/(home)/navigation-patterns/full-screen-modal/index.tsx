import type { ReactElement } from "react";
import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import { LinkList, type LinkItem } from "../../../../../components/link-list/LinkList";

export default function FullScreenModalIntermediate(): ReactElement {
  const { t } = useLingui();
  const list = [
    {
      href: "/navigation-patterns/full-screen-modal/on-root",
      text: <Trans>on root</Trans>,
    },
    // in tab 版は #114 で追加する
    // {
    //   href: "/navigation-patterns/full-screen-modal/in-tab",
    //   text: <Trans>in tab</Trans>,
    // },
  ] as const satisfies LinkItem[];

  return (
    <>
      <Stack.Screen.Title>{t`fullScreenModal`}</Stack.Screen.Title>
      <LinkList data={list} />
    </>
  );
}
