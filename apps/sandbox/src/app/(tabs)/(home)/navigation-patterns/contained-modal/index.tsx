import type { ReactElement } from "react";
import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import { LinkList, LinkSection, type LinkItem } from "../../../../../components/link-list/LinkList";

export default function ContainedModalIntermediate(): ReactElement {
  const { t } = useLingui();
  const list = [
    {
      href: "/navigation-patterns/contained-modal/on-root",
      text: <Trans>on root</Trans>,
      description: <Trans>navigation root から表示</Trans>,
    },
    {
      href: "/navigation-patterns/contained-modal/in-tab",
      text: <Trans>in tab</Trans>,
      description: <Trans>tab navigator 内から表示</Trans>,
    },
  ] as const satisfies LinkItem[];

  return (
    <>
      <Stack.Screen.Title>{t`containedModal`}</Stack.Screen.Title>
      <LinkList>
        <LinkSection data={list} />
      </LinkList>
    </>
  );
}
