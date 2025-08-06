import { Trans } from "@lingui/react/macro";
import {
  LinkList,
  type LinkItem,
} from "../../../components/link-list/LinkList";

export default function SettingsScreen() {
  const list = [
    {
      href: "/settings/theme",
      text: <Trans>テーマ</Trans>,
    },
    {
      href: "/settings/language",
      text: <Trans>言語</Trans>,
    },
  ] as const satisfies LinkItem[];

  return <LinkList data={list} />;
}
