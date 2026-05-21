# リント構成

`pnpm -r run lint` は内部で oxlint → expo lint → oxfmt の順に 3 層リントを走らせる。重複なくチェックするのが設計の意図。

## 各層の役割

1. **oxlint**（`--type-aware --type-check`）
   - Rust ベースの高速リンタ
   - tsgolint 経由で TypeScript 型エラーも同時検出
   - `typecheck` スクリプトはこれを再利用している

2. **expo lint**
   - `eslint-config-expo` ベース
   - `eslint-plugin-oxlint` で oxlint と重複するルールは自動無効化

3. **oxfmt**
   - Prettier 互換の高速フォーマッタ

スクリプト定義は `apps/sandbox/package.json` を参照。
