import {
  LinkList,
  type LinkItem,
} from "../../../components/link-list/LinkList";

const list = [
  {
    href: "/navigation-patterns",
    text: "Navigation Patterns",
  },
] as const satisfies LinkItem[];

export default function Index() {
  return <LinkList data={list} />;
}
