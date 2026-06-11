import { Collapsible, Host, Icon, List, ListItem, Picker, Slider, Switch, Text } from "@expo/ui";
import { Stack } from "expo-router";
import { useLingui } from "@lingui/react/macro";
import { type ReactElement, useState } from "react";
import { StyleSheet } from "react-native";
import { useTheme } from "../../../../../theme/useTheme";
import { useThemeMode } from "../../../../../theme/useThemeMode";

// Universal Icon は iOS が SF Symbols、Android が XML vector drawable
// (@expo/material-symbols)。Icon.select は babel-preset-expo がプラットフォーム別に
// 不要な側を取り除けるよう import() のまま書く。
const NOTIFICATIONS_ICON = Icon.select({
  ios: "bell",
  android: import("@expo/material-symbols/notifications.xml"),
});
const THEME_ICON = Icon.select({
  ios: "paintpalette",
  android: import("@expo/material-symbols/palette.xml"),
});
const TEXT_SIZE_ICON = Icon.select({
  ios: "textformat.size",
  android: import("@expo/material-symbols/format_size.xml"),
});
const CACHE_ICON = Icon.select({
  ios: "trash",
  android: import("@expo/material-symbols/delete.xml"),
});

// OS 標準の destructive 表現 (iOS systemRed 相当)。tokens に該当色がないため直書き
const DESTRUCTIVE_COLOR = "#FF3B30";

const THEME_MODES = ["system", "light", "dark"] as const;
type ThemeModeValue = (typeof THEME_MODES)[number];

const isThemeMode = (value: string | number): value is ThemeModeValue =>
  THEME_MODES.some((mode) => mode === value);

export default function ExpoUiSettingsScreen(): ReactElement {
  const { t } = useLingui();
  const { colorScheme } = useTheme();
  const { mode, setMode } = useThemeMode();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [textSize, setTextSize] = useState(16);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [cacheCleared, setCacheCleared] = useState(false);

  const themeModeLabels: Record<ThemeModeValue, string> = {
    system: t`システムに従う`,
    light: t`ライト`,
    dark: t`ダーク`,
  };

  return (
    <>
      <Stack.Screen.Title>{t`設定 (Universal)`}</Stack.Screen.Title>
      {/*
        Universal の List は自前のスクロールを持つため ScreenScrollView は使わず、
        Host に flex: 1 を与えて画面全体をネイティブ (SwiftUI / Jetpack Compose) 描画にする。
        Universal コンポーネントはネイティブ標準の配色で描画されアプリの tokens とは
        一致しないため、colorScheme だけアプリのテーマ設定に同期させる。
      */}
      <Host style={styles.host} colorScheme={colorScheme}>
        <List>
          <ListItem
            leading={<Icon name={NOTIFICATIONS_ICON} size={24} />}
            trailing={
              // headline の Text と重複表示になるため Switch 側の label は付けない
              <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
            }
            supportingText={t`新着があったときに通知します`}
          >
            <Text>{t`通知`}</Text>
          </ListItem>

          <ListItem
            leading={<Icon name={THEME_ICON} size={24} />}
            trailing={
              <Picker
                selectedValue={mode}
                onValueChange={(value) => {
                  if (isThemeMode(value)) {
                    setMode(value);
                  }
                }}
                appearance="menu"
              >
                {THEME_MODES.map((value) => (
                  <Picker.Item key={value} label={themeModeLabels[value]} value={value} />
                ))}
              </Picker>
            }
            supportingText={t`アプリ全体のテーマ設定と連動します`}
          >
            <Text>{t`テーマ`}</Text>
          </ListItem>

          <ListItem
            leading={<Icon name={TEXT_SIZE_ICON} size={24} />}
            supportingText={
              <Slider
                value={textSize}
                min={12}
                max={24}
                step={1}
                onValueChange={(value) => setTextSize(Math.round(value))}
              />
            }
          >
            <Text>{t`文字サイズ: ${textSize}pt`}</Text>
          </ListItem>

          <Collapsible isOpen={advancedOpen} onOpenChange={setAdvancedOpen} label={t`詳細設定`}>
            <ListItem
              trailing={<Switch value={analyticsEnabled} onValueChange={setAnalyticsEnabled} />}
            >
              <Text>{t`利用状況データを送信`}</Text>
            </ListItem>
            <ListItem
              leading={<Icon name={CACHE_ICON} size={24} color={DESTRUCTIVE_COLOR} />}
              onPress={() => setCacheCleared(true)}
              supportingText={cacheCleared ? t`削除しました` : t`128 MB 使用中`}
            >
              <Text textStyle={{ color: DESTRUCTIVE_COLOR }}>{t`キャッシュを削除`}</Text>
            </ListItem>
          </Collapsible>
        </List>
      </Host>
    </>
  );
}

const styles = StyleSheet.create({
  host: {
    flex: 1,
  },
});
