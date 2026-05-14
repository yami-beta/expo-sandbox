# Expo Router 画面オプション運用ガイド

このドキュメントは、Expo Router の Stack ナビゲータで画面オプション（`title`, `presentation`, ヘッダースタイル等）をどこにどう書くかの方針をまとめたものです。

## 目次

1. [方針概要](#方針概要)
2. [使い分けルール](#使い分けルール)
3. [採用根拠](#採用根拠)
4. [コードサンプル](#コードサンプル)
5. [アンチパターン](#アンチパターン)
6. [将来移行メモ](#将来移行メモ)

## 方針概要

Expo Router は画面オプションを設定する 2 種類の API を提供しています（SDK 55 以降）。

| API | 配置 | 用途 |
| --- | --- | --- |
| **Composition components** (例: `<Stack.Screen.Title>`) | 画面ファイル内の JSX | 画面個別の表示に関する options |
| **Options-based API** (`<Stack.Screen name="..." options={...} />`) | `_layout.tsx` 内 | 構造的 options、共通設定 |

本プロジェクトでは **「画面個別の関心事は Composition で画面ファイルに co-locate」「ナビゲータが事前に把握すべき構造的設定は `_layout.tsx` に集約」** という役割分担を採用しています。

## 使い分けルール

### 画面ファイル側（Composition components）に書く

画面ファイル（`src/app/.../<screen>.tsx`）の返却 JSX 内に `<Stack.Screen.Title>` などを配置します。

- **`title`**: `<Stack.Screen.Title>{t\`画面タイトル\`}</Stack.Screen.Title>`
- 将来採用予定の以下も画面ファイル側になります（必要になった時点で追加）
  - `Stack.Screen.BackButton` - 戻るボタンのカスタマイズ
  - `Stack.Toolbar` - ヘッダー右側のボタンや bottom toolbar（**bottom toolbar は画面ファイル限定**、layout 側では使用不可）
  - `Stack.Header` - ヘッダー全体のカスタマイズ

### `_layout.tsx` 側（Options-based API）に書く

構造的に親 Stack ナビゲータが画面マウント前に把握しなければならない options は `_layout.tsx` の `<Stack.Screen name="..." options={...} />` で宣言します。

- **`presentation: "modal" / "formSheet" / "fullScreenModal"`** - 画面の表示モード
- **`sheetGrabberVisible`**, **`sheetAllowedDetents`** など formSheet 関連
- **`headerShown: false`** - グループ全体のヘッダー非表示
- **`animation`** - 一部の値は初回不適用になる可能性があるため layout 側推奨
- **画面ファイル単独では取れない設定全般**

### `<Stack screenOptions={...}>` に書く

全画面共通のヘッダースタイル（色、フォント等）は `<Stack>` の `screenOptions` prop で一括指定します。本プロジェクトでは `buildStackScreenOptions(colors, colorScheme)` ユーティリティで集約しています。

## 採用根拠

### Expo の方向性

1. **SDK 56 で API 整理が継続**: SDK 56.0.0 changelog に "Rename `Stack.Screen.Title` to `Stack.Title`. The old name is kept as a deprecated alias." とあり、Composition components API は廃止対象ではなく整理・洗練の対象。
2. **新機能は composition 側に乗っている**: SDK 56 で追加された Android Stack.Toolbar、Header Toolbar、Liquid Glass headers などはすべて Composition components 設計。
3. **page-component 限定機能の存在**: `Stack.Toolbar` の bottom toolbar は公式に "can only be used inside page components, not in layout files." と明文化されており、画面ファイル前提アーキテクチャに移行している。
4. **`asChild` プロパティ**: Radix UI 風の modern composition パターンを採用、custom title component を画面側で組み立てやすい設計。

### プロジェクト方針との整合

- CLAUDE.md の「ディレクトリ構造は機能で分類し co-location を採用する」と整合
- 画面追加・削除時に `_layout.tsx` を編集する必要がなく、画面ファイル単独で完結
- 動的な title（route params 連動など）が将来必要になった場合に同じ場所で書ける

### `presentation` が画面ファイル側で動作しない理由

`presentation` はネイティブ Stack が画面をどう生成・遷移させるかを決める設定で、画面コンテンツが render される **前** に親ナビゲータが知っている必要があります。画面ファイル内の `<Stack.Screen options>` は screen 自身がマウントされた **後** に options を更新するため、初回 presentation には間に合いません。issue [expo/router#630](https://github.com/expo/router/issues/630) で Expo Router の core contributor (EvanBacon) が明示的に "you cannot modally present a screen from a different stack inside the current stack" と回答しており、`_layout.tsx` 側での宣言が必須です。

## コードサンプル

### 画面ファイル: title を Composition で配置

```tsx
import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import { LinkList } from "../../components/link-list/LinkList";

export default function NavigationPatterns() {
  const { t } = useLingui();

  return (
    <>
      <Stack.Screen.Title>{t`ナビゲーションパターン`}</Stack.Screen.Title>
      <LinkList data={list} />
    </>
  );
}
```

ポイント:
- Fragment (`<>...</>`) で wrap し、Screen.Title を兄弟要素として配置
- i18n は `useLingui()` の `t` テンプレートリテラルを使う（`_layout.tsx` と同じパターン）
- メッセージ内容は文字列で渡す（`<Trans>` は内部で React element を返すため Title の string children には使えない）

### `_layout.tsx`: 構造的 options のみ宣言

```tsx
import { Stack } from "expo-router";
import { useTheme } from "../theme/useTheme";
import { buildStackScreenOptions } from "../theme/navigationScreenOptions";

export default function RootLayout() {
  const { colorScheme, colors } = useTheme();

  return (
    <Stack screenOptions={buildStackScreenOptions(colors, colorScheme)}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="navigation-patterns/modal-screen"
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="navigation-patterns/form-sheet-screen"
        options={{ presentation: "formSheet", sheetGrabberVisible: true }}
      />
    </Stack>
  );
}
```

ポイント:
- title 宣言は不要（各画面ファイルで自己申告）
- 通常画面の `<Stack.Screen name>` 宣言も不要（ファイルシステムから自動登録）
- 残るのは構造的設定が必要な画面のみ

## アンチパターン

### 画面ファイル内で `presentation` を指定する

```tsx
// ❌ 動作しない / 不安定
export default function ModalScreen() {
  return (
    <>
      <Stack.Screen options={{ presentation: "modal" }} />
      <ScreenContent />
    </>
  );
}
```

理由は上記「`presentation` が画面ファイル側で動作しない理由」参照。`screen presentation updated from modal to push error, this may likely result in a screen object leakage` のエラーになるケースも報告されています。

### `<Stack.Screen.Title>` 内で `<Trans>` を使う

```tsx
// ❌ ネイティブ Title API は React element を受け取らない
<Stack.Screen.Title>
  <Trans>タイトル</Trans>
</Stack.Screen.Title>
```

`<Stack.Screen.Title>` の `children` は string を想定しています（custom component 化したい場合は `asChild` prop を使う）。i18n には `t` テンプレートリテラルを使ってください。

### Options API と Composition の混在で同じ画面の title を二重指定

`_layout.tsx` の `<Stack.Screen options={{ title }}>` と画面ファイル内の `<Stack.Screen.Title>` を同じ画面に両方書くと、後者が優先されますが意図が分かりにくくなります。プロジェクト方針通り片方に寄せてください。

## 将来移行メモ

### SDK 56 アップグレード時

- **`Stack.Screen.Title` → `Stack.Title` への置換**: SDK 56 で canonical 名が変わりますが、`Stack.Screen.Title` は deprecated alias として残るため、置換は段階的で問題ありません。CLI 検索置換で一括変換可能。
- **`npx expo-codemod sdk-56-expo-router-react-navigation-replace src` の実行**: `@react-navigation/*` の直接 import を `expo-router/*` のエントリーポイントに自動書き換え。本プロジェクトでは現状直接 import がないため、影響は限定的です。
- **`ExperimentalStack` への移行検討（opt-in）**: SDK 56 で追加された `react-native-screens/experimental` ベースの新 Stack。同じ Composition components が使えるため、置換コストは低い見込み。

### `Stack.Toolbar` の導入検討

ヘッダーボタンや bottom toolbar が必要になった場合、`Stack.Toolbar` を画面ファイル側に追加します（layout 側では bottom toolbar は使用不可）。iOS は SDK 55+、Android は SDK 56+ で alpha 提供。
