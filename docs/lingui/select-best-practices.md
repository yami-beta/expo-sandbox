# Lingui Selectマクロ ベストプラクティス

このドキュメントは、Lingui の `Select` マクロと `select` マクロの適切な使用方法について説明します。

## 概要

`Select` マクロは **ICU MessageFormat** の仕様に基づいて設計されており、主に**自然言語の文法的変化**を扱うために作られています。技術的な状態やビジネスロジックの分岐には使用すべきではありません。

## 設計思想

### ICU MessageFormatとは

ICU (International Components for Unicode) MessageFormat は、国際化されたメッセージを作成するための標準仕様です。`select` 構文は、「固定されたキーワードのセットを通じてサブメッセージを選択する」ための機能として設計されています。

### ICU公式ドキュメントで明示されている用途

- **性別による代名詞の変化**（he/she/they）- 最も一般的な使用例として文書化
- **文法的な性**（masculine/feminine/neuter）

### 業界標準プラクティスとしての応用

ICUには組み込みサポートはありませんが、以下の用途での`select`使用は業界で広く受け入れられています：

- **単数/複数の対象者**による表現の変化
- **格変化**（主格、所有格、目的格など）

## 適切な使用例

### 1. 性別による代名詞の変化

```jsx
// ✅ 良い例：自然言語の文法的変化
import { Select } from "@lingui/react/macro";

<Select
  value={gender}
  _male="彼がメッセージを送信しました"
  _female="彼女がメッセージを送信しました"
  other="メッセージを送信しました"
/>

// 英語の場合
<Select
  value={gender}
  _male="He sent a message"
  _female="She sent a message"
  other="They sent a message"
/>
```

### 2. 対象者による表現

```jsx
// ✅ 良い例：単数/複数による文法的変化
<Select
  value={audience}
  _singular="あなたへのお知らせ"
  _plural="皆様へのお知らせ"
  other="お知らせ"
/>
```

### 4. 所有格の表現（文字列プロパティの場合）

```jsx
// ✅ 良い例：selectマクロで文字列を返す
import { select } from "@lingui/core/macro";

const placeholder = select(possessive, {
  my: "私のプロフィール",
  your: "あなたのプロフィール",
  his: "彼のプロフィール",
  her: "彼女のプロフィール",
  their: "その人のプロフィール",
  other: "プロフィール",
});

<TextInput placeholder={placeholder} />;
```

## 不適切な使用例（アンチパターン）

### 1. 技術的な状態

```jsx
// ❌ 悪い例：技術的状態にSelectを使用
<Select
  value={userStatus}
  _online="オンライン"
  _offline="オフライン"
  _away="離席中"
  other="不明"
/>;

// ✅ 良い例：通常の条件分岐を使用
{
  userStatus === "online" && <Trans>オンライン</Trans>;
}
{
  userStatus === "offline" && <Trans>オフライン</Trans>;
}
{
  userStatus === "away" && <Trans>離席中</Trans>;
}

// または辞書パターン
const statusMessages = {
  online: <Trans>オンライン</Trans>,
  offline: <Trans>オフライン</Trans>,
  away: <Trans>離席中</Trans>,
};
{
  statusMessages[userStatus];
}
```

### 2. ビジネスロジックの状態

```jsx
// ❌ 悪い例：注文ステータスにSelectを使用
<Select
  value={orderStatus}
  _pending="処理中"
  _shipped="発送済み"
  _delivered="配達完了"
  other="不明"
/>

// ✅ 良い例：個別のメッセージキーを使用
const getOrderStatusMessage = (status: string) => {
  switch (status) {
    case "pending":
      return <Trans>処理中</Trans>;
    case "shipped":
      return <Trans>発送済み</Trans>;
    case "delivered":
      return <Trans>配達完了</Trans>;
    default:
      return <Trans>不明</Trans>;
  }
};
```

### 3. 権限レベル

