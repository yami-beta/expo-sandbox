# barrel file を避ける

「barrel file」とは、ディレクトリ内の複数モジュールをまとめて再エクスポートする `index.ts` などのファイル。本リポジトリでは原則として作成・利用しない。

```ts
// components/button/index.ts (barrel file の例)
export * from "./Button";
export * from "./useButton";
export { ButtonGroup } from "./ButtonGroup";
```

## 理由

### 1. バンドルサイズ・起動コスト

barrel から import すると、実際に使うのが一部であっても **解決時に barrel が参照するモジュールツリー全体が読み込まれる**。tree-shaking が効くケースでも、解析・パースのコストは発生する。

```ts
// Button だけ使いたいのに components/button/* 全体がロードされる
import { Button } from "../components/button";
```

Next.js などで barrel パターンが起動遅延の主因になった事例: [Speeding up the JavaScript ecosystem - The barrel file debacle](https://marvinh.dev/blog/speeding-up-javascript-ecosystem-part-7)

### 2. ES Modules はディレクトリインポートをサポートしない

CommonJS では `import { foo } from "./utils"` が `./utils/index.js` に解決されたが、**ES Modules 仕様では明示的なファイル指定が必要**。

```ts
// CommonJS や bundler 経由でしか動かない（ESM 仕様としては invalid）
import { foo } from "./utils";

// ES Modules 仕様準拠
import { foo } from "./utils/index.js";
import { foo } from "./utils/foo.js";
```

Metro / TypeScript 等の bundler・解決層がディレクトリ → `index.ts` の補完をしているため気にせず動いてしまうが、barrel file の利便性の前提だった「ディレクトリ単位の import」は標準的な書き方ではなくなった。素直に対象ファイルを直接 import する方が ESM 寄りで明快。

### 3. 循環参照のリスク

機能ディレクトリの `index.ts` から再エクスポートすると、同ディレクトリ内のファイルが barrel 経由で互いを参照したときに循環参照が発生しやすい。直接 import なら依存方向が明示される。

### 4. ナビゲーションと検索の摩擦

エディタの「定義へ移動」が barrel に着地して二重ジャンプが必要になる、`grep` で実装ファイルへの直接参照が見えづらい、といった日常的な不便も生じる。

## このプロジェクトでの強制

[`oxc/no-barrel-file`](https://oxc.rs/docs/guide/usage/linter/rules/oxc/no-barrel-file) を `threshold: 1` で有効化している（[`apps/sandbox/.oxlintrc.json`](../apps/sandbox/.oxlintrc.json)）。

- 検出されるパターン: `export * from "..."` 形式の barrel
  - threshold は「barrel から推移的にロードされるモジュール総数」の上限値（詳細は [`docs/lint.md`](lint.md)）
- 検出されないパターン（人間判断で避ける）:
  - `export { X } from "..."` 形式の named re-export
  - barrel 経由の import（消費側）

## どう書くか

barrel を作らず、必要なものを直接 import する。

```ts
// NG
import { Button, useButton } from "../components/button";

// OK
import { Button } from "../components/button/Button";
import { useButton } from "../components/button/useButton";
```

外部公開する API（npm パッケージのエントリポイント等）は barrel の合理性が残るが、本リポジトリはアプリケーションコードのみのため対象外。
