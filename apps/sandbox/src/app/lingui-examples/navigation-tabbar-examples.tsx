import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Switch,
} from "react-native";
import { useState } from "react";
import { useThemeContext } from "../../theme/ThemeContext";
import { Trans, Plural, useLingui } from "@lingui/react/macro";
import { plural } from "@lingui/core/macro";
import type { Theme } from "@react-navigation/native";

// バッジコンポーネント
const Badge = ({
  count,
  type,
  theme,
}: {
  count: number;
  type: "numeric" | "text" | "dot";
  theme: Theme;
}) => {
  if (type === "dot" && count > 0) {
    return (
      <View
        style={[
          styles.dotBadge,
          { backgroundColor: theme.colors.notification },
        ]}
      />
    );
  }

  if (type === "text" && count > 0) {
    return (
      <View
        style={[
          styles.textBadge,
          { backgroundColor: theme.colors.notification },
        ]}
      >
        <Text style={styles.badgeText}>
          <Trans>新着</Trans>
        </Text>
      </View>
    );
  }

  if (type === "numeric" && count > 0) {
    const displayCount = count > 99 ? "99+" : count.toString();
    return (
      <View
        style={[
          styles.numericBadge,
          { backgroundColor: theme.colors.notification },
        ]}
      >
        <Text style={styles.badgeText}>{displayCount}</Text>
      </View>
    );
  }

  return null;
};

// タブアイテムコンポーネント
const TabItem = ({
  label,
  count,
  badgeType,
  showNumericBadge,
  theme,
  getTabLabel,
}: {
  label: string;
  count: number;
  badgeType: "numeric" | "text" | "dot" | null;
  showNumericBadge: boolean;
  theme: Theme;
  getTabLabel: (tabName: string, count: number) => string;
}) => {
  const dynamicLabel = getTabLabel(label, showNumericBadge ? count : 0);

  return (
    <View style={[styles.tabItem, { backgroundColor: theme.colors.card }]}>
      <View style={styles.tabContent}>
        <Text style={[styles.tabLabel, { color: theme.colors.text }]}>
          {dynamicLabel}
        </Text>
        {badgeType && <Badge count={count} type={badgeType} theme={theme} />}
      </View>
    </View>
  );
};

