# アクセシビリティ静的監査 — Findings

> 親タスク: [`accessibility-audit.md`](./accessibility-audit.md) の **Phase 1（監査）** 成果物

## メタ情報

- **監査日**: 2026-06-03
- **対象コミット**: `b8dba46`
- **対象範囲**: `apps/sandbox/src` 配下 全 56 ファイル（`.tsx`/`.ts`）
- **カバレッジ**: 全 56 ファイルを確認。`app/.../navigation-patterns/*/{index,in-tab,on-root}.tsx` は
  `PresentationSampleScreen`/`PresentationSampleOverlay`/`GroupedList` の薄いラッパのため、
  タッチ要素・表示要素はコンポーネント側で網羅的に監査済み。
- **手法**: コードからの静的解析（読解 + コントラスト比・実寸の計算）。
  **VoiceOver / TalkBack 実機読み上げ、Accessibility Inspector/Scanner、フォント拡大時の崩れは未検証**。
  該当項目は各表の「検証」列に **実機要** と明記し、本フェーズでは OK/NG を断定していない。
- **前提**: accessibility 属性は現状 `components/button/Button.tsx` の 2 箇所
  （`accessibilityRole="button"` + `accessibilityState={{ disabled }}`）のみ。他はほぼ未対応。
  表示文言は全画面が lingui（`useLingui()` の `t` マクロ / `Trans`）に統一済み。

---

## 観点 1 — タッチ可能要素のラベル

| ファイル:行 | 該当要素 | 問題 / 現状 | 重大度 | 推奨対応 | 検証 |
|---|---|---|---|---|---|
| `components/presentation-sample/PresentationSampleOverlay.tsx:20` | `<Pressable style={StyleSheet.absoluteFill} onPress={close} />`（透明バックドロップ） | `accessibilityRole`/`accessibilityLabel` 未設定。全画面を覆う透明 hit-area で、SR が無名の巨大ボタンとして読み上げる懸念。`absoluteFill` がフォーカス順を阻害する恐れ | **高** | **SR から隠す方針を推奨**: `accessibilityElementsHidden`(iOS) + `importantForAccessibility="no-hide-descendants"`(Android) を付け、dismiss は本体内の明示ボタン（`PresentationSampleBody.tsx:52`）へ集約。タップ閉じは sighted 向けショートカットとして残す | 実機要 |
| `app/(tabs)/settings/theme.tsx:23` | テーマ選択肢 `Pressable`（`option.label` テキストあり） | `accessibilityRole` 未設定。ラジオ相当だが role なし | 中 | `accessibilityRole="radio"`（or `"button"`）を付与。状態は観点 4 参照 | 静的（role 欠如は確定） |
| `components/grouped-list/ListItem.tsx:67-91` | `<Link asChild><Pressable>` 行 | `accessibilityRole` 未設定（`Link` 配下でも Pressable に role 伝播せず）。テキストは読めるが「リンク/ボタン」案内なし | 中 | Pressable に `accessibilityRole="link"`（or `"button"`）。観点 3 の行グルーピングと併せて対応 | 静的（role 欠如は確定） |
| `components/presentation-sample/PresentationSampleBody.tsx:52` | 「閉じる」`Pressable`（`<Trans>閉じる</Trans>` テキストあり） | `accessibilityRole="button"` 未設定。生 Pressable 実装で role が無く「ボタン」と案内されない | 中 | `accessibilityRole="button"` 付与。可能なら共通 `Button` へ置換し role/state を一元化 | 静的（role 欠如は確定） |
| `components/text-link/TextLink.tsx:33` | `<Link>`（`children` テキストあり） | `accessibilityRole="link"` 未設定 | 低 | `accessibilityRole="link"` を付与 | 静的（role 欠如は確定） |
| `components/button/Button.tsx:132` | 汎用 `Button`（`children` + 任意 `leadingIcon`） | `accessibilityRole="button"` あり。ただし API 上はアイコンのみ（テキスト無し）も可で、その場合は無名ボタンになりうる（現利用箇所では常に文字列を渡しており実害なし） | 低 | 任意 `accessibilityLabel?: string` prop を追加し、`t` マクロ経由で渡せるようにする | 静的（API ギャップは確定） |

