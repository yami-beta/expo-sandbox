# Lingui翻訳ワークフローガイド

このドキュメントでは、Expo React NativeプロジェクトでLinguiを使用した国際化対応の開発ワークフローについて説明します。

## 目次

1. [開発時の翻訳ワークフロー](#開発時の翻訳ワークフロー)
2. [GitHub ActionsでのCIチェック](#github-actionsでのciチェック)
3. [よくあるエラーと解決方法](#よくあるエラーと解決方法)
4. [翻訳実装のベストプラクティス](#翻訳実装のベストプラクティス)

## 開発時の翻訳ワークフロー

### 基本的な作業フロー

1. **UIテキストの実装**
   ```tsx
   // Trans コンポーネントを使用（JSX内）
   import { Trans } from "@lingui/react/macro";
   
   <Trans>ホーム画面へようこそ</Trans>
   
   // t マクロを使用（文字列プロパティ）
   import { useLingui } from "@lingui/react/macro";
   const { t } = useLingui();
   
   <TextInput placeholder={t`検索...`} />
   ```

2. **翻訳メッセージの抽出**
   ```bash
   # UIテキストを変更したら必ず実行
   pnpm -r run lingui:extract
   ```

3. **英語翻訳の追加**
   - `apps/sandbox/src/locales/en/messages.po`を開く
   - 新規メッセージの`msgstr`に英語翻訳を追加
   ```po
   msgid "ホーム画面へようこそ"
   msgstr "Welcome to Home Screen"
   ```

4. **動作確認**
   - デバイスの言語設定を変更して確認
   - iOS: 設定 > 一般 > 言語と地域
   - Android: Settings > System > Languages

5. **コミット**
   ```bash
   git add apps/sandbox/src/locales
   git commit -m "feat: add home screen translations"
   ```

### 複数形・条件分岐の実装

#### Pluralマクロ（複数形）
```tsx
import { Plural } from "@lingui/react/macro";

<Plural
  value={count}
  one="1個のアイテム"
  other="#個のアイテム"
/>
```

#### Selectマクロ（条件分岐）
```tsx
import { Select } from "@lingui/react/macro";

<Select
  value={gender}
  male="彼のプロフィール"
  female="彼女のプロフィール"
  other="プロフィール"
/>
```

#### SelectOrdinalマクロ（序数）
```tsx
import { SelectOrdinal } from "@lingui/react/macro";

<SelectOrdinal
  value={rank}
  one="#位"
  two="#位"
  few="#位"
  other="#位"
/>
```

## GitHub ActionsでのCIチェック

### CIの仕組み

プロジェクトには2つのGitHub Actionsワークフローが設定されています：

1. **ci.yml** - 全般的なコード品質チェック
   - ESLint
   - Prettier
   - TypeScript型チェック
   - **Lingui翻訳チェック**（並列実行）

2. **lingui-check.yml** - 翻訳専用チェック
   - `src/**/*.tsx`、`src/**/*.ts`、`src/**/*.po`の変更時に実行
   - mainブランチへのpush、PR時に自動実行

### CIチェックの内容

1. `lingui:extract`を実行
2. 翻訳ファイルに差分がないか確認
3. 差分があればエラーとして報告

### CIが失敗した場合

エラーメッセージ例：
```
❌ Translation files are out of sync
Please run the following command and commit the changes:
pnpm -r run lingui:extract
```

解決手順：
```bash
# 1. 翻訳メッセージを抽出
pnpm -r run lingui:extract

# 2. 差分を確認
git diff apps/sandbox/src/locales

# 3. 英語翻訳を追加（必要に応じて）
# apps/sandbox/src/locales/en/messages.po を編集

# 4. 変更をコミット
git add apps/sandbox/src/locales
git commit -m "chore: update translation files"
git push
```

## よくあるエラーと解決方法

### エラー1: Translation files are not up to date

**原因**: UIテキストを変更したが、`lingui:extract`を実行していない

**解決方法**:
```bash
pnpm -r run lingui:extract
git add apps/sandbox/src/locales
git commit -m "chore: update translation files"
```

### エラー2: Missing translation for message

**原因**: 新規メッセージの英語翻訳が未設定

**解決方法**:
1. `apps/sandbox/src/locales/en/messages.po`を開く
2. 空の`msgstr`を見つける
3. 英語翻訳を追加

### エラー3: Duplicate message ID

**原因**: 同じIDで異なるメッセージを定義

**解決方法**:
- Lingui v5ではGenerated IDsを使用するため、通常発生しない
- 明示的なIDを使用している場合は、IDを変更するか削除

### エラー4: Import error with macros

**原因**: 間違ったパッケージからインポート

**正しいインポート**:
```tsx
// Reactコンポーネント・フック
import { Trans, Plural, Select, SelectOrdinal, useLingui } from "@lingui/react/macro";

// コアマクロ（文字列を返す）
import { t, plural, select, selectOrdinal } from "@lingui/core/macro";

// ❌ 間違い（deprecated）
import { Trans } from "@lingui/macro";
```

## 翻訳実装のベストプラクティス

### 1. コンポーネントとマクロの使い分け

- **JSX内のテキスト** → `<Trans>`コンポーネント
- **文字列プロパティ** → `t`マクロ
- **複数形** → `<Plural>`コンポーネント or `plural`マクロ
- **条件分岐** → 通常のJavaScript（三項演算子）を推奨

### 2. Generated IDsの活用

```tsx
// ✅ 推奨: Generated IDs（ID自動生成）
<Trans>ホーム画面</Trans>

// ❌ 非推奨: 明示的なID
<Trans id="home.title">ホーム画面</Trans>
```

メリット：
- IDの重複を防げる
- 同じメッセージは自動的にマージ
- バンドルサイズの削減

### 3. 技術的な条件分岐

```tsx
// ✅ 推奨: 三項演算子
{Platform.OS === "ios" ? (
  <Trans>iOSの設定</Trans>
) : (
  <Trans>Androidの設定</Trans>
)}

// ❌ 非推奨: Selectマクロ（自然言語向け）
<Select
  value={Platform.OS}
  ios="iOSの設定"
  android="Androidの設定"
  other="設定"
/>
```

### 4. 翻訳の粒度

```tsx
// ✅ 推奨: 文脈が保たれる単位で翻訳
<Trans>
  アカウントを作成することで、
  利用規約とプライバシーポリシーに同意したものとみなされます。
</Trans>

// ❌ 非推奨: 細かすぎる分割
<Trans>アカウントを作成することで、</Trans>
<Trans>利用規約</Trans>
<Trans>と</Trans>
<Trans>プライバシーポリシー</Trans>
<Trans>に同意したものとみなされます。</Trans>
```

### 5. 動的な値の埋め込み

```tsx
// 変数の埋め込み
<Trans>こんにちは、{userName}さん</Trans>

// 複数の変数
<Trans>
  {count}個のアイテムが{cartName}に追加されました
</Trans>

// Pluralと組み合わせ
<Plural
  value={count}
  one={`${userName}さんが1個のアイテムを追加しました`}
  other={`${userName}さんが#個のアイテムを追加しました`}
/>
```

## 言語の追加方法

新しい言語を追加する場合：

1. **lingui.config.jsを更新**
   ```js
   module.exports = {
     locales: ['ja', 'en', 'zh'], // 中国語を追加
     // ...
   };
   ```

2. **Polyfillを追加**（_layout.tsx）
   ```tsx
   import "@formatjs/intl-pluralrules/locale-data/zh";
   ```

3. **翻訳メッセージを抽出**
   ```bash
   pnpm -r run lingui:extract
   ```

4. **新しい言語の翻訳を追加**
   - `apps/sandbox/src/locales/zh/messages.po`を編集

## トラブルシューティング

### デバッグ方法

1. **現在のロケールを確認**
   ```tsx
   import { useLingui } from "@lingui/react/macro";
   const { i18n } = useLingui();
   console.log("Current locale:", i18n.locale);
   ```

2. **翻訳メッセージの確認**
   ```bash
   # .poファイルを直接確認
   cat apps/sandbox/src/locales/en/messages.po | grep "検索語"
   ```

3. **Metro Transformerの動作確認**
   ```bash
   # Metro Bundlerを再起動
   pnpm --dir apps/sandbox start --clear
   ```

### よくある質問

**Q: 翻訳が反映されない**
A: 以下を確認してください：
- `lingui:extract`を実行したか
- 英語翻訳を追加したか
- Metro Bundlerを再起動したか
- デバイスの言語設定が正しいか

**Q: 日本語がデフォルトで表示される**
A: 正常な動作です。`lingui.config.js`で`sourceLocale: 'ja'`と設定されているため。

**Q: アプリ内で言語切り替えができない**
A: 仕様です。Lingui公式推奨により、モバイルアプリではOSの言語設定に従います。

## 参考リンク

- [Lingui公式ドキュメント](https://lingui.dev/)
- [React Native + Linguiガイド](https://lingui.dev/tutorials/react-native)
- [ICU MessageFormat仕様](https://unicode-org.github.io/icu/userguide/format_parse/messages/)
- [CLDR Pluralルール](https://cldr.unicode.org/index/cldr-spec/plural-rules)

---

最終更新日: 2025-08-15