export default function NavigationTabbarExamples() {
  const { theme } = useThemeContext();
  const { t } = useLingui();

  // 通知カウント状態
  const [homeNotifications, setHomeNotifications] = useState(0);
  const [settingsNotifications, setSettingsNotifications] = useState(3);
  const [profileNotifications, setProfileNotifications] = useState(99);

  // バッジタイプの状態
  const [showNumericBadge, setShowNumericBadge] = useState(true);
  const [showTextBadge, setShowTextBadge] = useState(false);
  const [showDot, setShowDot] = useState(false);

  // タブラベルの動的生成
  const getTabLabel = (tabName: string, count: number) => {
    if (count === 0) return tabName;

    if (tabName === t`ホーム`) {
      return count > 99
        ? t`ホーム (99+)`
        : t`ホーム (${plural(count, {
            one: "# 件",
            other: "# 件",
          })})`;
    } else if (tabName === t`設定`) {
      return count > 99
        ? t`設定 (99+)`
        : t`設定 (${plural(count, {
            one: "# 件",
            other: "# 件",
          })})`;
    } else if (tabName === t`プロフィール`) {
      return count > 99
        ? t`プロフィール (99+)`
        : t`プロフィール (${plural(count, {
            one: "# 件",
            other: "# 件",
          })})`;
    }
    return tabName;
  };

  const resetAllNotifications = () => {
    setHomeNotifications(0);
    setSettingsNotifications(0);
    setProfileNotifications(0);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>
        <Trans>タブバーの動的機能</Trans>
      </Text>

      <Text style={[styles.subtitle, { color: theme.colors.text }]}>
        <Trans>通知カウントの管理</Trans>
      </Text>

      <View style={styles.section}>
        <View style={styles.counterRow}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            <Trans>ホームタブの通知:</Trans> {homeNotifications}
          </Text>
          <View style={styles.buttonGroup}>
            <Pressable
              style={[
                styles.smallButton,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={() => setHomeNotifications((prev) => prev + 1)}
            >
              <Text style={styles.buttonText}>+</Text>
            </Pressable>
            <Pressable
              style={[
                styles.smallButton,
                { backgroundColor: theme.colors.border },
              ]}
              onPress={() =>
                setHomeNotifications((prev) => Math.max(0, prev - 1))
              }
            >
              <Text style={styles.buttonText}>-</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.counterRow}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            <Trans>設定タブの通知:</Trans> {settingsNotifications}
          </Text>
          <View style={styles.buttonGroup}>
            <Pressable
              style={[
                styles.smallButton,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={() => setSettingsNotifications((prev) => prev + 1)}
            >
              <Text style={styles.buttonText}>+</Text>
            </Pressable>
            <Pressable
              style={[
                styles.smallButton,
                { backgroundColor: theme.colors.border },
              ]}
              onPress={() =>
                setSettingsNotifications((prev) => Math.max(0, prev - 1))
              }
            >
              <Text style={styles.buttonText}>-</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.counterRow}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            <Trans>プロフィールタブの通知:</Trans> {profileNotifications}
          </Text>
          <View style={styles.buttonGroup}>
            <Pressable
              style={[
                styles.smallButton,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={() => setProfileNotifications((prev) => prev + 1)}
            >
              <Text style={styles.buttonText}>+</Text>
            </Pressable>
            <Pressable
              style={[
                styles.smallButton,
                { backgroundColor: theme.colors.border },
              ]}
              onPress={() =>
                setProfileNotifications((prev) => Math.max(0, prev - 1))
              }
            >
              <Text style={styles.buttonText}>-</Text>
            </Pressable>
          </View>
        </View>

        <Pressable
          style={[
            styles.resetButton,
            { backgroundColor: theme.colors.notification },
          ]}
          onPress={resetAllNotifications}
        >
          <Text style={styles.buttonText}>
            <Trans>すべてリセット</Trans>
          </Text>
        </Pressable>
      </View>

      <Text style={[styles.subtitle, { color: theme.colors.text }]}>
        <Trans>バッジ表示オプション</Trans>
      </Text>

      <View style={styles.section}>
        <View style={styles.switchRow}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            <Trans>数値バッジを表示</Trans>
          </Text>
          <Switch
            value={showNumericBadge}
            onValueChange={setShowNumericBadge}
            trackColor={{
              false: theme.colors.border,
              true: theme.colors.primary,
            }}
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            <Trans>テキストバッジを表示</Trans>
          </Text>
          <Switch
            value={showTextBadge}
            onValueChange={setShowTextBadge}
            trackColor={{
              false: theme.colors.border,
              true: theme.colors.primary,
            }}
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            <Trans>ドットバッジを表示</Trans>
          </Text>
          <Switch
            value={showDot}
            onValueChange={setShowDot}
            trackColor={{
              false: theme.colors.border,
              true: theme.colors.primary,
            }}
          />
        </View>
      </View>

      <Text style={[styles.subtitle, { color: theme.colors.text }]}>
        <Trans>タブバーのプレビュー</Trans>
      </Text>

      <View style={[styles.tabBar, { backgroundColor: theme.colors.card }]}>
        <TabItem
          label={t`ホーム`}
          count={homeNotifications}
          badgeType={showTextBadge ? "text" : showDot ? "dot" : null}
          showNumericBadge={showNumericBadge}
          theme={theme}
          getTabLabel={getTabLabel}
        />
        <TabItem
          label={t`設定`}
          count={settingsNotifications}
          badgeType={showTextBadge ? "text" : showDot ? "dot" : null}
          showNumericBadge={showNumericBadge}
          theme={theme}
          getTabLabel={getTabLabel}
        />
        <TabItem
          label={t`プロフィール`}
          count={profileNotifications}
          badgeType={showTextBadge ? "text" : showDot ? "dot" : null}
          showNumericBadge={showNumericBadge}
          theme={theme}
          getTabLabel={getTabLabel}
        />
      </View>

      <View style={[styles.infoBox, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.infoTitle, { color: theme.colors.text }]}>
          <Trans>実装のポイント</Trans>
        </Text>
        <Text style={[styles.infoText, { color: theme.colors.text }]}>
          <Trans>• Pluralマクロで通知数の適切な表示</Trans>
        </Text>
        <Text style={[styles.infoText, { color: theme.colors.text }]}>
          <Trans>• 99件を超える場合は「99+」と表示</Trans>
        </Text>
        <Text style={[styles.infoText, { color: theme.colors.text }]}>
          <Trans>• バッジタイプ（数値/テキスト/ドット）の切り替え</Trans>
        </Text>
        <Text style={[styles.infoText, { color: theme.colors.text }]}>
          <Trans>• 動的なタブラベルの更新</Trans>
        </Text>
      </View>

      <View style={[styles.exampleBox, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.exampleTitle, { color: theme.colors.text }]}>
          <Trans>実際の使用例</Trans>
        </Text>
        <Text style={[styles.exampleText, { color: theme.colors.text }]}>
          <Plural
            value={homeNotifications}
            _0={<Trans>ホームタブに新着通知はありません</Trans>}
            one={<Trans>ホームタブに # 件の新着通知</Trans>}
            other={<Trans>ホームタブに # 件の新着通知</Trans>}
          />
        </Text>
        <Text style={[styles.exampleText, { color: theme.colors.text }]}>
          <Plural
            value={settingsNotifications}
            _0={<Trans>設定タブに未読メッセージはありません</Trans>}
            one={<Trans>設定タブに # 件の未読メッセージ</Trans>}
            other={<Trans>設定タブに # 件の未読メッセージ</Trans>}
          />
        </Text>
        <Text style={[styles.exampleText, { color: theme.colors.text }]}>
          <Plural
            value={profileNotifications}
            _0={<Trans>プロフィールタブに更新はありません</Trans>}
            one={<Trans>プロフィールタブに # 件の更新</Trans>}
            other={<Trans>プロフィールタブに # 件の更新</Trans>}
          />
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },
  section: {
    marginBottom: 20,
  },
  counterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    flex: 1,
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 10,
  },
  smallButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  resetButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  tabBar: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 10,
    marginTop: 10,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 5,
  },
  tabContent: {
    alignItems: "center",
    position: "relative",
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  numericBadge: {
    position: "absolute",
    top: -8,
    right: -12,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  textBadge: {
    position: "absolute",
    top: -8,
    right: -16,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  dotBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  infoBox: {
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 5,
  },
  exampleBox: {
    padding: 15,
    borderRadius: 12,
    marginTop: 15,
  },
  exampleTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  exampleText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 5,
  },
});