**良好**: `Button` は role を持ち children 必須でラベルを確保。表示テキストは全箇所 `t`/`Trans` 経由でラベル源の翻訳基盤が揃う。

---

## 観点 2 — 画像・アイコンの代替テキスト

> `<Image>` は src 全体に **0 件**（画像 alt 不足の典型問題は存在しない）。意味アイコンには必ずテキストラベルが併記される設計。

| ファイル:行 | 該当要素 | 問題 / 現状 | 重大度 | 推奨対応 | 検証 |
|---|---|---|---|---|---|
| `components/icon/Icon.tsx:54-75` | `Icon`（`SymbolView`/`MaterialIcons` を内包） | `accessibilityLabel` も `accessible` も受けられず、装飾/意味の区別をする手段が無い。意味アイコン単体では SR から無視される可能性 | 中 | 任意 `accessibilityLabel?: string`（`t` 経由）と `decorative?: boolean` を追加。装飾時は `accessibilityElementsHidden`/`importantForAccessibility="no-hide-descendants"`、意味用途はラベル伝播。**破壊変更でなく拡張** | 実機要 |
| `components/grouped-list/ListItem.tsx:83-88` | `Ionicons name="chevron-forward"`（行末尾の遷移シェブロン） | 純装飾だが SR から隠す指定なし | 中 | 装飾として隠す（`accessibilityElementsHidden`/`importantForAccessibility="no-hide-descendants"`）。観点 3 の行グルーピングと併せて対応 | 実機要 |
| `components/button/Button.tsx:151-153` | `leadingIcon` の `Icon` | テキスト併記のため装飾が望ましいが隠せず、グリフ名等の二重読み上げ懸念 | 低 | `Icon` の `decorative` 実装後、ボタン内アイコンを装飾化 | 実機要 |
| `app/(tabs)/(home)/index.tsx:22,29,42` / `app/(tabs)/settings/index.tsx:40,53,65` | `Ionicons`/`Icon` の `leadingIcon`（一覧行の先頭アイコン） | テキストが意味を担う装飾アイコンだが隠す指定なし | 低 | 行グルーピング（観点 3）+ 装飾アイコン非表示。`Icon` の `decorative` が前提 | 実機要 |
| `app/(tabs)/(home)/components/index.tsx:58` | アイコン一覧の `Icon`（直下に `name` キャプション） | アイコンを隠さないと SR で名前が重複しうる（ショーケースのため影響小） | 低 | `decorative` 化しキャプションのみ読ませる | 実機要 |
| `app/(tabs)/_layout.tsx:26,31` | `NativeTabs.Trigger.Icon`（house/gearshape） | 対になる `NativeTabs.Trigger.Label`（`t` 経由）があり代替テキストは label が担保。**原則対応不要** | 低 | 現状維持。ラベル整合の最終確認のみ | 実機要 |

**良好**: `<Image>` 不在。アイコン単独で意味を担う箇所がタブ以外に無い。`Icon` が semantic 名でグリフを抽象化しており、将来ラベル自動導出の余地あり。

---

## 観点 3 — フォーカス順序・グルーピング

