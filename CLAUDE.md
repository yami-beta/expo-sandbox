# CLAUDE.md

monorepoで管理されたExpoアプリケーションのリポジトリ

## Conventions

### pnpm

- pnpmのバージョンは `package.json` の `packageManager` フィールドで指定
- 実行はルートから:
  - 全ワークスペース横断: `pnpm -r run <script>`
  - 特定パッケージ: `pnpm --dir apps/sandbox <command>`

### ファイル配置

- **機能で分類しco-location**: 関連する component/hooks/utilsは同じ機能ディレクトリにまとめる
- `docs/`: 長期的に参照する設計ドキュメント・運用手順
- `tasks/`: 後続タスクの引き継ぎ資料・バックログ。完了後は削除/アーカイブ

## Commands

`apps/sandbox/package.json` を参照

### コード品質

- `pnpm -r run lint`
    - 詳細: [`docs/lint.md`](docs/lint.md)
- `pnpm -r run format`

### 国際化

- `pnpm -r run lingui:extract`
  - 詳細・運用は [`docs/lingui/workflow.md`](docs/lingui/workflow.md)。CI（`lingui-check.yml`）でも同期チェックされる
