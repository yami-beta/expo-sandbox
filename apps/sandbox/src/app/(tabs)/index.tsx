import { Trans } from "@lingui/react/macro";
import { SafeAreaView } from "react-native-screens/experimental";
import { LinkList, type LinkItem } from "../../components/link-list/LinkList";

export default function Index() {
  const list = [
    {
      href: "/navigation-patterns",
      text: <Trans>ナビゲーションパターン</Trans>,
    },
  ] as const satisfies LinkItem[];

  return (
    <SafeAreaView edges={{ top: true }}>
      <LinkList data={list} />
    </SafeAreaView>
  );
}
