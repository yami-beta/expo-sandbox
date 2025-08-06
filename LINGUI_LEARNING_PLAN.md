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

### フェーズ4: 高度な機能の実装（4-5日目）
- [ ] 複数形・条件付き翻訳
  - [ ] `plural`、`select`などの高度なマクロの学習
  - [ ] 実際のユースケースでの実装
- [ ] ナビゲーション関連の翻訳
  - [ ] タブバーのラベル翻訳
  - [ ] 画面タイトルの翻訳
- [ ] フォーマット機能
  - [ ] 日付、数値のローカライズ
  - [ ] カスタムフォーマッターの実装

### フェーズ5: 全体適用と最適化（6-7日目）
- [ ] 既存画面の完全翻訳
  - [ ] すべての画面とコンポーネントへの適用
  - [ ] 翻訳キーの命名規則の確立
- [ ] 開発ワークフローの確立
  - [ ] npm scriptsへの翻訳コマンドの追加
  - [ ] CI/CDへの統合検討
  - [ ] 翻訳ファイルの管理方法の決定
- [ ] パフォーマンス最適化
  - [ ] 遅延読み込みの実装
  - [ ] バンドルサイズの確認と最適化

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

---

最終更新日: 2025-08-06
