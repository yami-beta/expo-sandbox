import { Trans } from "@lingui/react/macro";
import { LinkList, type LinkItem } from "../../components/link-list/LinkList";

export default function LinguiExamples() {
  const list = [
    {
      href: "/lingui-examples/plural-examples",
      text: <Trans>Pluralマクロの使い方</Trans>,
    },
  ] as const satisfies LinkItem[];

  return <LinkList data={list} />;
}
