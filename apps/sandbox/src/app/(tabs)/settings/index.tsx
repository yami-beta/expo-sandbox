import {
  LinkList,
  type LinkItem,
} from "../../../components/link-list/LinkList";

const list = [
  {
    href: "/settings/theme",
    text: "テーマ",
  },
] as const satisfies LinkItem[];

export default function SettingsScreen() {
  return <LinkList data={list} />;
}
