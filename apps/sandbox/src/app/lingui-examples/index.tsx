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
    {
      href: "/lingui-examples/navigation-tabbar-examples",
      text: <Trans>タブバーの動的機能</Trans>,
    },
    {
      href: "/lingui-examples/navigation-breadcrumb-examples",
      text: <Trans>パンくずリスト</Trans>,
    },
    {
      href: "/lingui-examples/modal-dialog-examples",
      text: <Trans>モーダルダイアログ</Trans>,
    },
    {
      href: "/lingui-examples/dynamic-content-examples",
      text: <Trans>動的コンテンツの翻訳</Trans>,
    },
    {
      href: "/lingui-examples/error-handling-examples",
      text: <Trans>エラーハンドリング</Trans>,
    },
    {
      href: "/lingui-examples/notification-alert-examples",
      text: <Trans>通知とアラート</Trans>,
    },
  ] as const satisfies LinkItem[];

  return <LinkList data={list} />;
}
