# Lingui導入・学習計画

このドキュメントは、Expo React NativeプロジェクトにLinguiを段階的に導入するための学習計画です。

## 進捗チェックリスト

### フェーズ1: 基礎学習と環境構築（1日目）✅
- [x] Linguiの基礎知識習得
  - [x] Linguiの概要と主要概念（i18n、メッセージカタログ、翻訳フロー）の理解
  - [x] React Nativeでの利用方法の確認
- [x] 必要なパッケージのインストール
  - [x] `@lingui/core`、`@lingui/react`、`@lingui/macro`のインストール
  - [x] `@lingui/cli`の開発環境への追加
  - [x] Babel設定の更新（`babel-plugin-macros`の追加）
- [x] Lingui設定ファイルの作成
  - [x] `lingui.config.js`の基本設定（日本語・英語対応）
  - [x] TypeScript型定義の確認（v5では組み込み）

### フェーズ2: 最小限の実装（2日目）✅
- [x] i18nプロバイダーの設定
  - [x] `_layout.tsx`にLinguiProviderの追加
  - [x] 言語検出とデフォルト言語の設定
- [x] シンプルなテキスト翻訳の実装
  - [x] 1つの画面（例：ホーム画面）で基本的な翻訳を実装
  - [x] `Trans`コンポーネントと`t`マクロの使い方を学習
- [x] メッセージ抽出とカタログ生成
  - [x] `lingui extract`コマンドの実行
  - [x] 生成されたメッセージカタログの確認

### フェーズ3: 言語切り替え機能（3日目）✅
- [x] 言語切り替えUIの実装
  - [x] 設定画面に言語選択機能を追加
  - [x] 選択した言語の永続化（expo-sqlite/kv-store利用）
- [x] 動的な言語切り替え
  - [x] アプリ全体での言語切り替えの動作確認
  - [x] Context APIとの統合

### フェーズ4: OS言語設定への対応（4日目）✅
- [x] Lingui公式推奨のデバイス言語設定対応
  - [x] 現在の言語切り替え機能の削除
  - [x] `expo-localization`を使用した自動言語検出
  - [x] システム言語設定に従う実装への変更
- [x] ドキュメントの更新
  - [x] 言語設定変更方法の説明追加
  - [x] 学習メモへの記録

### フェーズ5: 既存画面の完全翻訳（5日目）✅
- [x] すべての画面への翻訳適用
  - [x] ホーム画面の完全翻訳
  - [x] 設定画面の完全翻訳
  - [x] その他の画面の翻訳
- [x] コンポーネントの翻訳
  - [x] 共通コンポーネントの翻訳対応
  - [x] エラーメッセージの翻訳
- [x] 翻訳キーの命名規則確立
  - [x] 階層的な命名規則の決定
  - [x] 既存キーのリファクタリング

### フェーズ6: IntlのPolyfill設定（6日目）✅
- [x] Intl APIのPolyfill要件の理解
  - [x] React NativeでのIntl APIサポート状況の確認
  - [x] 必要なPolyfillパッケージの調査
  - [x] パフォーマンスへの影響評価
- [x] 必要なパッケージのインストール
  - [x] `@formatjs/intl-locale`のインストール
  - [x] `@formatjs/intl-pluralrules`のインストール
  - [x] 日本語・英語のlocale-dataの追加
- [x] Polyfillの実装
  - [x] `_layout.tsx`へのPolyfillインポート追加
  - [x] polyfill-forceを使用した最適化
  - [x] 動作確認とバンドルサイズの測定

### フェーズ7: Pluralマクロの学習（7日目）✅
- [x] `plural`マクロの基礎学習
  - [x] 単数形・複数形の切り替えパターンの理解
  - [x] 日本語と英語での複数形処理の違いを学習
- [x] 実際のユースケースでの実装
  - [x] アイテム数の表示（「1件」「2件」など）
  - [x] ファイル数、メッセージ数などのカウント表示
  - [x] ゼロの場合の特別な表記（「アイテムがありません」など）

### フェーズ8: Selectマクロの学習（8日目）
- [ ] `select`マクロの基礎学習
  - [ ] 条件による文言切り替えの仕組み理解
  - [ ] 性別、ステータスなどの選択的表示パターン
- [ ] 実際のユースケースでの実装
  - [ ] ユーザーステータス表示（オンライン/オフライン/離席中）
  - [ ] 権限レベルによるメッセージ切り替え
  - [ ] アプリケーション状態による表示分岐

