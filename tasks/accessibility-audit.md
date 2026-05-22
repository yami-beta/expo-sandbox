# アクセシビリティ監査・改善

## 背景

`PresentationSampleOverlay` のリファクタ (issue #131) で「透明な `Pressable` を `StyleSheet.absoluteFill` で配置する」パターンを採用した。これはスクリーンリーダー (VoiceOver / TalkBack) から「無名のボタン」として読み上げられる懸念があり、accessibility 観点での対応が必要。

ただしこの問題は同 PR の範囲を超えてアプリ全体に類似の見落としが存在する可能性が高い。SDK 55 サンプル / 学習用アプリとして適切な accessibility 例を示すべく、アプリ全体を対象に監査と改善を行う。

## スコープ

- 対象: `apps/sandbox/src` 配下のすべての画面・コンポーネント
- 含む: iOS (VoiceOver) と Android (TalkBack) 両方の挙動
- 含まない: ライブラリ側 (expo-router / react-native-screens etc.) の挙動。必要なら issue 化してアップストリーム報告

## 観点 (チェックリスト)

### 1. タッチ可能要素のラベル
- [ ] すべての `Pressable` / `TouchableOpacity` 等に `accessibilityRole` が設定されているか
- [ ] アイコンのみ・テキスト無しのボタンに `accessibilityLabel` があるか
- [ ] 透明な hit-area (`StyleSheet.absoluteFill` の `Pressable` 等) のラベルが適切か / SR から隠すべきものは隠せているか
  - 既知: `apps/sandbox/src/components/presentation-sample/PresentationSampleOverlay.tsx` の backdrop Pressable

### 2. 画像・アイコンの代替テキスト
- [ ] `<Image>` の `accessibilityLabel` (装飾用は `accessible={false}`)
- [ ] SVG / アイコンフォントの代替テキスト

### 3. フォーカス順序・グルーピング
- [ ] `accessibilityElementsHidden` (iOS) / `importantForAccessibility` (Android) が必要箇所に設定されているか
- [ ] モーダル/オーバーレイ表示中に背面要素を SR から隠せているか (focus trap 相当)

### 4. 状態・ライブリージョン
- [ ] チェックボックス / トグル等の `accessibilityState` (`checked`, `disabled`, `selected`, `expanded`)
- [ ] 動的に変わる文言の `accessibilityLiveRegion` (Android) / アナウンス通知

### 5. テーマとコントラスト
- [ ] light / dark テーマ両方でテキスト・UI のコントラスト比 (WCAG AA: 4.5:1 / AAA: 7:1) を満たすか
- [ ] フォーカスインジケータの可視性

### 6. ダイナミックタイプ / フォントスケーリング
- [ ] OS のフォントサイズ変更で UI が壊れないか
- [ ] `allowFontScaling` の方針 (基本 true、必要箇所のみ false)

### 7. タッチターゲットサイズ
- [ ] 最低 44x44 pt (iOS) / 48x48 dp (Android) を満たすか
- [ ] `hitSlop` で領域拡張が必要な箇所の特定

### 8. ナビゲーションとヘッダ
- [ ] Stack ヘッダ・タブバーの読み上げ
- [ ] 戻る操作の SR 認識
- [ ] 画面遷移時のフォーカス挙動

### 9. 国際化との整合
- [ ] `accessibilityLabel` も lingui (`useLingui` の `t` マクロ) 経由で翻訳されているか
- [ ] `messages.po` / `lingui:extract` の運用に組み込めるか

## 既知の対象箇所 (随時追記)

- `apps/sandbox/src/components/presentation-sample/PresentationSampleOverlay.tsx`: backdrop の透明 `Pressable` に `accessibilityLabel` / `accessibilityRole` 未設定 (issue #131 のリファクタで導入)
  - 候補: `accessibilityRole="button"` + `accessibilityLabel="閉じる"` (lingui で翻訳)
  - または `accessibilityElementsHidden` + `importantForAccessibility="no-hide-descendants"` で SR から隠し、`PresentationSampleBody` 内の「閉じる」ボタンに dismiss 責務を集約

## 進め方の提案

1. **監査フェーズ**
   - 上記チェックリストでアプリを通しで見て、対象箇所を列挙する
   - VoiceOver / TalkBack を実機で起動し、各画面の読み上げを記録
   - 必要に応じて Accessibility Inspector (Xcode) / Accessibility Scanner (Android) で機械的にチェック
2. **issue 分割**
   - 観点ごと (例: 「タッチ可能要素のラベル」「コントラスト」) または画面ごとに sub-issue 化
   - ボリュームが小さい観点はまとめて 1 issue でも可
3. **実装フェーズ**
   - lingui 翻訳が必要な文言は `messages.po` 更新と CI (`lingui-check.yml`) を意識
   - SR 実機検証を PR ごとに必須化する運用を検討
4. **ドキュメント化**
   - 監査結果と方針が固まったら `docs/accessibility.md` に運用ルール (新規コンポーネント追加時のチェックリスト等) としてまとめる

## 参考リンク

- [React Native Accessibility](https://reactnative.dev/docs/accessibility)
- [Expo Accessibility](https://docs.expo.dev/guides/accessibility/)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [iOS Human Interface Guidelines - Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- [Android Accessibility](https://developer.android.com/guide/topics/ui/accessibility)
