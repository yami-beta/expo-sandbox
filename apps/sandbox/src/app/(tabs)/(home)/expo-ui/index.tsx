import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import { GroupedList, type ListSection } from "../../../../components/grouped-list/GroupedList";

export default function ExpoUiIndex() {
  const { t } = useLingui();

  const sections = [
    {
      title: <Trans>Drop-in replacements</Trans>,
      footer: (
        <Trans>
          既存コミュニティライブラリと互換 API のコンポーネント。React Native の View
          ツリーにそのまま配置できます。
        </Trans>
      ),
      data: [
        {
          href: "/expo-ui/onboarding",
          text: <Trans>オンボーディング</Trans>,
          description: <Trans>PagerView / MaskedView (fullScreenModal で提示)</Trans>,
        },
        {
          href: "/expo-ui/event-form",
          text: <Trans>イベント作成フォーム</Trans>,
          description: <Trans>DateTimePicker / Picker / SegmentedControl / Slider</Trans>,
        },
        {
          href: "/expo-ui/share-actions",
          text: <Trans>投稿アクション</Trans>,
          description: <Trans>Menu / BottomSheet</Trans>,
        },
      ],
    },
    {
      title: <Trans>Universal</Trans>,
      footer: (
        <Trans>
          Host 配下を iOS は SwiftUI、Android は Jetpack Compose
          で描画するクロスプラットフォームコンポーネント。@expo/ui は新しいパッケージのため API
          は変わる可能性があります。
        </Trans>
      ),
      data: [
        {
          href: "/expo-ui/settings",
          text: <Trans>設定画面</Trans>,
          description: <Trans>List / Switch / Picker / Slider / Collapsible</Trans>,
        },
        {
          href: "/expo-ui/profile-edit",
          text: <Trans>プロフィール編集</Trans>,
          description: <Trans>FieldGroup / TextInput / Checkbox / Button / BottomSheet</Trans>,
        },
      ],
    },
  ] as const satisfies ListSection[];

  return (
    <>
      <Stack.Screen.Title>{t`Expo UI`}</Stack.Screen.Title>
      <GroupedList sections={sections} />
    </>
  );
}