### フェーズ9: SelectOrdinalマクロの学習（9日目）
- [ ] `selectOrdinal`マクロの基礎学習
  - [ ] 序数の表現（1st, 2nd, 3rd, 1位, 2位, 3位など）
  - [ ] 言語による序数表現の違いを理解
- [ ] 実際のユースケースでの実装
  - [ ] ランキング表示の実装
  - [ ] 順位、階層、レベルの表示
  - [ ] 進捗ステップの表示（第1段階、第2段階など）

### フェーズ10: ナビゲーション関連の翻訳（10日目）
- [ ] タブナビゲーションの翻訳
  - [ ] タブバーラベルの動的翻訳
  - [ ] バッジテキストの翻訳
- [ ] スタックナビゲーションの翻訳
  - [ ] 画面タイトルの翻訳
  - [ ] ヘッダーボタンのテキスト翻訳
- [ ] ドロワーメニューの翻訳（該当する場合）

### フェーズ11: フォーマット機能（11日目）
- [ ] 日付のローカライズ
  - [ ] 日付表示形式の地域対応
  - [ ] 相対時間表示の実装（例: "3日前"）
- [ ] 数値のローカライズ
  - [ ] 数値フォーマット（桁区切り、小数点）
  - [ ] 通貨表示の対応
- [ ] カスタムフォーマッターの実装
  - [ ] アプリ固有のフォーマット要件への対応

### フェーズ12: ワークフロー最適化（12日目）
- [ ] 開発ワークフローの確立
  - [ ] npm scriptsへの翻訳コマンド追加
  - [ ] pre-commitフックでの自動チェック
  - [ ] CI/CDへの統合
- [ ] 翻訳ファイルの管理
  - [ ] 翻訳ファイルのバージョン管理方針
  - [ ] 翻訳者との協業フロー確立
- [ ] パフォーマンス最適化
  - [ ] 遅延読み込みの実装
  - [ ] バンドルサイズの分析と最適化
  - [ ] 不要な翻訳の削除

## 実装詳細

### フェーズ1で必要なコマンド

```bash
# Linguiパッケージのインストール
pnpm -C apps/sandbox add @lingui/core @lingui/react @lingui/macro
pnpm -C apps/sandbox add -D @lingui/cli @lingui/babel-plugin-lingui-macro @lingui/metro-transformer

# TypeScript型定義の確認
# Lingui v5では型定義が組み込みのため不要
```

### babel.config.jsの更新
```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      '@lingui/babel-plugin-lingui-macro', // Lingui推奨のBabelプラグイン
    ],
  };
};
```

### lingui.config.jsの基本設定
```javascript
module.exports = {
  locales: ['ja', 'en'],
  sourceLocale: 'ja',
  catalogs: [
    {
      path: '<rootDir>/src/locales/{locale}/messages',
      include: ['<rootDir>/src'],
      exclude: ['**/node_modules/**'],
    },
  ],
  format: 'po',
};
```

### metro.config.jsの設定（Expo用）
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

### 作成・更新が必要なファイル構造
```
apps/sandbox/
├── lingui.config.js         # Lingui設定ファイル
├── babel.config.js          # Babel設定（更新）
├── metro.config.js          # Metro設定（.poファイルのサポート）
├── src/
│   ├── i18n/               # i18n関連のユーティリティ
│   │   ├── index.ts        # i18n初期化
│   │   └── utils.ts        # ヘルパー関数
│   ├── locales/            # 翻訳カタログ
│   │   ├── ja/
│   │   │   └── messages.po
│   │   └── en/
│   │       └── messages.po
│   └── app/
│       └── _layout.tsx     # LinguiProvider追加
```

## 学習リソース

