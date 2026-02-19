import { useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet, TextInput } from "react-native";
import { Trans, Select } from "@lingui/react/macro";
import { select } from "@lingui/core/macro";
import { useThemeContext } from "../../theme/ThemeContext";

export default function SelectExamples() {
  const { theme } = useThemeContext();

  // 性別による代名詞
  const [gender, setGender] = useState<"male" | "female" | "other">("other");
  const userName = "田中";

  // 対象者（単数/複数）
  const [audience, setAudience] = useState<"singular" | "plural">("singular");

  // 所有格
  const [possessive, setPossessive] = useState<"my" | "your" | "his" | "her" | "their">("my");

  // 動作主体
  const [subject, setSubject] = useState<"i" | "you" | "he" | "she" | "they">("i");

  // アンチパターン例（技術的状態）
  const [userStatus, setUserStatus] = useState<"online" | "offline" | "away" | "busy">("online");

  // 所有格の例でselectマクロを使用（文字列プロパティ）
  const profilePlaceholder = select(possessive, {
    my: "私のプロフィールを入力",
    your: "あなたのプロフィールを入力",
    his: "彼のプロフィールを入力",
    her: "彼女のプロフィールを入力",
    their: "その人のプロフィールを入力",
    other: "プロフィールを入力",
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
      gap: 8,
      flexWrap: "wrap",
      marginVertical: 8,
    },
    button: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: theme.colors.primary,
      borderRadius: 6,
    },
    buttonSelected: {
      backgroundColor: theme.colors.primary + "CC",
    },
    buttonText: {
      color: "white",
      fontSize: 14,
      fontWeight: "600",
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
    warningBox: {
      backgroundColor: "#FFF3CD",
      padding: 12,
      borderRadius: 8,
      marginVertical: 8,
    },
    warningText: {
      color: "#856404",
      fontSize: 14,
    },
    goodBox: {
      backgroundColor: "#D4EDDA",
      padding: 12,
      borderRadius: 8,
      marginVertical: 8,
    },
    goodText: {
      color: "#155724",
      fontSize: 14,
    },
  });

  return (
    <ScrollView style={styles.container}>
      {/* 適切な使用例のヘッダー */}
      <View style={styles.section}>
        <Text style={styles.title}>
          <Trans>✅ 適切な使用例（文法的変化）</Trans>
        </Text>
        <Text style={styles.description}>
          <Trans>Selectマクロは自然言語の文法的変化を扱うために設計されています</Trans>
        </Text>
      </View>

      {/* 性別による代名詞の変化 */}
      <View style={styles.section}>
        <Text style={styles.title}>
          <Trans>性別による代名詞と動詞の変化</Trans>
        </Text>
        <View style={styles.example}>
          <Text style={styles.label}>
            <Trans>ユーザーの性別を選択</Trans>
          </Text>
          <View style={styles.controls}>
            <Pressable
              style={[styles.button, gender === "male" && styles.buttonSelected]}
              onPress={() => setGender("male")}
            >
              <Text style={styles.buttonText}>
                <Trans>男性</Trans>
              </Text>
            </Pressable>
            <Pressable
              style={[styles.button, gender === "female" && styles.buttonSelected]}
              onPress={() => setGender("female")}
            >
              <Text style={styles.buttonText}>
                <Trans>女性</Trans>
              </Text>
            </Pressable>
            <Pressable
              style={[styles.button, gender === "other" && styles.buttonSelected]}
              onPress={() => setGender("other")}
            >
              <Text style={styles.buttonText}>
                <Trans>その他</Trans>
              </Text>
            </Pressable>
          </View>
          <Text style={styles.result}>
            <Trans>
              {userName}さんが
              <Select
                value={gender}
                _male="彼のメッセージを送信しました"
                _female="彼女のメッセージを送信しました"
                other="メッセージを送信しました"
              />
            </Trans>
          </Text>
          <Text style={styles.result}>
            <Select
              value={gender}
              _male="彼はオンラインです"
              _female="彼女はオンラインです"
              other="オンラインです"
            />
          </Text>
          <Text style={styles.description}>
            <Trans>日本語では代名詞の省略が一般的ですが、英語では明確な違いがあります</Trans>
          </Text>
        </View>
      </View>

      {/* 対象者による表現 */}
      <View style={styles.section}>
        <Text style={styles.title}>
          <Trans>対象者による表現の変化</Trans>
        </Text>
        <View style={styles.example}>
          <Text style={styles.label}>
            <Trans>対象者を選択</Trans>
          </Text>
          <View style={styles.controls}>
            <Pressable
              style={[styles.button, audience === "singular" && styles.buttonSelected]}
              onPress={() => setAudience("singular")}
            >
              <Text style={styles.buttonText}>
                <Trans>個人</Trans>
              </Text>
            </Pressable>
            <Pressable
              style={[styles.button, audience === "plural" && styles.buttonSelected]}
              onPress={() => setAudience("plural")}
            >
              <Text style={styles.buttonText}>
                <Trans>複数</Trans>
              </Text>
            </Pressable>
          </View>
          <Text style={styles.result}>
            <Select
              value={audience}
              _singular="あなたへのお知らせ"
              _plural="皆様へのお知らせ"
              other="お知らせ"
            />
          </Text>
          <Text style={styles.result}>
            <Select
              value={audience}
              _singular="ご利用ありがとうございます"
              _plural="ご利用いただきありがとうございます"
              other="ありがとうございます"
            />
          </Text>
          <Text style={styles.description}>
            <Trans>単数/複数の対象者によって、日本語でも表現が変わります</Trans>
          </Text>
        </View>
      </View>

      {/* 所有格の表現 */}
      <View style={styles.section}>
        <Text style={styles.title}>
          <Trans>所有格の表現（selectマクロ使用）</Trans>
        </Text>
        <View style={styles.example}>
          <Text style={styles.label}>
            <Trans>所有者を選択</Trans>
          </Text>
          <View style={styles.controls}>
            <Pressable
              style={[styles.button, possessive === "my" && styles.buttonSelected]}
              onPress={() => setPossessive("my")}
            >
              <Text style={styles.buttonText}>
                <Trans>私の</Trans>
              </Text>
            </Pressable>
            <Pressable
              style={[styles.button, possessive === "your" && styles.buttonSelected]}
              onPress={() => setPossessive("your")}
            >
              <Text style={styles.buttonText}>
                <Trans>あなたの</Trans>
              </Text>
            </Pressable>
            <Pressable
              style={[styles.button, possessive === "his" && styles.buttonSelected]}
              onPress={() => setPossessive("his")}
            >
              <Text style={styles.buttonText}>
                <Trans>彼の</Trans>
              </Text>
            </Pressable>
            <Pressable
              style={[styles.button, possessive === "her" && styles.buttonSelected]}
              onPress={() => setPossessive("her")}
            >
              <Text style={styles.buttonText}>
                <Trans>彼女の</Trans>
              </Text>
            </Pressable>
            <Pressable
              style={[styles.button, possessive === "their" && styles.buttonSelected]}
              onPress={() => setPossessive("their")}
            >
              <Text style={styles.buttonText}>
                <Trans>その人の</Trans>
              </Text>
            </Pressable>
          </View>
          <TextInput
            style={styles.input}
            placeholder={profilePlaceholder}
            placeholderTextColor={theme.colors.text + "80"}
          />
          <Text style={styles.result}>
            <Select
              value={possessive}
              _my="私のプロフィール"
              _your="あなたのプロフィール"
              _his="彼のプロフィール"
              _her="彼女のプロフィール"
              _their="その人のプロフィール"
              other="プロフィール"
            />
          </Text>
          <Text style={styles.description}>
            <Trans>TextInputのplaceholderには文字列が必要なため、selectマクロを使用</Trans>
          </Text>
        </View>
      </View>

      {/* 動作主体による文章変化 */}
      <View style={styles.section}>
        <Text style={styles.title}>
          <Trans>動作主体による文章変化</Trans>
        </Text>
        <View style={styles.example}>
          <Text style={styles.label}>
            <Trans>主語を選択</Trans>
          </Text>
          <View style={styles.controls}>
            <Pressable
              style={[styles.button, subject === "i" && styles.buttonSelected]}
              onPress={() => setSubject("i")}
            >
              <Text style={styles.buttonText}>
                <Trans>私</Trans>
              </Text>
            </Pressable>
            <Pressable
              style={[styles.button, subject === "you" && styles.buttonSelected]}
              onPress={() => setSubject("you")}
            >
              <Text style={styles.buttonText}>
                <Trans>あなた</Trans>
              </Text>
            </Pressable>
            <Pressable
              style={[styles.button, subject === "he" && styles.buttonSelected]}
              onPress={() => setSubject("he")}
            >
              <Text style={styles.buttonText}>
                <Trans>彼</Trans>
              </Text>
            </Pressable>
            <Pressable
              style={[styles.button, subject === "she" && styles.buttonSelected]}
              onPress={() => setSubject("she")}
            >
              <Text style={styles.buttonText}>
                <Trans>彼女</Trans>
              </Text>
            </Pressable>
            <Pressable
              style={[styles.button, subject === "they" && styles.buttonSelected]}
              onPress={() => setSubject("they")}
            >
              <Text style={styles.buttonText}>
                <Trans>彼ら</Trans>
              </Text>
            </Pressable>
          </View>
          <Text style={styles.result}>
            <Select
              value={subject}
              _i="私がタスクを完了しました"
              _you="あなたがタスクを完了しました"
              _he="彼がタスクを完了しました"
              _she="彼女がタスクを完了しました"
              _they="彼らがタスクを完了しました"
              other="タスクを完了しました"
            />
          </Text>
          <Text style={styles.description}>
            <Trans>日本語では動詞の活用が少ないですが、英語では主語によって動詞が変化します</Trans>
          </Text>
        </View>
      </View>

      {/* アンチパターンの説明 */}
      <View style={styles.section}>
        <Text style={styles.title}>
          <Trans>❌ 不適切な使用例（アンチパターン）</Trans>
        </Text>
        <Text style={styles.description}>
          <Trans>以下は技術的な状態であり、Selectマクロの使用は不適切です</Trans>
        </Text>
      </View>

      {/* 技術的状態の例（悪い例） */}
      <View style={styles.section}>
        <Text style={styles.title}>
          <Trans>ユーザーステータス（誤った実装）</Trans>
        </Text>
        <View style={styles.example}>
          <Text style={styles.label}>
            <Trans>ステータスを選択</Trans>
          </Text>
          <View style={styles.controls}>
            <Pressable
              style={[styles.button, userStatus === "online" && styles.buttonSelected]}
              onPress={() => setUserStatus("online")}
            >
              <Text style={styles.buttonText}>
                <Trans>オンライン</Trans>
              </Text>
            </Pressable>
            <Pressable
              style={[styles.button, userStatus === "offline" && styles.buttonSelected]}
              onPress={() => setUserStatus("offline")}
            >
              <Text style={styles.buttonText}>
                <Trans>オフライン</Trans>
              </Text>
            </Pressable>
            <Pressable
              style={[styles.button, userStatus === "away" && styles.buttonSelected]}
              onPress={() => setUserStatus("away")}
            >
              <Text style={styles.buttonText}>
                <Trans>離席中</Trans>
              </Text>
            </Pressable>
            <Pressable
              style={[styles.button, userStatus === "busy" && styles.buttonSelected]}
              onPress={() => setUserStatus("busy")}
            >
              <Text style={styles.buttonText}>
                <Trans>取り込み中</Trans>
              </Text>
            </Pressable>
          </View>

          <View style={styles.warningBox}>
            <Text style={styles.warningText}>❌ 悪い例：技術的状態にSelectマクロを使用</Text>
          </View>
          <Text style={styles.result}>
            <Select
              value={userStatus}
              _online="オンライン"
              _offline="オフライン"
              _away="離席中"
              _busy="取り込み中"
              other="不明"
            />
          </Text>

          <View style={styles.goodBox}>
            <Text style={styles.goodText}>✅ 良い例：通常の条件分岐や辞書を使用</Text>
          </View>
          <Text style={styles.result}>
            {userStatus === "online" && <Trans>オンライン</Trans>}
            {userStatus === "offline" && <Trans>オフライン</Trans>}
            {userStatus === "away" && <Trans>離席中</Trans>}
            {userStatus === "busy" && <Trans>取り込み中</Trans>}
          </Text>

          <Text style={[styles.description, { marginTop: 12 }]}>
            <Trans>
              技術的な状態は文法的変化ではないため、個別のメッセージキーを使用すべきです。
              これにより翻訳者が各状態を独立して翻訳でき、保守性も向上します。
            </Trans>
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
            <Trans>Selectマクロの設計思想</Trans>
          </Text>
          <Text style={[styles.description, { marginBottom: 8 }]}>
            • <Trans>ICU MessageFormatの仕様に基づいて設計されています</Trans>
          </Text>
          <Text style={[styles.description, { marginBottom: 8 }]}>
            • <Trans>自然言語の文法的変化（性別、数、格変化など）を扱うためのものです</Trans>
          </Text>
          <Text style={[styles.description, { marginBottom: 8 }]}>
            • <Trans>技術的な状態やビジネスロジックには使用すべきではありません</Trans>
          </Text>
          <Text style={[styles.description, { marginBottom: 16 }]}>
            • <Trans>必ずotherケースを含める必要があります</Trans>
          </Text>

          <Text style={[styles.label, { marginBottom: 8 }]}>
            <Trans>Select vs select</Trans>
          </Text>
          <Text style={[styles.description, { marginBottom: 8 }]}>
            • <Trans>Selectコンポーネント: JSX要素を返す（@lingui/react/macro）</Trans>
          </Text>
          <Text style={[styles.description, { marginBottom: 8 }]}>
            • <Trans>selectマクロ: 文字列を返す（@lingui/core/macro）</Trans>
          </Text>
          <Text style={[styles.description, { marginBottom: 16 }]}>
            • <Trans>特定のケースはアンダースコアで始める（_male、_female等）</Trans>
          </Text>

          <Text style={[styles.label, { marginBottom: 8 }]}>
            <Trans>適切な使用判断基準</Trans>
          </Text>
          <Text style={[styles.description, { marginBottom: 8 }]}>
            • <Trans>文法的変化が必要か？ → YES: Selectマクロを使用</Trans>
          </Text>
          <Text style={[styles.description, { marginBottom: 8 }]}>
            • <Trans>技術的/ビジネス的な状態か？ → YES: 通常の条件分岐を使用</Trans>
          </Text>
          <Text style={styles.description}>
            •{" "}
            <Trans>翻訳者が独立して翻訳する必要があるか？ → YES: 個別のメッセージキーを使用</Trans>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
