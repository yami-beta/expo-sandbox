import type { ReactElement } from "react";
import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import { LinkList, type LinkSection } from "../../../../../components/link-list/LinkList";

export default function ModalIntermediate(): ReactElement {
  const { t } = useLingui();

  const sections = [
    {
      data: [
        {
          href: "/navigation-patterns/modal/on-root",
          text: <Trans>on root</Trans>,
          description: <Trans>navigation root から表示</Trans>,
        },
        {
          href: "/navigation-patterns/modal/in-tab",
          text: <Trans>in tab</Trans>,
          description: <Trans>tab navigator 内から表示</Trans>,
        },
      ],
    },
  ] as const satisfies LinkSection[];

  return (
    <>
      <Stack.Screen.Title>{t`modal`}</Stack.Screen.Title>
      <LinkList sections={sections} />
    </>
  );
}