- [Lingui公式ドキュメント](https://lingui.dev/)
- [React Native + Linguiガイド](https://lingui.dev/tutorials/react-native)
- [メッセージ形式の比較](https://lingui.dev/ref/message-format)

## メモ・気づき

### フェーズ1完了時のメモ（2025-08-01）
- Lingui v5では型定義が組み込みになっているため、`@types/lingui__*`パッケージは不要
- Expoプロジェクトでは`babel.config.js`がデフォルトで存在しないため、新規作成が必要
- ~~`babel-plugin-macros`を追加してLinguiマクロをサポート~~ → 公式推奨の`@lingui/babel-plugin-lingui-macro`に変更
- `lingui.config.js`で日本語を`sourceLocale`に設定（アプリのデフォルト言語）
- 公式ドキュメントによると`@lingui/babel-plugin-lingui-macro`の使用が推奨されている
- `<rootDir>`を使用したパス指定により、monorepo構造でも明確な設定が可能
- **追加**: `@lingui/metro-transformer`とmetro.config.jsの設定が必要（.poファイルのサポート）

### フェーズ2完了時のメモ（2025-08-04）
- ~~`I18nProvider`にReact Native用の`defaultComponent={Text}`設定が必要~~ → 実際は不要
- LinkListコンポーネントのtextプロパティをReactNodeに変更して翻訳コンポーネントに対応
- ~~`compileNamespace: "ts"`設定でTypeScript形式のメッセージカタログを生成~~ → Metro Transformerで.poファイルを直接使用
- ~~`Trans`コンポーネントは明示的なIDを使用（例：`<Trans id="navigation.patterns">`）~~ → Generated IDsを使用する方が推奨
- Generated IDsの利点：自動ID生成、重複メッセージの自動マージ、バンドルサイズ削減
- ~~package.jsonに`lingui:extract`と`lingui:compile`スクリプトを追加~~ → extractのみで十分（.poファイルを直接使用）
- ~~生成されたメッセージファイルのeslint-disable警告は無視してOK~~ → コンパイル不要
- **Metro Transformerにより.poファイルを直接インポート可能** - `lingui compile`が不要に
- `src/po-types.d.ts`でTypeScript型定義を追加

### Metro Transformer vs Compile調査メモ（2025-08-04）

#### Metro Transformer（新アプローチ）
- **登場時期**: 2024年11月（Lingui 4.12.0以降）
- **特徴**: .poファイルを直接インポート、ビルドステップ不要
- **メリット**: 開発体験向上、ホットリロード対応、簡潔なワークフロー
- **デメリット**: まだ新しい、実装例が少ない、トラブルシューティング情報が限定的
- **推奨対象**: 新規プロジェクト、Lingui公式推奨

#### Compile（従来アプローチ）
- **特徴**: `lingui extract` → `lingui compile` の2ステップ
- **メリット**: 実績豊富、安定性高い、CI/CD統合しやすい、デバッグ情報豊富
- **デメリット**: 追加ビルドステップ必要、ファイル管理が複雑
- **推奨対象**: 既存プロジェクト、安定性重視

#### 現状と今後
- **2025年1月現在**: 従来のcompileアプローチが一般的
- **今後の予測**: Metro Transformerが新標準になる可能性大
- **GitHubの実装例**: まだcompileアプローチが多数派（Metro Transformerは新しすぎるため）

### フェーズ3完了時のメモ（2025-08-06）
- `src/app/(tabs)/settings/language.tsx`に言語切り替え画面を実装
- 日本語・英語の選択をラジオボタン形式（チェックマーク付き）で表示
- `expo-sqlite/kv-store`を使用して選択言語を永続化
- `src/i18n.ts`に`initializeI18n()`関数を追加し、アプリ起動時に保存された言語設定を読み込む
- `changeLocale()`関数で言語変更時に自動的にStorageに保存
- リアルタイムで言語が切り替わり、全画面に即座に反映される
- TypeScript厳格モードとESLintチェックをクリア

### モバイルアプリでの言語切り替えに関する注意事項
Lingui公式ドキュメントによると、**モバイルアプリでの言語切り替えは推奨されない**とされています。

#### 推奨しない理由
「アプリUIのローカライゼーションで競合が発生する可能性がある」

具体的には以下の問題が考えられます：

1. **システムレベルのローカライゼーションとの不整合**
   - iOS/AndroidのOSレベルの言語設定
   - システムUI要素（日付ピッカー、キーボード等）
   - プッシュ通知の言語

2. **ネイティブコンポーネントの言語**
   - アラートダイアログ
   - 権限リクエストダイアログ
   - システムが提供するUI要素

3. **サードパーティライブラリの言語**
   - 多くのライブラリはデバイスの言語設定に従う
   - アプリ内だけ言語を変えても、これらは変わらない

4. **UXの一貫性の問題**
   - アプリの一部は日本語、システムUIは英語という状況
   - ユーザーの混乱を招く可能性

#### 推奨されるアプローチ
モバイルアプリでは**デバイスの言語設定に従う**ことが推奨されています。ユーザーがアプリの言語を変えたい場合は、デバイスの設定から変更してもらうのがベストプラクティスとされています。

※ 今回は学習目的で言語切り替え機能を実装しましたが、実際のプロダクションアプリでは上記の点を考慮する必要があります。

### 計画見直しメモ（2025-08-08）
- フェーズ4にOS言語設定への対応を追加（Lingui公式推奨の方法に変更）
- 既存画面の完全翻訳を優先してフェーズ5に移動
- 現行フェーズ4の高度な機能を細分化してフェーズ6-8に分割
- 各フェーズの作業量を均等化して学習効率を向上
- 最終的にフェーズ9でワークフロー最適化を実施

### フェーズ4完了時のメモ（2025-08-08）
- `expo-localization`パッケージを追加し、デバイスの言語設定を自動検出
- `app.json`に`expo-localization`プラグインを追加（Expo SDKの要件）
- `src/i18n.ts`を大幅に簡略化：
  - Storage関連のコードを削除（永続化不要）
  - `changeLocale()`関数を削除（手動切り替え不可）
  - `detectLocale()`関数でデバイス言語を検出し、サポート言語にマッピング
- 言語切り替え画面（`language.tsx`）を削除
- 設定画面から言語設定へのリンクを削除
- **Lingui公式推奨のアプローチに準拠**：モバイルアプリではアプリ内言語切り替えは推奨されない
- **言語変更方法**：デバイスの設定 > 一般 > 言語と地域から変更

#### なぜこの実装が推奨されるのか
1. **システムUIとの一貫性**：日付ピッカー、キーボード、システムダイアログなどがデバイス言語と一致
2. **サードパーティライブラリ**：多くのライブラリがデバイス言語に従うため、アプリだけ違う言語だと混乱を招く
3. **UXの統一性**：OSレベルの言語設定に従うことで、ユーザー体験が一貫する
4. **メンテナンスの簡素化**：言語切り替え機能の実装・保守が不要

---

### フェーズ5完了時のメモ（2025-08-08）
- **翻訳コンポーネントの使い分け**
  - JSX内のテキスト: `<Trans>` コンポーネントを使用
  - 文字列プロパティ（title、placeholder等）: `useLingui`フックの`t`マクロを使用
- **実装済みの画面**
  - タブナビゲーション（ホーム、設定）
  - テーマ設定画面
  - ナビゲーションパターン関連のすべての画面
- **翻訳メッセージ数**: 42個の翻訳キーを生成
- **英語翻訳**: すべて完了
- **Generated IDsの使用**: 明示的なID指定は不要で、Linguiが自動生成
- **lint/typecheck**: すべてパス

### フェーズ5.5: Platform.OS条件分岐の翻訳対応（2025-08-12）
- **問題**: `Platform.OS`による動的な条件分岐が適切に翻訳されていなかった
  - プレースホルダー`{0}`のまま翻訳されていない箇所があった
  - 複雑な条件付きテキストが部分的にしか翻訳されていなかった
- **初回解決策**:
  - `Select`マクロを使用してプラットフォームごとの翻訳を実装
  - 条件分岐を明確に分離し、iOS用とAndroid用の翻訳メッセージを個別に定義
- **リファクタリング**:
  - `Select`マクロは主に性別（He/She/They）等の自然言語向けに設計されている
  - Platform.OSのような技術的条件分岐には三項演算子の方が適切
  - 最終的に三項演算子に統一（85-93行目の実装と一貫性を保つため）
- **最終実装**:
  - `form-sheet-screen.tsx`の77-82行目: 三項演算子でプラットフォーム別表示
  - `form-sheet-screen.tsx`の85-93行目: 三項演算子でiOS/Android別メッセージ
- **学習ポイント**:
  - `Select`マクロの適切な使用場面を理解（自然言語の文法的変化が主用途）
  - 技術的な条件分岐には標準的なJavaScript構文（三項演算子）が推奨
  - コードの一貫性を保つことの重要性
  - Generated IDsは条件分岐の実装方法に関わらず適切に動作

### フェーズ6完了時のメモ（2025-08-13）
- **必要なパッケージ**：
  - `@formatjs/intl-locale`: Intl.Locale APIのpolyfill
  - `@formatjs/intl-pluralrules`: Intl.PluralRules APIのpolyfill（plural/selectOrdinalマクロに必要）
- **実装内容**：
  - `_layout.tsx`の最上部（他のインポートより前）にPolyfillを追加
  - `polyfill-force`版を使用（環境チェックをスキップして初期化時間を短縮）
  - 日本語と英語のlocale-dataを明示的にインポート
- **技術的背景**：
  - React Native（特にHermes）はすべてのIntl APIをネイティブサポートしていない
  - Linguiの高度な機能（plural、selectOrdinalマクロ）はこれらのAPIに依存
  - Lingui公式ドキュメント（08/2024時点）でもPolyfillが必要と明記
- **パフォーマンスへの配慮**：
  - `polyfill-force`により低スペック端末での初期化時間を改善
  - バンドルサイズへの影響はあるが、i18n機能には必須
- **注意点**：
  - 新しい言語を追加する際は、対応するlocale-dataのインポートも必要
  - Polyfillインポートは他のすべてのインポートより前に配置することが重要

### フェーズ7完了時のメモ（2025-08-14）
- **Pluralコンポーネント vs pluralマクロ**：
  - `Plural`コンポーネント: JSX要素を返す、`@lingui/react/macro`からインポート
  - `plural`マクロ: 文字列を返す、`@lingui/core/macro`からインポート（**注意**: `@lingui/macro`からのインポートはdeprecated）
  - **重要**: `plural`マクロは単体で使用可能（`t`でラップ不要）
- **実装内容**：
  - `lingui-examples/plural-examples.tsx`で5つの実例を実装
  - インタラクティブなカウンター機能で複数形の変化をリアルタイム確認
  - TextInputのplaceholderで`plural`マクロを使用（文字列プロパティの例）
  - 名前付き変数を含む複数形処理も実装
- **CLDR Pluralルールの理解**：
  - 日本語: `other`のみ（すべての数で同じ形式）
  - 英語: `one`（1の場合）と`other`（0, 2以上）
  - **重要**: `zero`カテゴリーはアラビア語など限られた言語のみ
- **正確な値のマッチング**：
  - `Plural`コンポーネント: `_0`, `_1`などのプロパティ → ICU MessageFormatの`=0`, `=1`に変換
  - `plural`マクロ: **数値リテラル**（`0`, `1`など）をキーとして使用 → `=0`, `=1`に変換
  - **注意**: `plural`マクロでは文字列`"0"`ではなく、数値`0`を使用する必要がある
- **pluralマクロの正確な値マッチングの発見**：
  - 当初、型定義`[digit: \`${number}\`]`から文字列キー`"0"`が使えると誤解
  - 実際には数値リテラル`0`を使用することで正しく動作することを発見
  - babel-plugin-lingui-macroのテストコードで確認
- **#記号**: カウント数値を表示する場所を示すプレースホルダー
- **型定義の更新**: `expo customize tsconfig.json`で新しいルートパスの型を自動生成
- **インポートパスの重要性**：
  - コアマクロ（`t`, `plural`, `select`, `selectOrdinal`, `defineMessage`, `msg`）→ `@lingui/core/macro`
  - Reactコンポーネント・フック（`Trans`, `Plural`, `Select`, `SelectOrdinal`, `useLingui`）→ `@lingui/react/macro`
  - `@lingui/macro`パッケージからのインポートは全てdeprecated

---

## IntlのPolyfill設定詳細

### 必要なパッケージのインストール

```bash
# IntlのPolyfillパッケージをインストール
pnpm -C apps/sandbox add @formatjs/intl-locale @formatjs/intl-pluralrules
```

### Polyfillの実装方法

`src/app/_layout.tsx`の最上部（他のインポートより前）に以下を追加：

```typescript
// Intl APIのPolyfill（React Native向け）
import "@formatjs/intl-locale/polyfill-force";
import "@formatjs/intl-pluralrules/polyfill-force";
import "@formatjs/intl-pluralrules/locale-data/ja"; // 日本語のlocale data
import "@formatjs/intl-pluralrules/locale-data/en"; // 英語のlocale data
```

### なぜPolyfillが必要なのか

1. **React NativeのJavaScriptエンジンの制限**
   - React NativeのJavaScriptエンジン（Hermes等）は、すべてのIntl APIをネイティブサポートしていない
   - 特に`Intl.Locale`と`Intl.PluralRules`は多くの環境で未実装

2. **Linguiの高度な機能の前提条件**
   - `plural`マクロ: `Intl.PluralRules`に依存
   - `selectOrdinal`マクロ: `Intl.PluralRules`の序数機能に依存
   - 適切な言語別の複数形処理にはこれらのAPIが必須

3. **polyfill-forceを使用する理由**
   - 通常のpolyfillは環境チェックを行うが、低スペック端末では初期化に時間がかかる
   - `polyfill-force`は環境チェックをスキップし、常にpolyfillを適用
   - 初期化時間を短縮し、パフォーマンスを改善

### 注意事項

- **バンドルサイズへの影響**: Polyfillの追加により、JavaScriptバンドルサイズが増加します
- **パフォーマンス**: 初回起動時にPolyfillの読み込みが必要ですが、`polyfill-force`により最小限に抑えられます
- **メンテナンス**: 新しい言語を追加する際は、対応するlocale-dataのインポートも必要です

---

最終更新日: 2025-08-14
