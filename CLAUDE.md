# CLAUDE.md

## 前提

Expo SDK 55 monorepo。詳細は `apps/sandbox/package.json` と `apps/sandbox/app.json` を参照。

## Conventions

### パッケージマネージャ

- **pnpm のみを使用**。npm / yarn / corepack は使わない
  - pnpm のバージョンは `package.json` の `packageManager` フィールドで固定。`corepack enable` / `corepack prepare` 等は実行しないこと
- 実行はルートから:
  - 全ワークスペース横断: `pnpm -r run <script>`
  - 特定パッケージ: `pnpm --dir apps/sandbox <command>`
- **Expo SDK パッケージの追加は `pnpm --dir apps/sandbox exec expo install <pkg>`**（npx / pnpm dlx は使わない。SDK 互換バージョンを自動解決）

### ファイル配置

- **機能で分類し co-location**: 関連する component / hooks / utils は同じ機能ディレクトリにまとめる
- **`docs/` と `tasks/` を混在させない**
  - `docs/`: 長期的に参照する設計ドキュメント・運用手順
  - `tasks/`: 後続タスクの引き継ぎ資料・バックログ。完了後は削除/アーカイブ

## Commands

### 開発サーバー

- `pnpm --dir apps/sandbox start` — Metro 起動
- `pnpm --dir apps/sandbox run ios` / `android` / `web`

### コード品質

- `pnpm -r run lint` — 3 層リント（詳細: [`docs/lint.md`](docs/lint.md)）
- `pnpm -r run format` — フォーマット
- `pnpm -r run typecheck` — 型チェック（`generate-types` 込み）

### 国際化

- `pnpm -r run lingui:extract` — UI テキストやファイル位置を変えた場合に実行
  - 詳細・運用は [`docs/lingui/workflow.md`](docs/lingui/workflow.md)。CI（`lingui-check.yml`）でも同期チェックされる
