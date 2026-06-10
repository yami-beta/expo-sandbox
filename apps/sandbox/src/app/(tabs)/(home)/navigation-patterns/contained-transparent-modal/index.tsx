import type { ReactElement } from "react";
import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import {
  type LauncherSection,
  PresentationLauncherList,
} from "../../../../../components/presentation-launcher/PresentationLauncherList";

export default function ContainedTransparentModalIntermediate(): ReactElement {
  const { t } = useLingui();

  const sections = [
    {
      data: [
        {
          href: "/navigation-patterns/contained-transparent-modal/on-root",
          text: <Trans>on root</Trans>,
          description: <Trans>navigation root から表示</Trans>,
          preview: "transparent",
          scope: "root",
        },
        {
          href: "/navigation-patterns/contained-transparent-modal/in-tab",
          text: <Trans>in tab</Trans>,
          description: <Trans>tab navigator 内から表示</Trans>,
          preview: "transparent",
          scope: "tab",
        },
      ],
    },
  ] as const satisfies LauncherSection[];

  return (
    <>
      <Stack.Screen.Title>{t`containedTransparentModal`}</Stack.Screen.Title>
      <PresentationLauncherList sections={sections} />
    </>
  );
}
