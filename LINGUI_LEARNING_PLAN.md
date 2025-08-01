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

### フェーズ2: 最小限の実装（2日目）
- [ ] i18nプロバイダーの設定
  - [ ] `_layout.tsx`にLinguiProviderの追加
  - [ ] 言語検出とデフォルト言語の設定
- [ ] シンプルなテキスト翻訳の実装
  - [ ] 1つの画面（例：ホーム画面）で基本的な翻訳を実装
  - [ ] `Trans`コンポーネントと`t`マクロの使い方を学習
- [ ] メッセージ抽出とカタログ生成
  - [ ] `lingui extract`コマンドの実行
  - [ ] 生成されたメッセージカタログの確認

### フェーズ3: 言語切り替え機能（3日目）
- [ ] 言語切り替えUIの実装
  - [ ] 設定画面に言語選択機能を追加
  - [ ] 選択した言語の永続化（expo-sqlite/kv-store利用）
- [ ] 動的な言語切り替え
  - [ ] アプリ全体での言語切り替えの動作確認
  - [ ] Context APIとの統合

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
pnpm -C apps/sandbox add -D @lingui/cli @lingui/babel-plugin-lingui-macro

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

### 作成・更新が必要なファイル構造
```
apps/sandbox/
├── lingui.config.js         # Lingui設定ファイル
├── babel.config.js          # Babel設定（更新）
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

---

最終更新日: 2025-08-01