| ファイル:行 | 該当要素 | 問題 / 現状 | 重大度 | 推奨対応 | 検証 |
|---|---|---|---|---|---|
| `components/presentation-sample/PresentationSampleOverlay.tsx:18-29` | カスタム透過 overlay（`transparentModal`/`containedTransparentModal` で使用） | 背面画面を透過したまま重ねる方式。overlay ルートに `accessibilityViewIsModal`(iOS) も背面隠蔽もなく、**focus trap が効かず SR フォーカスが背面に抜ける懸念** | **高** | 最外 `View`(:19) に iOS=`accessibilityViewIsModal={true}`。Android は RN で背面を直接掴めないため別途設計が要る | 実機要 |
| `components/grouped-list/ListItem.tsx:66-93` | 遷移可能な行（text/description/icon/badge が個別要素） | `accessible` グルーピングが無く、SR が要素ごとに分断読み上げ。行が「リンク」であることも未明示 | 中 | 最外 `View`(:71) を `accessible={true}` + `accessibilityRole="link"`、必要に応じ text+description を結合したラベル。シェブロンは装飾化（観点 2） | 実機要 |
| `components/grouped-list/ListItem.tsx:52-64` | disabled 行（`View` 包み） | 視覚的に無効だが SR では通常テキストとして読まれ「準備中/無効」が伝わらない | 中 | `accessible` グルーピング + `accessibilityState={{ disabled: true }}`。description（「準備中」等）をラベルに含める（観点 4 と連動） | 実機要 |
| `app/(tabs)/settings/index.tsx:13-28,59` | `versionBadge`（"v1.0"）を「アプリ情報」行に付与 | 行グルーピング不在でバッジが分離読み上げ | 低 | 行グルーピングでラベルにバッジ内容を合成（例: `アプリ情報, v1.0`） | 実機要 |
| `components/presentation-sample/PresentationSampleBody.tsx:36-41` | `headerRow`（バッジ + `title` 見出し） | 視覚上一体だが個別読み上げ。見出し構造（`accessibilityRole="header"`）なし | 低 | `headerRow`(:36) を `accessible` グルーピング or heading に `accessibilityRole="header"` | 実機要 |
| `components/presentation-sample/PresentationSection.tsx:15-30` | overline タイトル + body の 2 段ブロック | 見出し構造（`accessibilityRole="header"`）なし | 低 | section タイトルへ `accessibilityRole="header"` | 実機要 |

**良好**: ネイティブ presentation（`modal`/`formSheet`/`fullScreenModal`/`containedModal`/`card`）は OS のモーダル機構に乗るため背面隠蔽・focus trap が OS 側で担保される見込み。focus trap の懸念は**カスタム overlay 2 種に限定**。`GroupedList` は `SectionList` ベースで論理順序が描画順と一致。

---

## 観点 4 — 状態・ライブリージョン

| ファイル:行 | 該当要素 | 問題 / 現状 | 重大度 | 推奨対応 | 検証 |
|---|---|---|---|---|---|
| `app/(tabs)/settings/theme.tsx:23-44` | テーマ選択肢（system/light/dark、選択中を**背景色のみ**で表現） | **選択状態が `accessibilityState` 未設定**。SR 利用者は選択中を判別不可。`mode` で状態は確定済みなのに未伝達 | **高** | `accessibilityRole="radio"` + `accessibilityState={{ selected: mode === option.value }}`。グループを `accessibilityRole="radiogroup"` でラップするとより明確 | 静的（state 欠如は確定）/ 読み上げ語は実機要 |
| `components/grouped-list/ListItem.tsx:52-63` | disabled 行 | `accessibilityState={{ disabled: true }}` 未設定（設定画面の「アプリ情報」「ライセンス」、ホームの「データ取得」が該当） | 中 | disabled 行の View に `accessibilityState={{ disabled: true }}`（観点 3 のグルーピングと連動） | 静的（state 欠如は確定） |
| `app/(tabs)/(home)/components/index.tsx` ほか全画面 | 動的文言・非同期更新・トースト・ローディング | 現状そうした要素は存在しない | 低 | 現状は live region 対象なし。今後データ取得画面実装時にローディング/エラー文言へ `accessibilityLiveRegion` / `AccessibilityInfo.announceForAccessibility` を検討 | 静的（現状は対象なしを確定） |

**良好**: `Button.tsx:136` の `accessibilityState={{ disabled }}` が状態表現のリファレンス実装。動的更新が無く、live region の取りこぼしは theme 選択以外に無い。

---

## 観点 5 — テーマとコントラスト

> 色値は `theme/tokens/colors.ts`。コントラスト比は相対輝度（sRGB, WCAG 2.x）で算出。

