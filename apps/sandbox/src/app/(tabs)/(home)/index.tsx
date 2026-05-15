import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import { LinkList, type LinkItem } from "../../../components/link-list/LinkList";

export default function Index() {
  const { t } = useLingui();
  const list = [
    {
      href: "/navigation-patterns",
      text: <Trans>ナビゲーションパターン</Trans>,
    },
  ] as const satisfies LinkItem[];

  return (
    <>
      <Stack.Screen.Title>{t`ホーム`}</Stack.Screen.Title>
      <LinkList data={list} />
    </>
  );
}
