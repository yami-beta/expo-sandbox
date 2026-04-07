# Linguiセットアップ・設定リファレンス

このドキュメントでは、本プロジェクトにおけるLinguiの設定と技術的な背景について説明します。

## パッケージ構成

### 依存パッケージ

| パッケージ | 用途 |
|-----------|------|
| `@lingui/core` | i18nコアライブラリ |
| `@lingui/react` | Reactコンポーネント（I18nProvider等） |
| `@lingui/macro` | マクロ（Trans, t, Plural, Select等） |
| `expo-localization` | デバイスの言語設定を検出 |
| `@formatjs/intl-locale` | Intl.Locale APIのPolyfill |
| `@formatjs/intl-pluralrules` | Intl.PluralRules APIのPolyfill |
| `@formatjs/intl-relativetimeformat` | Intl.RelativeTimeFormat APIのPolyfill |

### 開発用パッケージ

| パッケージ | 用途 |
|-----------|------|
| `@lingui/cli` | メッセージ抽出コマンド（`lingui extract`） |
| `@lingui/babel-plugin-lingui-macro` | マクロをランタイムコードに変換するBabelプラグイン |
| `@lingui/metro-transformer` | .poファイルをMetro経由で直接インポートするためのTransformer |

## 設定ファイル

### lingui.config.js

```javascript
module.exports = {
  locales: ["ja", "en"],
  sourceLocale: "ja",
  catalogs: [
    {
      path: "<rootDir>/src/locales/{locale}/messages",
      include: ["<rootDir>/src"],
      exclude: ["**/node_modules/**"],
    },
  ],
  format: "po",
};
```

- `sourceLocale: "ja"`: ソースコード中のテキストは日本語で記述する
- `format: "po"`: PO形式を採用（Metro Transformerで直接インポート可能）

### babel.config.js

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "@lingui/babel-plugin-lingui-macro",
    ],
  };
};
```

`@lingui/babel-plugin-lingui-macro` がマクロ（`Trans`, `t`, `Plural`等）をランタイムコードに変換する。

### metro.config.js

```javascript
const { getDefaultConfig } = require("expo/metro-config");
const config = getDefaultConfig(__dirname);
const { transformer, resolver } = config;

config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve("@lingui/metro-transformer/expo"),
};

config.resolver = {
  ...resolver,
  sourceExts: [...resolver.sourceExts, "po", "pot"],
};

module.exports = config;
```

Metro Transformerにより `.po` ファイルを直接インポートできる。これにより `lingui compile` が不要になり、ワークフローが簡潔になる。

## Metro Transformer方式

本プロジェクトではMetro Transformer方式を採用している。

### 従来方式との比較

| | Metro Transformer（本プロジェクト） | Compile方式（従来） |
|---|---|---|
| ワークフロー | `extract` のみ | `extract` → `compile` の2ステップ |
| .poファイル | 直接インポート | コンパイル後のJSファイルをインポート |
| ホットリロード | 対応 | コンパイルの再実行が必要 |
| 導入時期 | Lingui 4.12.0（2024年11月）以降 | 従来から存在 |

## Intl Polyfill設定

### なぜPolyfillが必要か

React NativeのJavaScriptエンジン（Hermes）はすべてのIntl APIをネイティブサポートしていない。Linguiの以下の機能はIntl APIに依存する：

- `plural` / `Plural`: `Intl.PluralRules` に依存
- `selectOrdinal` / `SelectOrdinal`: `Intl.PluralRules` の序数機能に依存
- 相対時間フォーマット: `Intl.RelativeTimeFormat` に依存

### polyfill-forceを使用する理由

通常のpolyfillは環境チェックを行うが、`polyfill-force` は環境チェックをスキップして常にpolyfillを適用する。低スペック端末での初期化時間を短縮できる。

### 実装上の注意

- Polyfillインポートは **他のすべてのインポートより前** に配置する（`_layout.tsx`の最上部）
- 新しい言語を追加する際は、対応するlocale-dataのインポートも追加が必要

## 言語設定方針

### OS設定に従う（Lingui公式推奨）

本プロジェクトではアプリ内の言語切り替え機能は実装せず、デバイスのOS言語設定に従う。

**理由：**
- システムUI（日付ピッカー、キーボード、権限ダイアログ等）とアプリの言語が一致する
- サードパーティライブラリの多くがデバイス言語に従うため、アプリだけ異なる言語にすると不整合が生じる
- UXの一貫性が保たれる

**言語変更方法：**
- iOS: 設定 > 一般 > 言語と地域
- Android: Settings > System > Languages

### 言語検出の仕組み

`expo-localization` の `getLocales()` でデバイスの言語設定を取得し、サポート言語にマッピングする。サポート外の言語の場合はデフォルト言語（日本語）にフォールバックする。

## インポートパスの注意点

Lingui v5ではインポート元が明確に分かれている。

### Reactコンポーネント・フック → `@lingui/react/macro`

```tsx
import { Trans, Plural, Select, SelectOrdinal, useLingui } from "@lingui/react/macro";
```

JSX要素を返すコンポーネントと、`t`マクロを提供する`useLingui`フック。

### コアマクロ → `@lingui/core/macro`

```tsx
import { plural, select, selectOrdinal, msg } from "@lingui/core/macro";
```

文字列を返すマクロ。`plural`や`select`は単体で使用可能（`t`でラップ不要）。

### 非推奨のインポート

```tsx
// ❌ @lingui/macro からのインポートはすべてdeprecated
import { Trans } from "@lingui/macro";
```

## マクロの使い分け

| マクロ | 用途 | 返り値 | 例 |
|--------|------|--------|-----|
| `Trans` | JSX内のテキスト翻訳 | JSX要素 | `<Trans>ホーム</Trans>` |
| `t` | 文字列プロパティの翻訳 | 文字列 | `` t`検索...` `` |
| `Plural` / `plural` | 複数形の処理 | JSX / 文字列 | `<Plural value={count} one="1件" other="#件" />` |
| `Select` / `select` | 文法的変化（性別等） | JSX / 文字列 | `<Select value={gender} _male="彼" other="その人" />` |
| `SelectOrdinal` / `selectOrdinal` | 序数表現 | JSX / 文字列 | `<SelectOrdinal value={rank} one="#st" other="#th" />` |
| `msg` | 遅延翻訳（定数定義で使用） | MessageDescriptor | `msg`で定義し`i18n._()`で翻訳実行 |

### コンポーネント vs マクロの選択基準

- **JSX内のテキスト** → `Trans`, `Plural`, `Select`, `SelectOrdinal`（コンポーネント）
- **文字列プロパティ**（title, placeholder等） → `t`, `plural`, `select`, `selectOrdinal`（マクロ）
- **定数・マッピング定義** → `msg` で定義し、使用箇所で `i18n._()` を呼ぶ

## 言語の追加手順

1. `lingui.config.js` の `locales` に言語コードを追加
2. `_layout.tsx` に対応するPolyfillのlocale-dataインポートを追加
3. `src/i18n.ts` の `locales` と `allMessages` に言語を追加
4. `pnpm -r run lingui:extract` でメッセージカタログを生成
5. 生成された `.po` ファイルに翻訳を追加

## 参考リンク

- [Lingui公式ドキュメント](https://lingui.dev/)
- [React Native + Linguiガイド](https://lingui.dev/tutorials/react-native)
- [ICU MessageFormat仕様](https://unicode-org.github.io/icu/userguide/format_parse/messages/)
- [CLDR Pluralルール](https://cldr.unicode.org/index/cldr-spec/plural-rules)
