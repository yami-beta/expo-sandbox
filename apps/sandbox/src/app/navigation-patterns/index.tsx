import { LinkList, type LinkItem } from "../../components/link-list/LinkList";

const list = [
  {
    href: "/navigation-patterns/modal",
    text: "Modal Presentation",
  },
  {
    href: "/navigation-patterns/form-sheet",
    text: "Form Sheet Presentation",
  },
] as const satisfies LinkItem[];

export default function NavigationPatterns() {
  return <LinkList data={list} />;
}