```jsx
// ❌ 悪い例：権限レベルにSelectを使用
<Select
  value={role}
  _admin="管理者"
  _editor="編集者"
  _viewer="閲覧者"
  other="ゲスト"
/>;

// ✅ 良い例：明示的なメッセージキー
const roleLabels = {
  admin: <Trans>管理者</Trans>,
  editor: <Trans>編集者</Trans>,
  viewer: <Trans>閲覧者</Trans>,
  guest: <Trans>ゲスト</Trans>,
};
```

## なぜ技術的状態に使うべきでないのか

### 1. 翻訳の独立性

技術的な状態は言語によって完全に異なる表現になることがあります。`Select` マクロでは、すべてのケースが同じメッセージIDに束縛されるため、翻訳者が各状態を独立して翻訳することが困難になります。

### 2. 保守性の問題

ビジネスロジックの状態は頻繁に追加・変更されます。`Select` マクロを使用すると、新しい状態を追加するたびにすべての翻訳ファイルを更新する必要があります。

### 3. 意味の明確性

コードを読む開発者にとって、技術的状態は個別のメッセージキーとして定義されている方が理解しやすく、検索もしやすくなります。

## `Select` コンポーネント vs `select` マクロ

### Select コンポーネント

```jsx
import { Select } from "@lingui/react/macro";

// JSX要素を返す
<Select value={gender} _male="彼" _female="彼女" other="その人" />;
```

### select マクロ

```jsx
import { select } from "@lingui/core/macro";

// 文字列を返す（selectマクロは単体で使用可能）
const pronoun = select(gender, {
  male: "彼",
  female: "彼女",
  other: "その人",
});
```

## 実装時のチェックリスト

`Select` マクロを使用する前に、以下の質問を確認してください：

1. **文法的な変化が必要ですか？**
   - YES → `Select` マクロを使用
   - NO → 次の質問へ

2. **技術的またはビジネス的な状態ですか？**
   - YES → 通常の条件分岐を使用
   - NO → 次の質問へ

3. **翻訳者が各ケースを独立して翻訳する必要がありますか？**
   - YES → 個別のメッセージキーを使用
   - NO → `Select` マクロの使用を検討

## 重要な注意点

1. **必ず `other` ケースを含める**
   - `Select` マクロでは `other` ケースが必須です
   - フォールバック値として機能します

2. **特定のケースはアンダースコアで始める**
   - React コンポーネントでは `_male`、`_female` のように記述
   - Core マクロでは通常のキー名を使用

3. **ICU MessageFormat の仕様を理解する**
   - `Select` マクロは ICU MessageFormat の `select` 構文に変換されます
   - 詳細は [ICU MessageFormat Documentation](http://userguide.icu-project.org/formatparse/messages) を参照

## まとめ

`Select` マクロは強力な機能ですが、その設計意図を理解して使用することが重要です。自然言語の文法的変化には積極的に使用し、技術的な状態やビジネスロジックには通常のi18n パターンを使用することで、保守性が高く、翻訳しやすいコードを実現できます。

## 参照ソース

### ICU公式ドキュメント

- [ICU MessageFormat - Formatting Messages](https://unicode-org.github.io/icu/userguide/format_parse/messages/)
  - `select`は「固定されたキーワードのセットを通じてサブメッセージを選択する」機能として説明
  - 主な例として性別（gender）による選択が示されている

### 業界のベストプラクティス

- [Lokalise - Guide to ICU message format](https://lokalise.com/blog/complete-guide-to-icu-message-format/)
  - 敬語レベルの実装に`select`を使用する例を紹介
  - 「ICUには組み込みの敬語レベルサポートはない」と明記

- [Phrase - A Practical Guide to the ICU Message Format](https://phrase.com/blog/posts/guide-to-the-icu-message-format/)
  - `select`の実践的な応用例を解説

### 言語学的背景

- [T-V distinction](https://en.wikipedia.org/wiki/T%E2%80%93V_distinction)
  - ヨーロッパ言語における敬称の区別（tu/vous、du/Sie等）
- 日本語・韓国語の敬語体系に関する資料
  - これらの言語では文法レベルで敬語が組み込まれている
  - 実装上は`select`を使って対応するのが一般的
