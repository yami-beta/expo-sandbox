import { Ionicons } from "@react-native-vector-icons/ionicons/static";
import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import { useSession } from "../../../features/auth/useSession";
import { GroupedList, type ListSection } from "../../../components/grouped-list/GroupedList";
import { Icon } from "../../../components/icon/Icon";
import { useTheme } from "../../../theme/useTheme";

export default function Index() {
  const { t } = useLingui();
  const { tokens } = useTheme();
  const { session } = useSession();
  // 認証状態でサンプルの導線を出し分ける(session の判定は他の auth 関連コンポーネントと
  // 同じく falsy チェックで揃える)。
  // 未認証: /sign-in へのリンク。認証済み: /sign-in は Stack.Protected でフィルタされ
  // 遷移しても anchor に戻るだけになるため、代わりに /account への導線を見せる。
  const authSampleItem = session
    ? ({
        href: "/account",
        text: <Trans>マイページ</Trans>,
        description: <Trans>サインイン済みユーザー向けのマイページ画面のデモ</Trans>,
        leadingIcon: (
          <Ionicons
            name="person-circle-outline"
            size={22}
            color={tokens.color.text.secondary}
            accessibilityElementsHidden={true}
            importantForAccessibility="no-hide-descendants"
          />
        ),
      } as const)
    : ({
        href: "/sign-in",
        text: <Trans>サインインのサンプル</Trans>,
        description: <Trans>サインイン画面のデモ</Trans>,
        leadingIcon: (
          <Ionicons
            name="log-in-outline"
            size={22}
            color={tokens.color.text.secondary}
            accessibilityElementsHidden={true}
            importantForAccessibility="no-hide-descendants"
          />
        ),
      } as const);

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
            <Ionicons
              name="layers-outline"
              size={22}
              color={tokens.color.text.secondary}
              accessibilityElementsHidden={true}
              importantForAccessibility="no-hide-descendants"
            />
          ),
        },
        {
          href: "/components",
          text: <Trans>コンポーネント</Trans>,
          description: <Trans>Icon / Button / Card など</Trans>,
          leadingIcon: (
            <Icon name="grid" size={22} color={tokens.color.text.secondary} decorative />
          ),
        },
        {
          href: "/expo-ui",
          text: <Trans>Expo UI</Trans>,
          description: <Trans>@expo/ui のネイティブ UI サンプル</Trans>,
          leadingIcon: (
            <Ionicons
              name="cube-outline"
              size={22}
              color={tokens.color.text.secondary}
              accessibilityElementsHidden={true}
              importantForAccessibility="no-hide-descendants"
            />
          ),
        },
        {
          href: "/redirect",
          text: <Trans>Redirect</Trans>,
          description: <Trans>非同期処理の完了後に画面遷移するサンプル</Trans>,
          leadingIcon: (
            <Ionicons
              name="trail-sign-outline"
              size={22}
              color={tokens.color.text.secondary}
              accessibilityElementsHidden={true}
              importantForAccessibility="no-hide-descendants"
            />
          ),
        },
        authSampleItem,
      ],
    },
    {
      title: <Trans>準備中</Trans>,
      iconSlotReserved: true,
      data: [
        {
          disabled: true,
          text: <Trans>データ取得</Trans>,
          description: <Trans>React Query / fetch サンプル (準備中)</Trans>,
          leadingIcon: (
            <Ionicons
              name="cloud-download-outline"
              size={22}
              color={tokens.color.text.tertiary}
              accessibilityElementsHidden={true}
              importantForAccessibility="no-hide-descendants"
            />
          ),
        },
      ],
    },
  ] as const satisfies ListSection[];

  return (
    <>
      <Stack.Screen.Title>{t`ホーム`}</Stack.Screen.Title>
      <GroupedList sections={sections} />
    </>
  );
}
