import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import { LinkList, LinkListItem, LinkSection } from "../../../../components/link-list/LinkList";

export default function NavigationPatterns() {
  const { t } = useLingui();
  return (
    <>
      <Stack.Screen.Title>{t`ナビゲーションパターン`}</Stack.Screen.Title>
      <LinkList>
        <LinkSection
          title={<Trans>Presentation オプション</Trans>}
          footer={<Trans>Stack.Screen の presentation に渡せる値のサンプルです。</Trans>}
        >
          <LinkListItem href="/navigation-patterns/card" text={<Trans>card (push)</Trans>} />
          <LinkListItem href="/navigation-patterns/modal" text={<Trans>modal</Trans>} />
          <LinkListItem
            href="/navigation-patterns/transparent-modal"
            text={<Trans>transparentModal</Trans>}
          />
          <LinkListItem
            href="/navigation-patterns/contained-modal"
            text={<Trans>containedModal</Trans>}
          />
          <LinkListItem
            href="/navigation-patterns/contained-transparent-modal"
            text={<Trans>containedTransparentModal</Trans>}
          />
          <LinkListItem
            href="/navigation-patterns/full-screen-modal"
            text={<Trans>fullScreenModal</Trans>}
          />
          <LinkListItem href="/navigation-patterns/form-sheet" text={<Trans>formSheet</Trans>} />
        </LinkSection>
      </LinkList>
    </>
  );
}
