import { Stack } from "expo-router";
import { LinkList, type LinkItem } from "../../../../components/link-list/LinkList";
import { Trans, useLingui } from "@lingui/react/macro";

export default function NavigationPatterns() {
  const { t } = useLingui();
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

  return (
    <>
      <Stack.Screen.Title>{t`ナビゲーションパターン`}</Stack.Screen.Title>
      <LinkList data={list} />
    </>
  );
}
