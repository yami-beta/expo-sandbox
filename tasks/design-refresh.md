# デザイン刷新ロードマップ

## 背景

`apps/sandbox` は Expo Router の学習用サンドボックス。サンプルとして置いていた `LinkList` / `ThemedText` が「汎用すぎ・地味・機能薄」で見本としての訴求力が弱く、また自前テーマシステム (`constants/theme.ts` + `ThemeContext`) のトークンが薄いため見た目を整える土台が足りていなかった。

UI ライブラリ (NativeWind / Tamagui 等) は **採用しない**。自前テーマシステムを洗練し、Expo / React Native の API だけで仕上げる方針。

関連: [`tasks/accessibility-audit.md`](./accessibility-audit.md) — テーマのコントラスト・タッチターゲット等は本ロードマップと整合させる。

## 採用方針

- semantic color: `background.* / border.* / text.* / accent.*` の 2 層 (palette → semantic) で構造化。Radix Gray 風の 13 階調 + Apple システムブルー風アクセント。
- spacing は 4 倍数ベース。`xs / sm / md / lg / xl / 2xl / 3xl / 4xl` に統一。
- radius / shadow / typography トークンを新設。typography は Material 3 と Apple HIG の中間の 8 段階。
- `useTheme()` の戻り値: `{ colorScheme, colors (旧フラット互換), tokens: { color, spacing, radius, shadow, typography } }`。

## 第1段 (PR 完了予定)

スコープ: **テーマトークン整備 + ThemedText 刷新**。LinkList の見た目刷新は **しない** (色変更とは別レビューにしたいため第2段へ)。

完了条件:
- [x] `apps/sandbox/src/theme/tokens/{colors,spacing,radius,shadows,typography}.ts` を新規追加 (barrel `index.ts` は置かない)
- [x] `constants/theme.ts` を新トークン参照の旧 API シムに置換 (`Colors` は semantic から構築、`Spacing`/`Fonts` は単一モジュールから delegate)
- [x] `ThemeContext` / `useTheme` の戻り値に `tokens` を追加
- [x] `navigationScreenOptions.ts` を semantic 参照に切り替え
- [x] `ThemedText` を新 type (`displayLg/title/headline/body/bodyEmphasis/label/caption/code`) + `weight` / `tone` / `align` prop に刷新。旧 type は内部マップで後方互換維持し dev 警告。
- [x] `LinkList` は新トークン参照に差し替えのみ (見た目は据え置き)。chevron は `text.tertiary`、押下背景は `background.pressed`。
- [ ] `pnpm -r run lint` 通過
- [ ] iOS / Android / Web で light/dark 切替確認

## 第2段

スコープ: **LinkList 刷新 + 関連コンポーネントの semantic 化**。

- iOS Settings 風 grouped list:
  - 外側: `background.canvas` + `Spacing.xl` の padding
  - 島: `background.surface` + `Radius.lg` + `Shadows.sm` (dark は border 強化)
  - 行間 separator: 先頭以外に `borderTopWidth: StyleSheet.hairlineWidth` + `border.subtle` (左に paddingLeft 分のインセット)
- `LinkItem` 拡張 props: `description?` (2 行目) / `leadingIcon?` / `trailingBadge?` / `disabled?`
- セクション対応: `LinkSection` wrapper を新設 (title / footer / data)。`SectionList` ではなく `View` の縦並びで十分。
- `ThemedView` に semantic tone prop (canvas / surface / surfaceElevated / subtle) を追加
- `TextLink` を切り出し: `<Link>` の子に `<ThemedText tone="accent">` をネストする素直な構造 (Text ネストで onPress が伝播する)。`ThemedText` の `link` / `linkPrimary` type と `themeColor` prop はここで削除。
- 旧 Spacing alias (`one/two/three/four/five/six/half`) の grep 一括置換 + alias 削除
- ホーム / 設定画面のリンクを section 構造に再編 (空に近い画面は項目を補充する案も)

## 第3段以降

Expo らしい新規サンプルコンポーネントの追加。

候補 (優先度は未確定):
- `LinkList` / `LinkListItem` / `LinkSection` のリネーム (第2段で grouped list + 非リンク `DisabledRow` も配下に持つようになり、現命名が用途を正確に表せていない。代替案: `GroupedList` / `SettingsList` / `SectionedList` / `ListGroup`。`LinkItem` 型も `ListItem` 等に併せて検討)
- `Button` (variants: solid / soft / ghost / outline、leading icon 等)
- `Card` (surface elevation + padding 規約)
- `BlurView` を活用したヘッダ / overlay サンプル (`expo-blur`)
- `Haptics` 連動の押下フィードバック (`expo-haptics`)
- SF Symbols / Material Symbols 連動アイコン (`expo-symbols`)
- DOM コンポーネント (`use dom`) のサンプル

## 後方互換 alias の削除計画

| 対象 | 削除トリガ |
| --- | --- |
| `constants/theme.ts` の re-export shim | 第2段で全箇所を `theme/tokens` 直 import に置換した後 |
| `Spacing.half/one/two/three/four/five/six` | 第2段で `PresentationSample*` 系を `xs..4xl` に置換した後 |
| `ThemedText` の旧 type (`default/subtitle/small/smallBold/link/linkPrimary`) | 第2段で `LinkList` 刷新と同時に呼び出し側 9 箇所を移行した後 |
| `ThemedText` の `themeColor` prop | 同上 (`tone` に統一) |
