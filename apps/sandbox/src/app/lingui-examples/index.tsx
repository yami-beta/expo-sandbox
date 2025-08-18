import { Trans } from "@lingui/react/macro";
import { LinkList, type LinkItem } from "../../components/link-list/LinkList";

export default function LinguiExamples() {
  const list = [
    {
      href: "/lingui-examples/plural-examples",
      text: <Trans>Pluralマクロの使い方</Trans>,
    },
    {
      href: "/lingui-examples/select-examples",
      text: <Trans>Selectマクロの使い方</Trans>,
    },
    {
      href: "/lingui-examples/selectordinal-examples",
      text: <Trans>SelectOrdinalマクロの使い方</Trans>,
    },
    {
      href: "/lingui-examples/format-examples",
      text: <Trans>日付・数値フォーマット</Trans>,
    },
  ] as const satisfies LinkItem[];

  return <LinkList data={list} />;
}
