import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  TextInput,
} from "react-native";
import { Trans, Plural } from "@lingui/react/macro";
import { plural } from "@lingui/core/macro";
import { useThemeContext } from "../../theme/ThemeContext";

export default function PluralExamples() {
  const { theme } = useThemeContext();

  // アイテムカウンター
  const [itemCount, setItemCount] = useState(0);

  // ファイル選択シミュレーション
  const [fileCount, setFileCount] = useState(0);

  // 通知カウンター
  const [notificationCount, setNotificationCount] = useState(0);

  // 友達カウンター（名前付き）
  const [friendCount, setFriendCount] = useState(0);
  const userName = "太郎";

  // タスクカウンター（文字列プロパティ用）
  const [taskCount, setTaskCount] = useState(3);
  const placeholderText = plural(taskCount, {
    0: "タスクはありません。新しいタスクを追加してください",
    one: "あと1つのタスクがあります",
    other: "あと#個のタスクがあります",
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    section: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 12,
    },
    example: {
      marginVertical: 8,
    },
    label: {
      fontSize: 14,
      color: theme.colors.text,
      marginBottom: 4,
    },
    result: {
      fontSize: 16,
      color: theme.colors.text,
      marginVertical: 8,
      padding: 12,
      backgroundColor: theme.colors.card,
      borderRadius: 8,
    },
    controls: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    button: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: theme.colors.primary,
      borderRadius: 6,
    },
    buttonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "600",
    },
    counter: {
      fontSize: 18,
      color: theme.colors.text,
      minWidth: 40,
      textAlign: "center",
    },
    description: {
      fontSize: 12,
      color: theme.colors.text,
      marginTop: 4,
      fontStyle: "italic",
    },
    input: {
      height: 44,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 8,
      paddingHorizontal: 12,
      marginVertical: 8,
      backgroundColor: theme.colors.card,
      color: theme.colors.text,
    },
  });

  return (
    <ScrollView style={styles.container}>
      {/* 基本的なPluralコンポーネントの使用例 */}
      <View style={styles.section}>
        <Text style={styles.title}>
          <Trans>基本的なアイテムカウンター</Trans>
        </Text>
        <View style={styles.example}>
          <Text style={styles.label}>
            <Trans>Pluralコンポーネントの基本使用例</Trans>
          </Text>
          <View style={styles.controls}>
            <Pressable
              style={styles.button}
              onPress={() => setItemCount(Math.max(0, itemCount - 1))}
            >
              <Text style={styles.buttonText}>-</Text>
            </Pressable>
            <Text style={styles.counter}>{itemCount}</Text>
            <Pressable
              style={styles.button}
              onPress={() => setItemCount(itemCount + 1)}
            >
              <Text style={styles.buttonText}>+</Text>
            </Pressable>
          </View>
          <Text style={styles.result}>
            <Plural
              value={itemCount}
              one="1件のアイテム"
              other="#件のアイテム"
            />
          </Text>
          <Text style={styles.description}>
            <Trans>one、otherの形式を使用（日本語はotherのみ）</Trans>
          </Text>
        </View>
      </View>

      {/* ファイル選択の例 */}
      <View style={styles.section}>
        <Text style={styles.title}>
          <Trans>ファイル選択</Trans>
        </Text>
        <View style={styles.example}>
          <Text style={styles.label}>
            <Trans>選択されたファイル数の表示</Trans>
          </Text>
          <View style={styles.controls}>
            <Pressable style={styles.button} onPress={() => setFileCount(0)}>
              <Text style={styles.buttonText}>
                <Trans>クリア</Trans>
              </Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() => setFileCount(fileCount + 1)}
            >
              <Text style={styles.buttonText}>
                <Trans>ファイルを追加</Trans>
              </Text>
            </Pressable>
          </View>
          <Text style={styles.result}>
            <Plural
              value={fileCount}
              _0="ファイルが選択されていません"
              one="1つのファイルが選択されています"
              other="#個のファイルが選択されています"
            />
          </Text>
          <Text style={styles.description}>
            <Trans>実際のファイル選択UIでの使用例</Trans>
          </Text>
        </View>
      </View>

      {/* 通知バッジの例（正確な値のマッチング） */}
      <View style={styles.section}>
        <Text style={styles.title}>
          <Trans>通知メッセージ</Trans>
        </Text>
        <View style={styles.example}>
          <Text style={styles.label}>
            <Trans>正確な値のマッチング（_0）を使用</Trans>
          </Text>
          <View style={styles.controls}>
            <Pressable
              style={styles.button}
              onPress={() => setNotificationCount(0)}
            >
              <Text style={styles.buttonText}>
                <Trans>既読</Trans>
              </Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() => setNotificationCount(notificationCount + 1)}
            >
              <Text style={styles.buttonText}>
                <Trans>新着</Trans>
              </Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() => setNotificationCount(99)}
            >
              <Text style={styles.buttonText}>99</Text>
            </Pressable>
          </View>
          <Text style={styles.result}>
            <Plural
              value={notificationCount}
              _0="新しい通知はありません"
              one="1件の新着通知"
              other="#件の新着通知"
            />
          </Text>
          <Text style={styles.description}>
            <Trans>_0で値が0の場合の特別処理</Trans>
          </Text>
        </View>
      </View>

      {/* 文字列プロパティでの複数形処理（pluralマクロ使用） */}
      <View style={styles.section}>
        <Text style={styles.title}>
          <Trans>タスク入力フィールド</Trans>
        </Text>
        <View style={styles.example}>
          <Text style={styles.label}>
            <Trans>pluralマクロで文字列プロパティに対応</Trans>
          </Text>
          <View style={styles.controls}>
            <Pressable
              style={styles.button}
              onPress={() => setTaskCount(Math.max(0, taskCount - 1))}
            >
              <Text style={styles.buttonText}>-</Text>
            </Pressable>
            <Text style={styles.counter}>{taskCount}</Text>
            <Pressable
              style={styles.button}
              onPress={() => setTaskCount(taskCount + 1)}
            >
              <Text style={styles.buttonText}>+</Text>
            </Pressable>
          </View>
          <TextInput
            style={styles.input}
            placeholder={placeholderText}
            placeholderTextColor={theme.colors.text + "80"}
            editable={false}
          />
          <Text style={styles.description}>
            <Trans>
              TextInputのplaceholderは文字列のみ受け付けるため、pluralマクロを使用
            </Trans>
          </Text>
          <Text style={[styles.description, { marginTop: 8 }]}>
            <Trans>
              注: pluralマクロでは数値リテラル（0,
              1など）で正確な値のマッチングが可能
            </Trans>
          </Text>
        </View>
      </View>

      {/* 名前付きの複数形処理 */}
      <View style={styles.section}>
        <Text style={styles.title}>
          <Trans>友達の数（名前付き）</Trans>
        </Text>
        <View style={styles.example}>
          <Text style={styles.label}>
            <Trans>変数を含む複数形処理</Trans>
          </Text>
          <View style={styles.controls}>
            <Pressable
              style={styles.button}
              onPress={() => setFriendCount(Math.max(0, friendCount - 1))}
            >
              <Text style={styles.buttonText}>-</Text>
            </Pressable>
            <Text style={styles.counter}>{friendCount}</Text>
            <Pressable
              style={styles.button}
              onPress={() => setFriendCount(friendCount + 1)}
            >
              <Text style={styles.buttonText}>+</Text>
            </Pressable>
          </View>
          <Text style={styles.result}>
            <Trans>
              {userName}さんには
              <Plural
                value={friendCount}
                _0="友達がいません"
                one="友達が1人います"
                other="友達が#人います"
              />
            </Trans>
          </Text>
          <Text style={styles.description}>
            <Trans>TransコンポーネントとPluralコンポーネントの組み合わせ</Trans>
          </Text>
        </View>
      </View>

      {/* 説明セクション */}
      <View style={styles.section}>
        <Text style={styles.title}>
          <Trans>学習ポイント</Trans>
        </Text>
        <View style={{ marginTop: 8 }}>
          <Text style={[styles.label, { marginBottom: 8 }]}>
            <Trans>Pluralコンポーネント vs pluralマクロ</Trans>
          </Text>
          <Text style={[styles.description, { marginBottom: 8 }]}>
            •{" "}
            <Trans>
              Pluralコンポーネント: JSX要素を返す（React要素内で使用）
            </Trans>
          </Text>
          <Text style={[styles.description, { marginBottom: 8 }]}>
            •{" "}
            <Trans>pluralマクロ: 文字列を返す（文字列プロパティで使用）</Trans>
          </Text>
          <Text style={[styles.description, { marginBottom: 8 }]}>
            • <Trans>両方ともCLDR Pluralルールに基づく処理</Trans>
          </Text>
          <Text style={[styles.description, { marginBottom: 8 }]}>
            • <Trans>_0、_1など正確な値のマッチングが可能</Trans>
          </Text>
          <Text style={[styles.description, { marginBottom: 16 }]}>
            • <Trans>#記号: カウント数値を表示する場所</Trans>
          </Text>

          <Text style={[styles.label, { marginBottom: 8 }]}>
            <Trans>CLDRルールによる言語の違い</Trans>
          </Text>
          <Text style={[styles.description, { marginBottom: 8 }]}>
            • <Trans>日本語: otherのみ（すべての数で同じ形式）</Trans>
          </Text>
          <Text style={[styles.description, { marginBottom: 8 }]}>
            • <Trans>英語: one（1の場合）とother（0, 2以上）</Trans>
          </Text>
          <Text style={styles.description}>
            • <Trans>注: zeroカテゴリーは限られた言語のみ</Trans>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
