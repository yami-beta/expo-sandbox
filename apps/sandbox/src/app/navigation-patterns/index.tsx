import { LinkList, type LinkItem } from "../../components/link-list/LinkList";
import { Trans } from "@lingui/react/macro";

export default function NavigationPatterns() {
  const list = [
    {
      href: "/navigation-patterns/modal",
      text: <Trans>モーダル表示</Trans>,
    },
    {
      href: "/navigation-patterns/form-sheet",
      text: <Trans>フォームシート表示</Trans>,
    },
  ] as const satisfies LinkItem[];

  return <LinkList data={list} />;
}