| ファイル:行 | 該当要素 | 計算値 | 重大度 | 推奨対応 | 検証 |
|---|---|---|---|---|---|
| `theme/tokens/colors.ts:144` | `text.disabled`（Button/TextLink/ListItem/「準備中」行） | light `#C0C0C0`/`#FCFCFC` = **1.77:1**、solid 上 **1.61:1**；dark `#494949`/`#0B0B0B` = **2.19:1**。AA 非テキスト 3:1 すら未達 | 中 | WCAG は無効要素を対象外とするが可読不能レベル。1〜2 段濃く（light n[10]`#7C7C7C`≈4.07 / dark n[10]`#888888`≈5.3）するか opacity+太字で無効表現 | 静的 |
| `theme/tokens/colors.ts:143` | `text.tertiary`（caption/overline/footer/chevron） | light `#7C7C7C`/canvas = **4.17:1** / surface **4.07:1**。通常テキスト AA 4.5:1 **未達**（大テキスト 3:1 は満たす）。dark 5.33:1 は OK | 中 | caption/overline は 12pt で大テキスト非該当。light で n[11]`#5F5F5F`(6.2:1) 寄りに上げるか 12pt 補足を secondary に。dark は問題なし | 静的 |
| `components/button/Button.tsx:71-76,97` | solid variant 背景 `accent.solid` | onAccent `#FFFFFF`/`#007AFF` = **4.02:1**（通常 AA 未達 / 大テキスト 3:1 OK）。dark onAccent `#0B0B0B`/`#0568D9` = **3.74:1**（通常 AA 未達） | 中 | sm(14pt)/bodyEmphasis(16pt) ラベルは境界。確実に通すなら solid を 1 段濃く（light a[10]`#006FE7`=4.74 / dark a[10]`#2F90FF`=6.14） | 静的 |
| `theme/tokens/colors.ts:135-138` | `border.subtle`（島の境界/separator/Card枠） | light `#E4E4E4`/canvas = **1.27:1**、dark `#282828` = **1.34:1**。UI 境界 AA 3:1 未達 | 低 | 装飾用途（操作可否は文字で伝達）のため許容。情報を border で伝える箇所が出たら `border.strong`(n[8]) を使用 | 静的 |
| `components/button/Button.tsx:66` | outline disabled border = `border.default` | light `#D2D2D2`/canvas = **1.51:1**（UI 3:1 未達） | 低 | 無効状態の装飾枠のため許容。視認性向上なら border.strong 相当へ | 静的 |
| 全タッチ要素（フォーカスインジケータ） | — | フォーカスリング/可視 focus state なし（pressed 背景のみ） | 低 | キーボード/フォーカス操作を想定するなら focus 可視化を検討（RN ネイティブは OS 依存） | 実機要 |

**良好**: `text.primary`（light 17.4:1 / dark 18.9:1）・`text.secondary`（6.2〜9.1:1）は両モード AAA。`link`/`accent.text` は両モード AA 以上（dark AAA）。soft ボタンは両モード AA クリア。dark モードは全般に余裕があり未達は disabled と border.subtle（装飾）のみ。

---

## 観点 6 — ダイナミックタイプ / フォントスケーリング

| ファイル:行 | 該当要素 | 問題 / 現状 | 重大度 | 推奨対応 | 検証 |
|---|---|---|---|---|---|
| `theme/tokens/typography.ts:42-58` | 全タイポグラフィに固定 `lineHeight` | フォント拡大時 `fontSize` はスケールするが固定 `lineHeight`(px) はスケールせず、大倍率で行が詰まり字が重なる/切れる可能性（body 16/24, caption 12/16, label 14/20） | 中 | `lineHeight` を倍率連動（`PixelRatio.getFontScale()` 連動）にするか、未指定にして OS 既定の行間スケールに委ねる | 実機要 |
| `components/button/Button.tsx:32-42` / `components/grouped-list/ListItem.tsx:10,127` | Button 高さ = padding + 固定 lineHeight、ListItem `minHeight:44` | 大倍率でテキスト実描画高が固定 lineHeight を超えるとクリップ。ListItem は leadingIcon(固定 22/28) と複数行テキストの縦整合が崩れうる | 中 | 固定高に依存させない（`minHeight` のみ・`height` 不使用は現状 OK）。icon slot 固定と本文の縦ズレを実機確認 | 実機要 |
| `app/(tabs)/settings/index.tsx:81-83` | version badge `paddingVertical:2` の極小チップ | 拡大で窮屈になりうるが高さ固定なしで破綻はしない | 低 | 許容。padding を相対化してもよい | 実機要 |

