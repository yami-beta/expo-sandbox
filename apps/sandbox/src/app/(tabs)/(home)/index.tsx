import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import { LinkList, LinkSection, type LinkItem } from "../../../components/link-list/LinkList";
import { useTheme } from "../../../theme/useTheme";

export default function Index() {
  const { t } = useLingui();
  const { tokens } = useTheme();

  const sampleItems = [
    {
      href: "/navigation-patterns",
      text: <Trans>ナビゲーションパターン</Trans>,
      description: <Trans>presentation オプションのデモ</Trans>,
      leadingIcon: <Ionicons name="layers-outline" size={22} color={tokens.color.text.secondary} />,
    },
  ] as const satisfies LinkItem[];

  const upcomingItems = [
    {
      id: "components",
      text: <Trans>コンポーネント</Trans>,
      description: <Trans>Button / Card など (準備中)</Trans>,
      leadingIcon: <Ionicons name="apps-outline" size={22} color={tokens.color.text.tertiary} />,
      disabled: true,
    },
    {
      id: "data-fetching",
      text: <Trans>データ取得</Trans>,
      description: <Trans>React Query / fetch サンプル (準備中)</Trans>,
      leadingIcon: (
        <Ionicons name="cloud-download-outline" size={22} color={tokens.color.text.tertiary} />
      ),
      disabled: true,
    },
  ] as const satisfies LinkItem[];

  return (
    <>
      <Stack.Screen.Title>{t`ホーム`}</Stack.Screen.Title>
      <LinkList>
        <LinkSection title={<Trans>サンプル</Trans>} data={sampleItems} />
        <LinkSection title={<Trans>準備中</Trans>} data={upcomingItems} />
      </LinkList>
    </>
  );
}
