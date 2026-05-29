import type { ReactElement } from "react";
import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import { LinkList, LinkListItem, LinkSection } from "../../../../../components/link-list/LinkList";

export default function ModalIntermediate(): ReactElement {
  const { t } = useLingui();
  return (
    <>
      <Stack.Screen.Title>{t`modal`}</Stack.Screen.Title>
      <LinkList>
        <LinkSection>
          <LinkListItem
            href="/navigation-patterns/modal/on-root"
            text={<Trans>on root</Trans>}
            description={<Trans>navigation root から表示</Trans>}
          />
          <LinkListItem
            href="/navigation-patterns/modal/in-tab"
            text={<Trans>in tab</Trans>}
            description={<Trans>tab navigator 内から表示</Trans>}
          />
        </LinkSection>
      </LinkList>
    </>
  );
}
