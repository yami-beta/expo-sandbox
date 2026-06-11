import {
  BottomSheet,
  Button,
  Checkbox,
  Column,
  FieldGroup,
  Host,
  Icon,
  Row,
  ScrollView,
  Spacer,
  Text,
  TextInput,
  useNativeState,
} from "@expo/ui";
import { Stack } from "expo-router";
import { useLingui } from "@lingui/react/macro";
import { type ReactElement, useState } from "react";
import { StyleSheet } from "react-native";
import { useTheme } from "../../../../../theme/useTheme";

const AVATAR_ICON = Icon.select({
  ios: "person.crop.circle",
  android: import("@expo/material-symbols/person.xml"),
});

// アバタープリセットのデモ用カラー (装飾なので tokens は使わない)
const AVATAR_PRESET_COLORS: readonly string[] = [
  "#FF6B6B",
  "#FFB347",
  "#FFD93D",
  "#6BCB77",
  "#4D96FF",
  "#9D4EDD",
  "#FF8FAB",
  "#5AC8FA",
] as const;

export default function ProfileEditScreen(): ReactElement {
  const { t } = useLingui();
  const { colorScheme, tokens } = useTheme();

  // Universal TextInput は ObservableState で値を保持する。
  // RN の useState 制御と違い、入力のたびに React の再レンダーは走らず、
  // 必要になったタイミング (保存時など) に .value で読み出す。
  const displayName = useNativeState("yami-beta");
  const bio = useNativeState("");

  const [agreed, setAgreed] = useState(false);
  const [avatarSheetOpen, setAvatarSheetOpen] = useState(false);
  const [avatarColor, setAvatarColor] = useState<string | undefined>(undefined);
  const [statusText, setStatusText] = useState("");

  const handleSave = () => {
    setStatusText(t`保存しました: ${displayName.value}`);
  };

  return (
    <>
      <Stack.Screen.Title>{t`プロフィール編集 (Universal)`}</Stack.Screen.Title>
      {/*
        FieldGroup は iOS で SwiftUI の Form (それ自体がスクロールコンテナ) になるため、
        ScrollView の中に入れると高さが確定せず描画されない。SwiftUI の Form 画面と
        同じく FieldGroup を画面ルートに置き、行はすべて Section として構成する。
      */}
      <Host style={styles.host} colorScheme={colorScheme}>
        <FieldGroup>
          <FieldGroup.Section>
            <Row alignment="center" spacing={tokens.spacing.lg}>
              <Icon name={AVATAR_ICON} size={56} {...(avatarColor ? { color: avatarColor } : {})} />
              <Text textStyle={{ fontSize: 18, fontWeight: "600" }}>{t`アバター`}</Text>
              {/* Spacer (flexible) で「変更」ボタンを行の末尾へ押し出す */}
              <Spacer flexible />
              <Button variant="text" label={t`変更`} onPress={() => setAvatarSheetOpen(true)} />
            </Row>
          </FieldGroup.Section>

          <FieldGroup.Section title={t`公開プロフィール`}>
            <TextInput
              value={displayName}
              placeholder={t`表示名`}
              maxLength={30}
              autoCapitalize="none"
            />
            <TextInput value={bio} placeholder={t`自己紹介`} multiline={true} numberOfLines={3} />
          </FieldGroup.Section>

          <FieldGroup.Section>
            <Checkbox
              value={agreed}
              onValueChange={setAgreed}
              label={t`プロフィールの公開に同意する`}
            />
            <FieldGroup.SectionFooter>
              <Text textStyle={{ fontSize: 12 }}>
                {t`同意すると他のユーザーからプロフィールが見えるようになります`}
              </Text>
            </FieldGroup.SectionFooter>
          </FieldGroup.Section>

          <FieldGroup.Section>
            <Button label={t`保存`} onPress={handleSave} disabled={!agreed} />
            {/*
              FieldGroup ツリー内の条件分岐 (cond ? null : <X>) は、Android では
              null 側でも空セクションとして描画されてしまうため、Text は常に描画して
              文言だけ切り替える。
            */}
            <Text textStyle={{ fontSize: 12 }}>
              {statusText === "" ? t`まだ保存されていません` : statusText}
            </Text>
          </FieldGroup.Section>
        </FieldGroup>
      </Host>

      {/*
        Universal 版 BottomSheet。Drop-in 版 (ref + present()) と違い
        isPresented / onDismiss の宣言的 API で開閉する。
        snapPoints を省略するとコンテンツ高さに自動フィットする。
        自前の Host を内包するため、画面の Host の外 (兄弟) に置く。
        Host 内に置くと Android では Form 内に空行として描画されてしまう。
      */}
      <BottomSheet isPresented={avatarSheetOpen} onDismiss={() => setAvatarSheetOpen(false)}>
        <Column spacing={tokens.spacing.lg} style={{ padding: tokens.spacing.xl }}>
          <Text textStyle={{ fontSize: 18, fontWeight: "600" }}>{t`アバターの色を選択`}</Text>
          {/* 横方向の Universal ScrollView。高さを明示してプリセットを横スクロールさせる */}
          <ScrollView direction="horizontal" showsIndicators={false} style={styles.presetRow}>
            <Row alignment="center" spacing={tokens.spacing.md}>
              {/*
                Icon の onPress は clickable modifier が付くだけでボタンのロールが
                スクリーンリーダーに伝わらないため、Button で囲んでセマンティクスを持たせる。
                選択してもシートはここでは閉じない: Android では isPresented を false に
                してもシートが閉じない問題があるため (@expo/ui 56.0.17 で確認)、
                クローズはスワイプ / scrim タップなどネイティブ操作に任せる。
              */}
              {AVATAR_PRESET_COLORS.map((color) => (
                <Button key={color} variant="text" onPress={() => setAvatarColor(color)}>
                  <Icon name={AVATAR_ICON} size={48} color={color} />
                </Button>
              ))}
            </Row>
          </ScrollView>
          <Row alignment="center" spacing={tokens.spacing.md}>
            <Button variant="text" label={t`リセット`} onPress={() => setAvatarColor(undefined)} />
          </Row>
        </Column>
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  host: {
    flex: 1,
  },
  presetRow: {
    height: 56,
  },
});
