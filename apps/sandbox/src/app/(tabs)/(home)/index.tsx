import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import { LinkList, type LinkSection } from "../../../components/link-list/LinkList";
import { useTheme } from "../../../theme/useTheme";

export default function Index() {
  const { t } = useLingui();
  const { tokens } = useTheme();

  const sections = [
    {
      title: <Trans>サンプル</Trans>,
      iconSlotReserved: true,
      data: [
        {
          href: "/navigation-patterns",
          text: <Trans>ナビゲーションパターン</Trans>,
          description: <Trans>presentation オプションのデモ</Trans>,
          leadingIcon: (
            <Ionicons name="layers-outline" size={22} color={tokens.color.text.secondary} />
          ),
        },
      ],
    },
    {
      title: <Trans>準備中</Trans>,
      iconSlotReserved: true,
      data: [
        {
          disabled: true,
          text: <Trans>コンポーネント</Trans>,
          description: <Trans>Button / Card など (準備中)</Trans>,
          leadingIcon: (
            <Ionicons name="apps-outline" size={22} color={tokens.color.text.tertiary} />
          ),
        },
        {
          disabled: true,
          text: <Trans>データ取得</Trans>,
          description: <Trans>React Query / fetch サンプル (準備中)</Trans>,
          leadingIcon: (
            <Ionicons name="cloud-download-outline" size={22} color={tokens.color.text.tertiary} />
          ),
        },
      ],
    },
  ] as const satisfies LinkSection[];

  return (
    <>
      <Stack.Screen.Title>{t`ホーム`}</Stack.Screen.Title>
      <LinkList sections={sections} />
    </>
  );
}