**良好**: `allowFontScaling=false` を **1 箇所も使っていない**（Dynamic Type を尊重）。固定 `height` を持つテキストコンテナは無し（padding + `minHeight` ベースで下方向に伸びられる）。`numberOfLines` での切り詰めも無く折返しで全文表示。

---

## 観点 7 — タッチターゲットサイズ

> 実寸 = paddingVertical×2 + lineHeight 等で計算。基準 iOS 44×44pt / Android 48×48dp。

| ファイル:行 | 該当要素 | 実寸（計算） | 重大度 | 推奨対応 | 検証 |
|---|---|---|---|---|---|
| `components/button/Button.tsx:33` | Button **sm**（paddingV:6, label lineHeight:20） | 高さ = 6×2 + 20 = **32pt**。iOS 44 / Android 48 **未達**。短ラベルは幅も ~40pt と狭い。`components/index.tsx` で実使用 | **高** | sm に `hitSlop`（上下最低 (44-32)/2=6pt）を付与、または `minHeight:44` を追加 | 静的 |
| `components/text-link/TextLink.tsx:32-37` | TextLink（inline `Link`、padding/hitSlop 無し） | タップ高 = 文字 lineHeight のみ（body 24 / label 20 / caption 16pt）。いずれも 44/48 **未達** | **高** | 単独配置時は `hitSlop` か上下 padding（最低 (44-24)/2=10pt）。小 type は特に要注意 | 静的 |
| `components/grouped-list/ListItem.tsx:66-93,127` | ListItemRow（行全体が target、`minHeight:44`） | 本文 1 行で 44pt 確保。iOS OK。Android 48dp には 4pt 不足のケース | 中 | Android 48dp 厳守なら `minHeight:48` or 縦 padding を 12 に | 静的 |
| `components/button/Button.tsx:34-40` | Button **md** | 10×2 + 24 = **44pt**（iOS OK / Android 48 に 4pt 不足） | 低 | Android 厳守なら paddingV を 12 or `hitSlop` 上下 2pt | 静的 |
| `components/button/Button.tsx:41` / `theme.tsx:23-44` / `PresentationSampleBody.tsx:52-62` | Button lg / theme option / 閉じるボタン | lg 54pt、option ~52pt、閉じる ~52pt。いずれも OK | 低 | 対応不要 | 静的 |

**良好**: md/lg ボタン・ListItem 行・theme option・presentation 系ボタンは iOS 44pt を満たす。ListItem は行全体を Pressable 化し小さな chevron/icon を個別 target にしていない（良い設計）。不足は **sm Button と TextLink に限定**。

---

## 観点 8 — ナビゲーションとヘッダ

| ファイル:行 | 該当要素 | 問題 / 現状 | 重大度 | 推奨対応 | 検証 |
|---|---|---|---|---|---|
| `app/_layout.tsx:31-65` ほか透過モーダル各画面 | header 非表示の透過モーダル（`transparentModal`/`containedTransparentModal` は `headerShown:false`） | header が無く画面名の読み上げ手掛かりが弱い。タイトル自体は各画面の `Stack.Screen.Title` で設定されており欠落ではない | 中 | overlay 内の見出し（`accessibilityRole="header"`）を確実に最初のフォーカスにする設計（観点 3 と連動） | 実機要 |
| `app/(tabs)/_layout.tsx:25-36` | `NativeTabs.Trigger`（home/settings） | `NativeTabs.Trigger.Label`（`t` 経由）があり読み上げラベルは確保。アイコンのみタブは無い | 低 | 現状維持。Label と選択状態の読み上げを実機確認 | 実機要 |
| 各画面 `Stack.Screen.Title`（`app/(tabs)/(home)/index.tsx:51` ほか） | 全 stack 画面のタイトル | 主要 stack 画面すべてに lingui 経由タイトルがあり基本を満たす | 低 | 現状維持 | 静的（存在は確認）/ 読み上げは実機要 |
| `theme/navigationScreenOptions.ts:9-18` / 各 `_layout.tsx` | 戻るボタン（React Navigation 既定の自動ラベル） | `headerBackTitle` 等の明示は無いが自動ラベルで機能。アイコンのみのカスタムヘッダボタンは src 全体で **0 件** | 低 | 自動戻るラベルで概ね可。日本語で自然か実機確認 | 実機要 |
| `app/_layout.tsx:43-49` | `full-screen-modal/on-root`（`gestureEnabled:false`、header 表示） | 閉じ手段はヘッダ戻る + 本文「閉じる」で確保。初期フォーカスが閉じる導線へ向くかは設計依存 | 低 | open 時の初期フォーカス誘導を実機確認。コード上の欠落ではない | 実機要 |

