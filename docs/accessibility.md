# アクセシビリティ運用ガイド

このドキュメントは、`apps/sandbox` でアクセシビリティ（a11y）を維持するための運用ルールをまとめたものです。新規コンポーネントを追加するとき、または既存コンポーネントを変更するときに、スクリーンリーダー（VoiceOver / TalkBack）対応を最初から正しく組み込めるよう、**実際に確定した規約とコードパターン**を示します。

ここに載るパターンは机上のものではなく、監査・改善（tracking [#169](https://github.com/yami-beta/expo-sandbox/issues/169)）の Phase 1〜3（PR #171〜#176・CLOSED #167）で実コードに反映された規約です。背景・監査結果は次を参照してください。

- 監査タスク: [`tasks/accessibility-audit.md`](../tasks/accessibility-audit.md)
- 静的監査 findings（9 観点・対象 56 ファイル）: [`tasks/accessibility-audit-findings.md`](../tasks/accessibility-audit-findings.md)

## 目次

1. [基本方針](#基本方針)
2. [新規コンポーネント追加時のチェックリスト](#新規コンポーネント追加時のチェックリスト)
3. [実装パターン集](#実装パターン集)
   - [1. タッチ可能要素の role / state / label](#1-タッチ可能要素の-role--state--label)
   - [2. accessibilityLabel は lingui t マクロ経由](#2-accessibilitylabel-は-lingui-t-マクロ経由)
   - [3. 装飾要素を SR から隠す](#3-装飾要素を-sr-から隠す)
   - [4. 行・グループのまとめ方](#4-行グループのまとめ方)
   - [5. 透過オーバーレイの focus trap](#5-透過オーバーレイの-focus-trap)
   - [6. タッチターゲットサイズ](#6-タッチターゲットサイズ)
   - [7. コントラスト](#7-コントラスト)
   - [8. フォントスケール / Dynamic Type](#8-フォントスケール--dynamic-type)
4. [観点別チェックリスト（監査 9 観点）](#観点別チェックリスト監査-9-観点)
5. [SR 実機検証の必須運用](#sr-実機検証の必須運用)
6. [参考リンク](#参考リンク)

## 基本方針

このアプリの a11y の土台は良好です。次の構造的に良い点を**維持**してください。

- `<Image>` を使っていない（画像 alt 不足の典型問題が無い）
- 表示文言はすべて lingui（`Trans` / `t` マクロ）に統一されている
- `allowFontScaling={false}` を 1 箇所も使っていない（Dynamic Type を尊重）
- テキストコンテナに固定 `height` を持たせていない（`minHeight` ベースで下方向に伸びられる）
- ネイティブ presentation（`modal` / `formSheet` 等）は OS のモーダル機構に委ねている

欠けていたのは **a11y 属性の明示的な付与**が中心でした。新規追加時はこの属性付与を最初から行うのが基本方針です。

### 新旧スタイル系統の共存

このリポジトリには 2 つのスタイル系統が共存しています。**a11y 属性は両系統に等しく付与しますが、スタイル系統の移行はこのガイドの対象外です**（無関係なリファクタを混ぜない）。

| 系統 | 色 | テキスト / タッチ要素 | 例 |
| --- | --- | --- | --- |
| 新（推奨） | `useTheme().tokens` | `ThemedText` / `Button` | `components/button/Button.tsx` |
| 旧（レガシー） | `useTheme().colors` | 生 `Text` / `Pressable` | `app/(tabs)/settings/theme.tsx`、`components/presentation-sample/PresentationSampleBody.tsx` |

> ⚠️ 旧系統の画面でも a11y 属性（`accessibilityRole` 等）は同じ規約で付与します。スタイルだけは既存系統のまま触りません。

## 新規コンポーネント追加時のチェックリスト

新しいタッチ要素・画面・コンポーネントを追加するときは、次を確認してください。

- [ ] **role**: タッチ要素に `accessibilityRole`（`button` / `radio` / `header` など）を付けたか。ただし `expo-router` の `Link` 配下と `TextLink` には付けない（[パターン 1](#1-タッチ可能要素の-role--state--label) 参照）
- [ ] **label**: テキストを持たないアイコンのみのタッチ要素に `accessibilityLabel` を付けたか。文言は lingui `t` マクロ経由か（[パターン 2](#2-accessibilitylabel-は-lingui-t-マクロ経由)）
- [ ] **state**: 無効・選択・展開などの状態を `accessibilityState`（`disabled` / `selected` / `expanded`）で伝えているか
- [ ] **装飾の非表示**: テキストと併記された装飾アイコンを SR から隠したか（[パターン 3](#3-装飾要素を-sr-から隠す)）
- [ ] **グルーピング**: 複数の子要素からなる 1 行・1 ブロックを 1 要素として読み上げさせているか（[パターン 4](#4-行グループのまとめ方)）
- [ ] **タッチターゲット**: iOS 44pt / Android 48dp を満たすか。本アプリは厳しい側の **48** を下限に `minHeight` / `minWidth` で確保する（`hitSlop` は使わない。[パターン 6](#6-タッチターゲットサイズ)）
- [ ] **コントラスト**: 色は token（`tone`）経由で使い、WCAG AA（通常 4.5:1 / 大テキスト 3:1 / 非テキスト 3:1）を満たすか（[パターン 7](#7-コントラスト)）
- [ ] **フォントスケール**: `allowFontScaling={false}` や固定 `height` を持ち込んでいないか。`lineHeight` に `fontScale` を自前で掛けていないか（[パターン 8](#8-フォントスケール--dynamic-type)）
- [ ] **国際化**: 新規ラベル文言を追加したら `pnpm -r run lingui:extract` を実行し catalog 差分をコミットしたか（CI `lingui-check.yml` が同期確認）

## 実装パターン集

各パターンは「ルール → before/after → 出典」の順です。before は監査時点の状態、after は確定した実コードです。

### 1. タッチ可能要素の role / state / label

タッチ可能要素には `accessibilityRole` を付けます。状態は `accessibilityState` で伝えます。

**ただし `expo-router` の `Link` 配下の `Pressable` と `TextLink` には role を明示しません。** `Link` が Slot 経由で `role="link"` を子に付与するため、明示すると二重指定になります。

```tsx
// components/button/Button.tsx — 汎用ボタンは role + state を明示
<Pressable
  onPress={handlePress}
  disabled={disabled}
  accessibilityRole="button"
  accessibilityLabel={accessibilityLabel} // 通常は children が担うため undefined
  accessibilityState={{ disabled }}
>
```

```tsx
// components/text-link/TextLink.tsx — Link が role="link" を付与するので明示しない
<Link href={href}>
  <ThemedText type={type} tone="accent">
    {children}
  </ThemedText>
</Link>
```

ラジオ選択のように「選択状態」を背景色だけで表していた箇所は、`radiogroup` / `radio` と `accessibilityState={{ selected }}` で状態を伝えます。

```tsx
// before: app/(tabs)/settings/theme.tsx — 選択中を背景色のみで表現（SR から判別不可）
<Pressable
  style={[styles.option, { backgroundColor: mode === option.value ? colors.primary : ... }]}
  onPress={() => setMode(option.value)}
>

// after: role + state を付与（旧系統の画面なのでスタイルはそのまま）
<View accessibilityRole="radiogroup">
  {options.map((option) => (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected: mode === option.value }}
      onPress={() => setMode(option.value)}
    >
```

見出しには `accessibilityRole="header"` を付けます。

```tsx
// components/presentation-sample/PresentationSampleBody.tsx
<ThemedText type="title" accessibilityRole="header">
  {heading}
</ThemedText>
```

出典: PR #171（role / state / label）

### 2. accessibilityLabel は lingui t マクロ経由

`accessibilityLabel` に文字列を渡す場合は、**必ず lingui の `t` マクロ経由**にします。ハードコードした文字列は入れません。表示テキストがラベルを兼ねる場合（`Button` の children、`ListItem` の text、ラジオの label など）は `accessibilityLabel` を付けません。

```tsx
import { useLingui } from "@lingui/react/macro";

const { t } = useLingui();

// アイコンのみで文言を持たないボタン
<Button leadingIcon="trash" accessibilityLabel={t`削除`} />

// 意味を持つ単体アイコン（装飾ではない）
<Icon name="heart" accessibilityLabel={t`お気に入り`} />
```

`Button` / `Icon` には `accessibilityLabel?: string` の prop が用意されています（prop コメントに `t` マクロ経由の規約を明記済み）。現状アプリ内ではすべて表示テキストがラベルを兼ねており `t` マクロ経由のラベルは未使用ですが、追加する際はこの規約に従ってください。

ラベル文言を追加したら catalog に取り込みます。

```bash
pnpm -r run lingui:extract
```

CI（`lingui-check.yml`）が catalog の同期を確認します。運用の詳細は [`docs/lingui/workflow.md`](./lingui/workflow.md) を参照してください。

出典: 監査観点 9 / PR #171・#174

### 3. 装飾要素を SR から隠す

テキストと併記された装飾アイコン（行末尾のシェブロン、ボタンの leadingIcon、一覧の先頭アイコンなど）は、グリフ名の二重読み上げを防ぐため SR から隠します。**iOS と Android で属性が異なるため両方を付ける**のが定型です。

```tsx
// 定型: 装飾要素を SR から隠す
accessibilityElementsHidden={true}          // iOS
importantForAccessibility="no-hide-descendants" // Android
```

`Icon` コンポーネントはこの定型を `decorative` prop で内包しています。`accessibilityLabel`（意味アイコン）→ `decorative`（隠す）→ どちらも無ければ無指定、の優先順で属性を導出します。

```tsx
// components/icon/Icon.tsx — resolveAccessibilityProps の優先順
if (accessibilityLabel != null) {
  return { accessible: true, accessibilityLabel, accessibilityRole: "image" };
}
if (decorative) {
  return { accessibilityElementsHidden: true, importantForAccessibility: "no-hide-descendants" };
}
return {};
```

```tsx
// 利用側: Button 内の leadingIcon は装飾
<Icon name={leadingIcon} size={spec.iconSize} color={colors.text} decorative />
```

`Icon` を経由しない生のサードパーティアイコン（`Ionicons` など）は、定型の 2 属性を直接付けます。

```tsx
// components/grouped-list/ListItem.tsx — 行末尾の装飾シェブロン
<Ionicons
  name="chevron-forward"
  size={16}
  color={tokens.color.text.tertiary}
  accessibilityElementsHidden={true}
  importantForAccessibility="no-hide-descendants"
/>
```

出典: PR #174（Icon API）・#175（ListItem）

### 4. 行・グループのまとめ方

複数の子要素（アイコン + テキスト + 説明 + バッジ）からなる 1 行は、要素ごとに分断読み上げされないよう 1 要素にまとめます。

- **タッチ可能な行**: `Pressable` は `accessible` が既定で `true` のため、子の `Text` を自動的に 1 要素に束ねます。role は `Link` が付与するので明示しません（[パターン 1](#1-タッチ可能要素の-role--state--label)）。
- **無効（disabled）な行**: `Pressable` を介さない素の `View` に `accessible={true}` を付けて束ね、`accessibilityState={{ disabled: true }}` で無効状態を伝えます。

```tsx
// components/grouped-list/ListItem.tsx — disabled 行
// 素の View に accessible を付けて行を 1 要素に束ね（iOS: isAccessibilityElement /
// Android: focusable）、子の text / description を連結読み上げさせ無効状態を SR に伝える。
<View
  accessible={true}
  accessibilityState={{ disabled: true }}
  style={[styles.row, islandStyle, { ...rowPadding(tokens.spacing.lg) }]}
>
  <RowContent item={item} iconSlotReserved={iconSlotReserved} disabled />
</View>
```

出典: PR #175（行グルーピング + disabled state）

### 5. 透過オーバーレイの focus trap

カスタムの透過オーバーレイ（`transparentModal` / `containedTransparentModal`）は、背面画面を透過したまま重ねるため、SR フォーカスが背面に抜けないよう focus trap を組みます。

- 最外 `View` に `accessibilityViewIsModal={true}`（iOS）を付ける。
- 全画面を覆う透明な backdrop `Pressable` は、無名の巨大ボタンとして読み上げられないよう[装飾隠しの定型](#3-装飾要素を-sr-から隠す)で SR から除外する。タップで閉じる挙動は sighted 向けのショートカットとして残し、SR 利用者は本体内の「閉じる」ボタンを使う。

```tsx
// components/presentation-sample/PresentationSampleOverlay.tsx
<View style={styles.backdrop} accessibilityViewIsModal={true}>
  <Pressable
    style={StyleSheet.absoluteFill}
    onPress={close}
    accessibilityElementsHidden={true}
    importantForAccessibility="no-hide-descendants"
  />
  {/* 本体（閉じるボタンを含む） */}
</View>
```

> ⚠️ `accessibilityViewIsModal` は iOS の挙動です。Android の背面隠蔽は RN から直接掴めないため、TalkBack での実機確認が特に重要です。ネイティブ presentation（`modal` / `formSheet` / `fullScreenModal` 等）は OS が focus trap を担保するため、この対応は**カスタム透過オーバーレイに限定**されます。

出典: PR #172（focus trap / backdrop）

### 6. タッチターゲットサイズ

最低タッチターゲットは iOS 44pt / Android 48dp です。本アプリは**厳しい側の 48 を全 OS の下限**とし、`hitSlop` ではなく `minHeight` / `minWidth` の**実寸**で確保します。

> ⚠️ `hitSlop` は使いません（コード全体で 0 件）。`expo-router` の `Link`（`Text` ベース）は `hitSlop` を型として受け付けず、実寸で確保する方が確実なためです。

```tsx
// components/button/Button.tsx — size ごとに段階化（全 size で 48 以上）
const SIZE_SPECS = {
  sm: { minSize: 48, ... },
  md: { minSize: 56, ... },
  lg: { minSize: 64, ... },
};
// containerStyle:
{ minHeight: spec.minSize, minWidth: spec.minSize, ... }
```

```tsx
// components/grouped-list/ListItem.tsx — 行高の下限を 48 に統一
const MIN_ROW_HEIGHT = 48; // iOS 44 / Android 48 の厳しい側に統一（Button と揃える）
const rowPadding = (horizontal: number) => ({ minHeight: MIN_ROW_HEIGHT, ... });
```

出典: PR #173（タッチターゲット拡張）

### 7. コントラスト

色は必ず token（`ThemedText` の `tone`、`tokens.color.*`）経由で使い、画面に生の hex を置きません。WCAG AA 基準は次のとおりです。

- 通常テキスト: **4.5:1** 以上
- 大テキスト（おおむね 18pt 以上、または 14pt 太字以上）: **3:1** 以上
- 非テキスト（UI 境界・アイコン等の意味を持つ要素）: **3:1** 以上

色値の Single Source of Truth は [`apps/sandbox/src/theme/tokens/colors.ts`](../apps/sandbox/src/theme/tokens/colors.ts) です。ファイル冒頭に各セマンティックトークンのコントラスト比をコメントで記載しているので、**色を追加・変更したらこのコメントも更新**してください。監査で是正した主な点は次のとおりです（具体値は `colors.ts` を参照）。

- `text.tertiary`（light）を通常 AA 4.5:1 達成のため 1 段濃く調整
- `accent.solid` を 1 段濃くし、`onAccent` テキストとの比を AA まで引き上げ
- `text.disabled` は WCAG 1.4.3 の免除対象だが、視認できる下限として非テキスト基準 3:1 を満たす段に設定

枠線が主たる視覚的アフォーダンスになる箇所（`outline` ボタンの枠など）は、`StyleSheet.hairlineWidth` だと高密度端末でかすれるため **1 DIP** を確保します（区切り線用途の hairline とは要件が異なる）。

```tsx
// components/button/Button.tsx — outline 枠は 1 DIP
{ borderWidth: 1, borderColor: colors.border }
```

出典: PR #176（コントラスト是正）

### 8. フォントスケール / Dynamic Type

OS のフォントサイズ変更（Dynamic Type / フォントサイズ拡大）に追従させます。やるべきこと・やってはいけないことが明確になっています。

**やってはいけないこと: `lineHeight` に自前で `fontScale` を掛けない。** これは二重スケールのバグになります。

React Native は `allowFontScaling`（既定 `true`）のとき、`lineHeight`（px 指定）も `fontSize` と**同じ倍率**で自動的にスケールさせます（iOS / Android とも）。本プロジェクトは `allowFontScaling={false}` も `maxFontSizeMultiplier` も使っていないため、トークンの固定 `lineHeight` をそのまま `<Text>` に渡せば行間比率は維持され、行の重なり・クリップは起きません。JS 側で `fontScale` を掛けると `fontSize × ratio × fontScale²` の逆バグになります。

> ⚠️ この結論は監査の当初仮説（「固定 lineHeight が拡大時に重なる」）を RN ソースで検証した結果、仮説が誤りと判明したものです（issue #167 / PR #177 は対応不要としてクローズ）。`ThemedText` / `typography.ts` は固定 `lineHeight` のままが正解です。

**維持すること:**

- `allowFontScaling={false}` / `maxFontSizeMultiplier` を持ち込まない
- テキストコンテナに固定 `height` を使わない（`minHeight` ベース）
- `numberOfLines` での安易な切り詰めをしない（折返しで全文表示）

> ⚠️ 残課題（実機確認のみ）: leadingIcon（固定 px）と複数行テキストの縦整合、`app/(tabs)/(home)/components/index.tsx` の `buttonRow`（`flexWrap`）が大倍率で折返した際のレイアウト。固定 `height` 非依存で構成済みのため通常は問題ない見込みですが、フォント最大拡大時に崩れたら個別対応します。

出典: 監査観点 6 / issue #167（NOT_PLANNED）

## 観点別チェックリスト（監査 9 観点）

[`tasks/accessibility-audit-findings.md`](../tasks/accessibility-audit-findings.md) の 9 観点を踏襲した、レビュー時の確認項目です。

1. **タッチ可能要素のラベル**: すべてのタッチ要素に `accessibilityRole` があるか（`Link` 配下を除く）。アイコンのみのボタンに `accessibilityLabel`（`t` マクロ経由）があるか。透明な hit-area は隠せているか。
2. **画像・アイコンの代替テキスト**: 意味アイコンに `accessibilityLabel`、装飾アイコンに装飾隠しの定型があるか。
3. **フォーカス順序・グルーピング**: 1 行・1 ブロックが 1 要素として読み上げられるか。透過オーバーレイで背面を SR から隠せているか（focus trap）。
4. **状態・ライブリージョン**: チェック・トグル・選択・無効を `accessibilityState` で伝えているか。動的文言は将来 `accessibilityLiveRegion` / `AccessibilityInfo.announceForAccessibility` を検討。
5. **テーマとコントラスト**: light / dark 両方で WCAG AA を満たすか。色は token 経由か。
6. **ダイナミックタイプ / フォントスケーリング**: `allowFontScaling={false}` を使っていないか。固定 `height` や自前の `fontScale` 計算を持ち込んでいないか。
7. **タッチターゲットサイズ**: `minHeight` / `minWidth` で 48 以上を確保しているか。
8. **ナビゲーションとヘッダ**: Stack タイトル・タブ Label が lingui 経由であるか。透過モーダルの見出しに `accessibilityRole="header"` があるか。
9. **国際化との整合**: `accessibilityLabel` も lingui `t` マクロ経由か。catalog（`lingui:extract`）に取り込めているか。

## SR 実機検証の必須運用

> ⚠️ **a11y 修正は VoiceOver / TalkBack の実機読み上げでしか正否を確定できません。** 「直したつもりで読み上げが悪化」が起きやすいため、各 a11y PR は**実装 → PR 作成までで止め、マージ前に人間が実機で検証**します。エージェントは SR を検証できないので、PR 本文に実機検証チェックリストを残して止まります。

PR 本文に次のチェックリストを記載します（[#169](https://github.com/yami-beta/expo-sandbox/issues/169) の雛形）。

```markdown
## 実機検証チェックリスト（マージ前に人間が確認）

- [ ] iOS VoiceOver: 対象要素が意図どおりの role / label / state で読み上げられる
- [ ] Android TalkBack: 同上
- [ ] 既存操作（タップ / 遷移 / 閉じる）がデグレしていない
- [ ] light / dark 両テーマで確認
```

補助ツールとして Xcode の Accessibility Inspector、Android の Accessibility Scanner も併用できます。ただし**読み上げの最終確認は人間 + 実機**で行い、自動化の対象外とします（ドキュメント変更など SR 挙動に影響しない PR はこの限りではありません）。

## 参考リンク

- [React Native Accessibility](https://reactnative.dev/docs/accessibility)
- [Expo Accessibility](https://docs.expo.dev/guides/accessibility/)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [iOS Human Interface Guidelines - Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- [Android Accessibility](https://developer.android.com/guide/topics/ui/accessibility)
- 内部: [`tasks/accessibility-audit.md`](../tasks/accessibility-audit.md) / [`tasks/accessibility-audit-findings.md`](../tasks/accessibility-audit-findings.md) / [`docs/lingui/workflow.md`](./lingui/workflow.md)

最終更新日: 2026-06-05
