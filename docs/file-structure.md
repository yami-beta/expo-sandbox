# src ディレクトリ構成

`apps/sandbox/src` の第1階層の定義と、機能コード・共有コードの線引き。`CLAUDE.md` の「機能で分類し co-location」を実現するための規約。

## 第1階層

| ディレクトリ | 役割 |
| --- | --- |
| `app/` | Expo Router の**ルーティング専用**。画面ファイルは薄く保ち、再利用する部品・ロジックは `features/` / `components/` に置く |
| `features/<name>/` | **単一機能専用**のコード。内部構成は機能の形に合わせる（一律には規定しない）。テストは対象と同じディレクトリに co-location |
| `components/` | **2機能以上から使われる**共有 UI |
| `theme/` `i18n/` `locales/` `test-utils/` | 横断インフラ（テーマ・国際化・lingui 生成物・テストユーティリティ） |

- 新しいレイヤーディレクトリ（`utils/` `hooks/` `constants/` など）は第1階層に作らない。ユーティリティや hooks は利用する機能・コンポーネントのディレクトリへ co-location する
- `app/` にルート以外のファイルを置かないのは Expo Router の制約と公式方針による（app/ 配下のファイルはルートとして解釈される）。参考: [Expo Router: Core concepts](https://docs.expo.dev/router/basics/core-concepts/)

## 機能と共有の線引き

- 単一機能からしか使われないコードは `features/<name>/` に置く
- 2機能以上から使われる UI は `components/` に置く
- 例外: **variant ファミリー**（`Card` / `PressableCard` / `CardShape` のような設計上一体のコンポーネント群）は、個々の利用数によらず一体で `components/` に置く

### 昇格ルール

- `features/` 内の部品が2機能目から必要になった時点で `components/` へ移動する（移動と import 更新は同一コミットで行う）
- `components/` の部品の利用が1機能に減っても、即座に `features/` へは戻さない（揺り戻し防止）

## 依存方向

```
app → features → components → theme / i18n
```

- `features/` 間の import は禁止。必要になったら `components/` への昇格か機能の統合を検討する
- `components/` から `features/` への import は禁止

## import 規約

- パスエイリアスは使わず**相対パス**で import する
- 同一ディレクトリ内は `./` で import する（ディレクトリごと移動しても内部 import が壊れない）
- barrel file（`index.ts` での再エクスポート）は作らず、実ファイルを直接 import する（[`no-barrel-file.md`](./no-barrel-file.md)）

## 参考

- [bulletproof-react: Project Structure](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md) — `features/` + 共有 `components/` の二本立てと単方向依存（shared → features → app）
- [Expo Router: Top-level src directory](https://docs.expo.dev/router/reference/src-directory/) — `src/` 直下に `app/` とその他のディレクトリを並べる公式構成