**良好**: 全 Stack 画面にタイトルが lingui で設定済み。タブはアイコン+Label ペアで無名タブなし。アイコンのみのカスタムヘッダボタンが存在せずラベル欠落の典型問題なし。戻る操作は標準ナビゲーションに委譲。

---

## 観点 9 — 国際化との整合

| ファイル:行 | 該当要素 | 問題 / 現状 | 重大度 | 推奨対応 | 検証 |
|---|---|---|---|---|---|
| `components/presentation-sample/PresentationSampleOverlay.tsx:20` | backdrop に付与する想定ラベル | 観点 1 で「隠す」方針ならラベル不要。隠さずラベルを付けるなら **ハードコード厳禁**、`t` マクロ経由 | 中 | 隠す方針なら文字列不要。付ける場合は `` accessibilityLabel={t`背景をタップして閉じる`} `` | 静的（方針依存） |
| `components/button/Button.tsx:12-21` | 追加想定の `accessibilityLabel` prop | prop 自体が無い。追加時は呼び出し側が `` label={t`...`} `` を渡せる string 型にし、内部に固定文字列を埋め込まない | 低 | `accessibilityLabel?: string` を追加し、利用側で `t` マクロ経由を渡す規約を docs に明記 | 静的（設計確定） |

**良好**: 表示文言はアプリ全体で `t`/`Trans` に統一され、ハードコードされた可視文字列は監査範囲内に見当たらない。accessibility ラベル新設時も既存テキストをラベル源にでき、表示文言と SR ラベルの翻訳ズレが起きにくい。

> **運用上の注意**: ラベルを `t` マクロで追加したら `pnpm -r run lingui:extract` で catalog に取り込み、CI（`lingui-check.yml`）で同期確認すること。

---

## 実機検証が必要な残課題（Phase 1 では未確定）

静的解析では断定できず、VoiceOver / TalkBack 実機（および Accessibility Inspector / Scanner）での確認が必要な項目:

1. **カスタム透過 overlay の focus trap**: SR フォーカスが背面の前画面（タブバー含む）へ抜けないか。`accessibilityViewIsModal` の効果。Android 側の背面隠蔽手段の検証。
2. **読み上げ語の妥当性**: theme 選択に `selected`/`checked`/`radio` を付けた際の TalkBack「選択済み」/ VoiceOver「選択中」の読み上げ。`radio` と `button`+`selected` のどちらが両 OS で自然か。
3. **行グルーピング後の読み上げ**: `ListItem` で text+description+badge+chevron が 1 要素にまとまるか、結合順・冗長性は自然か。
4. **アイコンのデフォルト読み上げ**: SF Symbols(`SymbolView`) / `MaterialIcons` / `Ionicons` がラベル無指定時に何を読むか（グリフ名 / 無音）は OS 差あり。
5. **画面遷移・戻る時のフォーカス移動**: 新画面の見出しへ移るか。透過モーダル open 直後の初期フォーカス位置。自動生成される戻るラベルの i18n 妥当性。
6. **フォント拡大時の崩れ**: 固定 `lineHeight` × 最大アクセシビリティサイズ（iOS）/ Android 200% での行重なり・クリップ。ListItem の icon と複数行テキストの縦整合、`components/index.tsx` の `buttonRow`(flexWrap) の折返し。
7. **タッチターゲット実測**: sm Button の横幅（短ラベル時）、Android 48dp 達成。
8. **ネイティブ描画色の可読性**: NativeTabs / ネイティブヘッダのブラー/液晶ガラス効果込みのラベル可読性。
9. **コントラストの大テキスト判定**: solid/soft ボタンラベルが 3:1（大テキスト）/ 4.5:1（通常）のどちらで評価されるか（実フォントサイズ・太さ次第）。

