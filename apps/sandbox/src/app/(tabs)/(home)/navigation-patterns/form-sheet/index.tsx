import type { ReactElement } from "react";
import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import { LinkList, type LinkItem } from "../../../../../components/link-list/LinkList";

export default function FormSheetIntermediate(): ReactElement {
  const { t } = useLingui();
  const list = [
    {
      href: "/navigation-patterns/form-sheet/on-root",
      text: <Trans>on root</Trans>,
    },
    {
      href: "/navigation-patterns/form-sheet/in-tab",
      text: <Trans>in tab</Trans>,
    },
  ] as const satisfies LinkItem[];

  return (
    <>
      <Stack.Screen.Title>{t`formSheet`}</Stack.Screen.Title>
      <LinkList data={list} />
    </>
  );
}
