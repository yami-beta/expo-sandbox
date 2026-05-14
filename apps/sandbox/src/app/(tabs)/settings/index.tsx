import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import { LinkList, type LinkItem } from "../../../components/link-list/LinkList";

export default function SettingsScreen() {
  const { t } = useLingui();
  const list = [
    {
      href: "/settings/theme",
      text: <Trans>テーマ</Trans>,
    },
  ] as const satisfies LinkItem[];

  return (
    <>
      <Stack.Screen.Title>{t`設定`}</Stack.Screen.Title>
      <LinkList data={list} />
    </>
  );
}
