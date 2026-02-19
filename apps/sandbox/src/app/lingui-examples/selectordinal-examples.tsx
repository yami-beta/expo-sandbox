import { useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet, TextInput } from "react-native";
import { Trans, SelectOrdinal } from "@lingui/react/macro";
import { selectOrdinal } from "@lingui/core/macro";
import { useThemeContext } from "../../theme/ThemeContext";

export default function SelectOrdinalExamples() {
  const { theme } = useThemeContext();

  // ランキング表示
  const [rank, setRank] = useState(1);

  // 進捗ステップ
  const [step, setStep] = useState(1);

  // 階層レベル
  const [level, setLevel] = useState(1);

  // 順位表示
  const [position, setPosition] = useState(1);

  // 文字列プロパティ用（selectOrdinalマクロ）
  const [floor, setFloor] = useState(1);
  const floorPlaceholder = selectOrdinal(floor, {
    one: "第#階に移動",
    two: "第#階に移動",
    few: "第#階に移動",
    other: "第#階に移動",
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
    comparisonBox: {
      flexDirection: "row",
      gap: 12,
      marginTop: 8,
    },
    comparisonItem: {
      flex: 1,
      padding: 12,
      backgroundColor: theme.colors.card,
      borderRadius: 8,
    },
    comparisonLabel: {
      fontSize: 12,
      color: theme.colors.text,
      marginBottom: 4,
      fontWeight: "600",
    },
    comparisonText: {
      fontSize: 14,
      color: theme.colors.text,
    },
  });

  return (
    <ScrollView style={styles.container}>
      {/* ランキング表示の例 */}
      <View style={styles.section}>
        <Text style={styles.title}>
          <Trans>ランキング表示</Trans>
        </Text>
        <View style={styles.example}>
          <Text style={styles.label}>
            <Trans>競技や成績での順位表示</Trans>
          </Text>
          <View style={styles.controls}>
            <Pressable style={styles.button} onPress={() => setRank(Math.max(1, rank - 1))}>
              <Text style={styles.buttonText}>-</Text>
            </Pressable>
            <Text style={styles.counter}>{rank}</Text>
            <Pressable style={styles.button} onPress={() => setRank(rank + 1)}>
              <Text style={styles.buttonText}>+</Text>
            </Pressable>
          </View>
          <Text style={styles.result}>
            <Trans>
              おめでとうございます！あなたは
              <SelectOrdinal value={rank} one="第#位" two="第#位" few="第#位" other="第#位" />
              です
            </Trans>
          </Text>
          <Text style={styles.description}>
            <Trans>
              英語では1st, 2nd, 3rd, 4th...と序数が変化しますが、日本語では「第〜位」で統一されます
            </Trans>
          </Text>
        </View>
      </View>

      {/* 進捗ステップの例 */}
      <View style={styles.section}>
        <Text style={styles.title}>
          <Trans>進捗ステップ</Trans>
        </Text>
        <View style={styles.example}>
          <Text style={styles.label}>
            <Trans>プロセスや手順の段階表示</Trans>
          </Text>
          <View style={styles.controls}>
            <Pressable style={styles.button} onPress={() => setStep(Math.max(1, step - 1))}>
              <Text style={styles.buttonText}>
                <Trans>前へ</Trans>
              </Text>
            </Pressable>
            <Text style={styles.counter}>{step}</Text>
            <Pressable style={styles.button} onPress={() => setStep(Math.min(10, step + 1))}>
              <Text style={styles.buttonText}>
                <Trans>次へ</Trans>
              </Text>
            </Pressable>
          </View>
          <Text style={styles.result}>
            <SelectOrdinal
              value={step}
              one="第#段階: 準備"
              two="第#段階: 実行"
              few="第#段階: 確認"
              other="第#段階: 完了確認"
            />
          </Text>
          <Text style={styles.result}>
            <Trans>
              現在、
              <SelectOrdinal
                value={step}
                one="第#ステップ"
                two="第#ステップ"
                few="第#ステップ"
                other="第#ステップ"
              />
              を処理中です
            </Trans>
          </Text>
          <Text style={styles.description}>
            <Trans>チュートリアルやウィザードでの段階表示に適しています</Trans>
          </Text>
        </View>
      </View>

      {/* 階層/レベルの例 */}
      <View style={styles.section}>
        <Text style={styles.title}>
          <Trans>階層・レベル表示</Trans>
        </Text>
        <View style={styles.example}>
          <Text style={styles.label}>
            <Trans>組織図やディレクトリ構造での階層表示</Trans>
          </Text>
          <View style={styles.controls}>
            <Pressable style={styles.button} onPress={() => setLevel(Math.max(1, level - 1))}>
              <Text style={styles.buttonText}>
                <Trans>上へ</Trans>
              </Text>
            </Pressable>
            <Text style={styles.counter}>{level}</Text>
            <Pressable style={styles.button} onPress={() => setLevel(level + 1)}>
              <Text style={styles.buttonText}>
                <Trans>下へ</Trans>
              </Text>
            </Pressable>
          </View>
          <Text style={styles.result}>
            <SelectOrdinal
              value={level}
              one="第#階層"
              two="第#階層"
              few="第#階層"
              other="第#階層"
            />
          </Text>
          <View style={styles.comparisonBox}>
            <View style={styles.comparisonItem}>
              <Text style={styles.comparisonLabel}>
                <Trans>フォルダ構造</Trans>
              </Text>
              <Text style={styles.comparisonText}>
                <SelectOrdinal
                  value={level}
                  one="第#階層のディレクトリ"
                  two="第#階層のディレクトリ"
                  few="第#階層のディレクトリ"
                  other="第#階層のディレクトリ"
                />
              </Text>
            </View>
            <View style={styles.comparisonItem}>
              <Text style={styles.comparisonLabel}>
                <Trans>権限レベル</Trans>
              </Text>
              <Text style={styles.comparisonText}>
                <SelectOrdinal
                  value={level}
                  one="レベル#"
                  two="レベル#"
                  few="レベル#"
                  other="レベル#"
                />
              </Text>
            </View>
          </View>
          <Text style={styles.description}>
            <Trans>ファイルシステムや組織構造の階層表現に使用できます</Trans>
          </Text>
        </View>
      </View>

      {/* 順位表示の例 */}
      <View style={styles.section}>
        <Text style={styles.title}>
          <Trans>順位・順番表示</Trans>
        </Text>
        <View style={styles.example}>
          <Text style={styles.label}>
            <Trans>リスト内での位置や順番</Trans>
          </Text>
          <View style={styles.controls}>
            <Pressable style={styles.button} onPress={() => setPosition(Math.max(1, position - 1))}>
              <Text style={styles.buttonText}>-</Text>
            </Pressable>
            <Text style={styles.counter}>{position}</Text>
            <Pressable style={styles.button} onPress={() => setPosition(position + 1)}>
              <Text style={styles.buttonText}>+</Text>
            </Pressable>
          </View>
          <Text style={styles.result}>
            <Trans>
              この項目は
              <SelectOrdinal value={position} one="#番目" two="#番目" few="#番目" other="#番目" />
              です
            </Trans>
          </Text>
          <Text style={styles.result}>
            <SelectOrdinal
              value={position}
              one="#番目の要素を選択中"
              two="#番目の要素を選択中"
              few="#番目の要素を選択中"
              other="#番目の要素を選択中"
            />
          </Text>
          <Text style={styles.description}>
            <Trans>リストやキューでの順番表示に適しています</Trans>
          </Text>
        </View>
      </View>

      {/* 文字列プロパティでの使用例 */}
      <View style={styles.section}>
        <Text style={styles.title}>
          <Trans>文字列プロパティでの使用（selectOrdinalマクロ）</Trans>
        </Text>
        <View style={styles.example}>
          <Text style={styles.label}>
            <Trans>TextInputのplaceholderなど文字列が必要な場合</Trans>
          </Text>
          <View style={styles.controls}>
            <Pressable style={styles.button} onPress={() => setFloor(Math.max(1, floor - 1))}>
              <Text style={styles.buttonText}>-</Text>
            </Pressable>
            <Text style={styles.counter}>{floor}</Text>
            <Pressable style={styles.button} onPress={() => setFloor(floor + 1)}>
              <Text style={styles.buttonText}>+</Text>
            </Pressable>
          </View>
          <TextInput
            style={styles.input}
            placeholder={floorPlaceholder}
            placeholderTextColor={theme.colors.text + "80"}
            editable={false}
          />
          <Text style={styles.result}>
            <Trans>
              エレベーターは
              <SelectOrdinal value={floor} one="第#階" two="第#階" few="第#階" other="第#階" />
              に到着しました
            </Trans>
          </Text>
          <Text style={styles.description}>
            <Trans>selectOrdinalマクロは文字列を返すため、文字列プロパティで使用できます</Trans>
          </Text>
        </View>
      </View>

      {/* SelectOrdinal vs Plural の比較 */}
      <View style={styles.section}>
        <Text style={styles.title}>
          <Trans>SelectOrdinal vs Plural の違い</Trans>
        </Text>
        <View style={styles.example}>
          <Text style={styles.label}>
            <Trans>同じ数値での表現の違い</Trans>
          </Text>
          <View style={styles.comparisonBox}>
            <View style={styles.comparisonItem}>
              <Text style={styles.comparisonLabel}>
                <Trans>SelectOrdinal（序数）</Trans>
              </Text>
              <Text style={[styles.comparisonText, { marginBottom: 8 }]}>
                <SelectOrdinal value={1} one="第#位" two="第#位" few="第#位" other="第#位" />
              </Text>
              <Text style={[styles.comparisonText, { marginBottom: 8 }]}>
                <SelectOrdinal value={2} one="第#位" two="第#位" few="第#位" other="第#位" />
              </Text>
              <Text style={styles.comparisonText}>
                <SelectOrdinal value={3} one="第#位" two="第#位" few="第#位" other="第#位" />
              </Text>
            </View>
            <View style={styles.comparisonItem}>
              <Text style={styles.comparisonLabel}>
                <Trans>Plural（基数）</Trans>
              </Text>
              <Text style={[styles.comparisonText, { marginBottom: 8 }]}>
                <Trans>1個のアイテム</Trans>
              </Text>
              <Text style={[styles.comparisonText, { marginBottom: 8 }]}>
                <Trans>2個のアイテム</Trans>
              </Text>
              <Text style={styles.comparisonText}>
                <Trans>3個のアイテム</Trans>
              </Text>
            </View>
          </View>
          <Text style={[styles.description, { marginTop: 12 }]}>
            <Trans>SelectOrdinal: 順序や順位を表現（1番目、2番目、1st, 2nd）</Trans>
          </Text>
          <Text style={styles.description}>
            <Trans>Plural: 数量を表現（1個、2個、one item, two items）</Trans>
          </Text>
        </View>
      </View>

      {/* 学習ポイント */}
      <View style={styles.section}>
        <Text style={styles.title}>
          <Trans>学習ポイント</Trans>
        </Text>
        <View style={{ marginTop: 8 }}>
          <Text style={[styles.label, { marginBottom: 8 }]}>
            <Trans>SelectOrdinalマクロの特徴</Trans>
          </Text>
          <Text style={[styles.description, { marginBottom: 8 }]}>
            • <Trans>序数（順序を表す数）の表現に特化したマクロです</Trans>
          </Text>
          <Text style={[styles.description, { marginBottom: 8 }]}>
            • <Trans>英語: one(1st), two(2nd), few(3rd), other(4th以降)で分類</Trans>
          </Text>
          <Text style={[styles.description, { marginBottom: 8 }]}>
            • <Trans>日本語: 通常すべてotherカテゴリー（第〜、〜番目で統一）</Trans>
          </Text>
          <Text style={[styles.description, { marginBottom: 16 }]}>
            • <Trans>#記号: 実際の数値を表示する場所を指定</Trans>
          </Text>

          <Text style={[styles.label, { marginBottom: 8 }]}>
            <Trans>SelectOrdinal vs selectOrdinal</Trans>
          </Text>
          <Text style={[styles.description, { marginBottom: 8 }]}>
            • <Trans>SelectOrdinalコンポーネント: JSX要素を返す（@lingui/react/macro）</Trans>
          </Text>
          <Text style={[styles.description, { marginBottom: 8 }]}>
            • <Trans>selectOrdinalマクロ: 文字列を返す（@lingui/core/macro）</Trans>
          </Text>
          <Text style={[styles.description, { marginBottom: 16 }]}>
            • <Trans>文字列プロパティにはselectOrdinalマクロを使用</Trans>
          </Text>

          <Text style={[styles.label, { marginBottom: 8 }]}>
            <Trans>使用例</Trans>
          </Text>
          <Text style={[styles.description, { marginBottom: 8 }]}>
            • <Trans>ランキング・順位表示（1位、2位、1st, 2nd）</Trans>
          </Text>
          <Text style={[styles.description, { marginBottom: 8 }]}>
            • <Trans>ステップ・段階表示（第1段階、第2段階、Step 1, Step 2）</Trans>
          </Text>
          <Text style={[styles.description, { marginBottom: 8 }]}>
            • <Trans>階層・レベル表示（第1階層、レベル2、1st level, 2nd level）</Trans>
          </Text>
          <Text style={styles.description}>
            • <Trans>順番・位置表示（1番目、2番目、#1, #2）</Trans>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
