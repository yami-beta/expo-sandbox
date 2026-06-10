import type { ReactElement } from "react";
import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import {
  type LauncherSection,
  PresentationLauncherList,
} from "../../../../../components/presentation-launcher/PresentationLauncherList";

export default function FormSheetIntermediate(): ReactElement {
  const { t } = useLingui();

  const sections = [
    {
      data: [
        {
          href: "/navigation-patterns/form-sheet/on-root",
          text: <Trans>on root</Trans>,
          description: <Trans>navigation root から表示</Trans>,
          preview: "formSheet",
          scope: "root",
        },
        {
          href: "/navigation-patterns/form-sheet/in-tab",
          text: <Trans>in tab</Trans>,
          description: <Trans>tab navigator 内から表示</Trans>,
          preview: "formSheet",
          scope: "tab",
        },
      ],
    },
  ] as const satisfies LauncherSection[];

  return (
    <>
      <Stack.Screen.Title>{t`formSheet`}</Stack.Screen.Title>
      <PresentationLauncherList sections={sections} />
    </>
  );
}
