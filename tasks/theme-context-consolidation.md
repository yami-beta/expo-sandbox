# ThemeContext の値の整理（mode / theme / scheme / colors の重複解消）

## ステータス

- 状態: Backlog
- 着手予定: NativeTabs 移行（別タスク）の完了後
- 起票元 PR: #101 (`feat: Themedコンポーネントとデザイントークンを導入`)
- 起票日: 2026-05-07

## 背景

PR #101 で `ThemeContextValue` に `scheme: ColorScheme` と `colors: ColorTokens` を追加した結果、Context が公開する値が以下の 6 つになった。

```ts
interface ThemeContextValue {
  mode: ThemeMode;                  // "system" | "light" | "dark" — ユーザー設定値（永続化対象）
  setMode: (mode: ThemeMode) => void;
  theme: Theme;                     // @react-navigation の Theme — タブバー / ヘッダー等で使用
  isDark: boolean;                  // mode を解決した bool
  scheme: ColorScheme;              // "light" | "dark" — isDark の文字列版（新規）
  colors: ColorTokens;              // Colors[scheme] — 画面内 Themed* で使用（新規）
}
```

これらは「ユーザー設定（`mode` / `setMode`）」と「設定の解決結果（`theme` / `isDark` / `scheme` / `colors`）」に大別できるが、**解決結果側に重複がある**。

| 値 | 派生元 | 用途 | 重複先 |
|---|---|---|---|
| `isDark` | `mode` + `colorScheme` | 単純な真偽値判定 | `scheme === "dark"` で代用可 |
| `scheme` | 同上 | `Colors[scheme]` の引数 | `isDark` から導出可 |
| `theme` | `isDark` | @react-navigation 系コンポーネントに渡す | `colors` と起点が同じ |
| `colors` | `scheme` | Themed* / 画面内 UI に使う | `theme.colors` と一部キーが対応 |

## なぜ今すぐ整理しないか

- `theme: Theme` の主な利用箇所は `(tabs)/_layout.tsx` の `screenOptions` など **`@react-navigation/bottom-tabs` 経由のタブバー周り**
- これは別タスク「NativeTabs (`expo-router/unstable-native-tabs`) への移行」（auto memory `project_native_tabs_migration.md` 参照）で大きく書き換わる予定
- NativeTabs は `theme: Theme` を直接受け取らず、`backgroundColor` / `tintColor` / `iconColor` などを個別 prop で受ける形なので、`theme` の必要性自体が変わる
- 先に整理すると NativeTabs 移行で再度書き換えが発生して二度手間になる

## 着手時に検討する整理案

### 案 A: `isDark` を撤去し `scheme` に統一

- `isDark` を消し、利用箇所を `scheme === "dark"` に置換
- 冗長性は減るが、boolean を使いたい場面では条件式が冗長になるので慎重に判断

### 案 B: `theme` を Context から外し、必要箇所で `colors` から導出

- NativeTabs 移行後、`theme: Theme` を必要とするのは `Stack`/`Drawer` などのナビゲーターの `screenOptions` のみになる想定
- `colors` から `Theme` を組み立てるヘルパー（例: `buildNavigationTheme(colors)`）を作り、利用箇所でローカルに作る or root layout で渡す
- ThemeContext は「ユーザー設定の永続化」と「解決済みカラートークン」に責務を絞れる

### 案 C: 全部残すが、内部実装の重複だけ消す

- 公開 API は変えず、内部で `scheme = isDark ? "dark" : "light"` のような計算を明示的に DRY に
- 影響最小、効果も小

## 着手時の前提条件

- NativeTabs 移行 PR がマージ済み
- 全 Themed* 移行（navigation-patterns/* 含む）がある程度進んでおり、`colors` ベースの参照が中心になっている

## 関連

- PR #101: https://github.com/yami-beta/expo-sandbox/pull/101
- 該当ファイル: `apps/sandbox/src/theme/ThemeContext.tsx`
- 関連メモリ: `project_native_tabs_migration.md`（auto memory ディレクトリ）
- 関連 plan: `/Users/takahiro.abe/.claude/plans/expo-55-https-expo-dev-changelog-sdk-55-ticklish-ritchie.md`