---

## 次フェーズ提案（Phase 2: issue 分割）

観点横断で「同じコンポーネント/トークンに効く対応」を 1 issue に束ねる方が手戻りが少ない。重大度高 + 局所完結を優先。

| # | issue 候補 | 含む観点 | 主対象 | 優先 | メモ |
|---|---|---|---|---|---|
| 1 | カスタム透過モーダルの focus trap + backdrop の SR 扱い | 1, 3, 8, 9 | `PresentationSampleOverlay.tsx` | **高** | 単一コンポーネントで完結。最重要かつ局所的。実機検証 1・5 とセット |
| 2 | タッチターゲット拡張（`hitSlop` / minHeight） | 7 | `Button`(sm), `TextLink`, `ListItem`(Android) | **高** | コード変更が小さく効果明確。実機検証 7 |
| 3 | タッチ要素の role/state/label 付与 | 1, 4, 9 | `Button`(label prop), `TextLink`, `ListItem`, `theme.tsx`(radio+selected), `PresentationSampleBody`(close) | **高** | コンポーネント横断。theme 選択の selected 状態が利用者影響大。実機検証 2 |
| 4 | `Icon` の `accessibilityLabel`/`decorative` API 追加 + 装飾アイコン隠蔽 | 2 | `Icon.tsx` ほか全 leadingIcon 利用箇所 | 中 | API 拡張 → 波及範囲広い。実機検証 4。#3 の後がよい |
| 5 | `GroupedList`/`ListItem` の行グルーピング + disabled state | 3, 4 | `ListItem.tsx` | 中 | #3 #4 と密接に関連。実機検証 3 |
| 6 | コントラスト是正（token 調整） | 5 | `theme/tokens/colors.ts`（disabled / tertiary / accent.solid） | 中 | **デザイン判断を要する**ため別 issue。全体波及 |
| 7 | フォントスケール耐性（固定 lineHeight 見直し） | 6 | `theme/tokens/typography.ts` ほか | 中 | 実機検証 6 必須。影響範囲が広く慎重に |
| 8 | `docs/accessibility.md` 運用ルール化（Phase 4） | 全 | docs | 低 | 上記が固まった後。新規コンポーネント追加時のチェックリスト |

**着手順の推奨**: #1（overlay）→ #2（hitSlop）→ #3（role/state）を先行。いずれも局所的で重大度が高く、実機検証の単位とも一致する。#4 #5 はコンポーネント API に踏み込むため #3 の後。#6 #7 はデザイン/実機判断が重く独立 issue に。

> **運用方針（要検討）**: accessibility 修正は「直したつもりで読み上げ悪化」が起きやすいため、各 PR で SR 実機検証を必須化する運用を `docs/accessibility.md` に明記することを推奨。

---

## サマリ

- **対応すべき指摘**: 約 36 件（重大度 **高 5** / 中 16 / 低 15 程度。"良好"・"対応不要" 行は除く）。
- **重大度「高」5 件**:
  1. `PresentationSampleOverlay` 透明バックドロップの SR 露出（観点 1）
  2. カスタム透過 overlay の focus trap 不在（観点 3）
  3. theme 選択肢の選択状態未伝達（観点 4）
  4. Button **sm** が 32pt でタッチターゲット未達（観点 7）
  5. TextLink が lineHeight のみでタッチターゲット未達（観点 7）
- **コードのみで欠如が確定**するもの（role/state/サイズ/コントラスト計算）と、**修正後の読み上げ挙動など実機要**のものが明確に分かれた。前者から着手し、各 PR で後者を実機確認する流れが効率的。
- **構造的に良好な点**: `<Image>` 不在、表示文言の lingui 統一、`allowFontScaling=false` の不使用、固定 height の不使用、ネイティブ presentation の OS 委譲、md 以上のタッチターゲット確保。土台は良く、欠けているのは **a11y 属性の明示的付与** が中心。
