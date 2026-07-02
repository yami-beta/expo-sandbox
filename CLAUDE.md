# CLAUDE.md

monorepo で管理された Expo アプリケーションのリポジトリ

## Conventions

### pnpm

- pnpm のバージョンは `package.json` の `packageManager` フィールドで指定
- 実行はルートから:
  - 全ワークスペース横断: `pnpm -r run <script>`
  - 特定パッケージ: `pnpm --dir apps/sandbox <command>`

### ファイル配置

- **機能で分類し co-location**: 関連する component/hooks/utils は同じ機能ディレクトリにまとめる
  - src 第1階層の定義・機能と共有の線引きは [`docs/file-structure.md`](docs/file-structure.md)
- `docs/`: 長期的に参照する設計ドキュメント・運用手順
- `tasks/`: 後続タスクの引き継ぎ資料・バックログ。完了後は削除/アーカイブ

## Commands

`apps/sandbox/package.json` を参照

### コード品質

- `pnpm -r run lint`
  - 詳細: [`docs/lint.md`](docs/lint.md)
- `pnpm -r run format`

### テスト

- `pnpm -r run test`
  - ランナーの使い分け（sandbox=jest-expo / tooling=vitest）・書き方は [`docs/testing.md`](docs/testing.md)。CI（`ci.yml` の `test` ジョブ）でも実行される
- E2E（Maestro）
  - PR ごとに `eas build --local` + emulator で実行。構成・運用は [`docs/maestro.md`](docs/maestro.md)。CI（`e2e.yml`）

### 国際化

- `pnpm -r run lingui:extract`
  - 詳細・運用は [`docs/lingui/workflow.md`](docs/lingui/workflow.md)。CI（`lingui-check.yml`）でも同期チェックされる
