# Stack.Screen `presentation` 値別 iOS / Android 挙動リファレンス

Expo Router の `Stack.Screen` `options.presentation` に指定できる値ごとに、iOS / Android でどう表示されるかをまとめたリファレンスです。実装方針（どこに書くか、配置先 Stack の選び方）は [`screen-options.md`](./screen-options.md) を参照し、本ドキュメントは **値選択時の挙動比較** に絞っています。

## 対象バージョン

- Expo SDK 55
- `expo-router` ~55.0.13
- `react-native-screens` ~4.23.0

`react-native-screens` v5 / Expo SDK 56 では Experimental Stack 等が追加される予定のため、SDK 更新時は本ドキュメントを見直してください。

## 目次

1. [早見表](#早見表)
2. [各値の詳細](#各値の詳細)
3. [`formSheet` 関連オプション](#formsheet-関連オプション)
4. [プロジェクトでの選び方](#プロジェクトでの選び方)
5. [参考リンク](#参考リンク)

## 早見表

| 値 | iOS | Android | Android 実装 |
| --- | --- | --- | --- |
| `card` | 右からスライド push、左端からの swipe back で戻れる | OS / テーマ依存のスライドアニメーション | ネイティブ |
| `modal` | 下から上にスライド、上端 swipe down で閉じられる | 下から上にスライド、戻るボタン / システムジェスチャーで閉じる | ネイティブ |
| `transparentModal` | 前画面が背景に残ったまま modal を重ねる | 同等の透過 modal | ネイティブ |
| `containedModal` | `UIModalPresentationCurrentContext` で current context 上に重ねる | `modal` にフォールバック | フォールバック |
| `containedTransparentModal` | `UIModalPresentationOverCurrentContext` で透過のまま current context に重ねる | `transparentModal` にフォールバック | フォールバック |
| `fullScreenModal` | `UIModalPresentationFullScreen`、**swipe で閉じられない** | `modal` にフォールバック | フォールバック |
| `formSheet` | `UIModalPresentationFormSheet`、detent (snap point) 多数指定可 | `BottomSheetBehavior`、detent は最大 3 つ | ネイティブ |

「Android 実装」が「フォールバック」の値は、Android では指定値ではなく fallback 先 (`modal` / `transparentModal`) の挙動になります。プラットフォーム差を意図しているのでなければ、対応する fallback 先の値を直接指定したほうが意図が明確です。

## 各値の詳細

### `card`

- **iOS**: 右側から左へスライドする push アニメーション。左端から右へのジェスチャーで戻れる (swipe back)。デフォルト値で、いわゆる通常の画面遷移。
- **Android**: OS バージョンや theme に従ったスライドアニメーション。戻るのは戻るボタン / システム戻るジェスチャー。
- **用途**: 通常のナビゲーション全般。`presentation` 未指定時のデフォルトもこれ。

### `modal`

- **iOS**: 下から上へスライドする modal。`UIModalPresentationPageSheet` 相当のシート表示で、上端の swipe down で閉じられる。ネスト Stack をホストできる。
- **Android**: 下から上へのスライドで開く modal。ハードウェアバック / システム戻るジェスチャーで閉じる。
- **共通の用途**: 一時的なフロー (作成系フォーム、設定など) で「いま開いているコンテキストの上に重ねている」ことを示したい場合。
- **注意**: 本プロジェクトでは `modal` をルート Stack に置いている。タブ内側 Stack に置くと Android で push と区別がつかない挙動になる ([`screen-options.md`](./screen-options.md#modal--formsheet-画面はルート-stack-配下に置く))。

### `transparentModal`

- **iOS**: 背景を透明にしたまま modal を重ねる。前画面の内容が見えたままになる。swipe で閉じることは可能だが、background が transparent なので body 側の見せ方を自前で実装する必要がある。
- **Android**: 同等の transparent modal として実装される。
- **用途**: アクションシート風のオーバーレイ、半透明バックドロップ + ダイアログ風 UI を画面コンポーネントとして実装したいとき。
- **注意**: 自前で背景タップで閉じる挙動を組む必要があり、画面コンポーネント側のスタイルでセーフエリアやレイアウトを補正することが多い。

### `containedModal`

- **iOS**: `UIModalPresentationCurrentContext` を使用。modal を表示する際にコンテナビュー (現在の view controller) を背景として保持し、画面全体を覆わずに current context 上に重ねる用途。
- **Android**: `modal` にフォールバック (= 通常の modal と同じ挙動)。
- **用途**: iOS でコンテキスト保持を厳密にしたい特定 UI ケース。基本的にはまず `modal` の利用を検討し、`containedModal` でないと達成できない要件がある場合に限って選択する。

### `containedTransparentModal`

- **iOS**: `UIModalPresentationOverCurrentContext` を使用。`transparentModal` の "current context 限定" 版で、背景の view controller を維持したまま透過で重ねる。
- **Android**: `transparentModal` にフォールバック。
- **用途**: iOS で nested navigator の中だけにスコープした透過 modal を実装したいケース。Android では `transparentModal` と差がない。

### `fullScreenModal`

- **iOS**: `UIModalPresentationFullScreen` を使用。画面全体を完全に覆い、**swipe で閉じることができない**。閉じる手段は明示的に用意する必要がある。
- **Android**: `modal` にフォールバック (戻るボタン / システム戻るジェスチャーで閉じる挙動が残る)。Android では「閉じさせない」は iOS と同等には強制できない。
- **用途**: 認証フロー、強制的に最後まで進めたいオンボーディング、決済確認など、ユーザーに明示的なアクションを取らせたい画面。
- **注意**: iOS と Android で dismissable の挙動が大きく異なる。Android では戻るボタンで離脱できる前提でフローを設計するか、画面側で戻る操作をハンドリングする。

### `formSheet`

- **iOS**: `UIModalPresentationFormSheet` を使用。下からシート状に表示され、detent (snap point) で高さを段階制御できる。iOS は detent 数に実質制限がない。
- **Android**: `BottomSheetBehavior` ベースの実装。detent は **最大 3 つ** まで。シートのコーナー半径、初期 detent、elevation (影) などをカスタマイズできる。
- **共通の用途**: 「画面全体は奪わずに、画面下部にフォーム / 選択肢を表示」する UI。
- **Android 側の既知の制限** (`react-native-screens` 4.x):
  - `sheetAllowedDetents: "fitToContents"` でコンテンツの高さが動的に変わってもシート高さは追従しない
  - キーボード表示時にシートが自動で resize されない
- **iOS 側のサポート差**: 後述の [`formSheet` 関連オプション](#formsheet-関連オプション) を参照。`sheetGrabberVisible` 等 iOS 限定のオプションは Android では無視される。

## `formSheet` 関連オプション

`presentation: "formSheet"` を指定した場合に併用する `sheet*` 系オプションのプラットフォーム対応:

| オプション | iOS | Android | 備考 |
| --- | --- | --- | --- |
| `sheetAllowedDetents` | ✓ | ✓ | iOS は任意数、Android は最大 3 |
| `sheetInitialDetentIndex` | ✓ | ✓ | 初期 detent |
| `sheetLargestUndimmedDetentIndex` | ✓ | ✓ | 背景 dimming の閾値 |
| `sheetCornerRadius` | ✓ | ✓ | シート上端のコーナー半径 |
| `sheetGrabberVisible` | ✓ | ✗ | iOS のみ。Android は無視される |
| `sheetExpandsWhenScrolledToEdge` | ✓ | ✗ | iOS のみ。default `true`。`formSheet` のときだけ効く |
| `sheetElevation` | ✗ | ✓ | Android のみ。シート影の強さ |
| `sheetShouldOverflowTopInset` | ✗ | ✓ | Android のみ。トップ inset を超えて伸ばすか |
| `sheetResizeAnimationEnabled` | ✗ | ✓ | Android のみ。リサイズアニメ ON / OFF |

iOS 限定 / Android 限定オプションは反対側のプラットフォームでは単に無視されるため、両 OS で同じ見た目に揃えたい場合は両方を考慮した値を併記するか、プラットフォーム条件分岐で出し分けます。

## プロジェクトでの選び方

配置方針 (どの Stack の下に置くか、なぜ `_layout.tsx` で宣言するか) は [`screen-options.md`](./screen-options.md) の以下セクションを参照してください。

- [\`presentation\` が画面ファイル側で動作しない理由](./screen-options.md#presentation-が画面ファイル側で動作しない理由)
- [modal / formSheet 画面はルート Stack 配下に置く](./screen-options.md#modal--formsheet-画面はルート-stack-配下に置く)

そのうえで値選択の指針として:

- 「ユーザーに明示的に閉じるアクションを取らせたい」フローは `fullScreenModal` (iOS で swipe 誤クローズを防げる)。ただし Android では戻るボタンで離脱できる前提も設計に織り込む。
- 「前画面の上に半透明バックドロップ + ダイアログ風」は `transparentModal` を選び、背景タップで閉じる UI は画面コンポーネント側で実装する。
- Android でフォールバックされる値 (`containedModal` / `containedTransparentModal` / `fullScreenModal`) を選ぶ場合は、fallback 先の挙動でも UX が崩れないかを確認する。
- 本プロジェクト現状の利用例:
  - `apps/sandbox/src/app/navigation-patterns/modal-screen.tsx` → `presentation: "modal"`
  - `apps/sandbox/src/app/navigation-patterns/form-sheet-screen.tsx` → `presentation: "formSheet"` + `sheetGrabberVisible: true`

## 参考リンク

- React Navigation Native Stack Navigator `presentation`: <https://reactnavigation.org/docs/native-stack-navigator/#presentation>
- Expo Router Stack: <https://docs.expo.dev/router/advanced/stack/>
- react-native-screens 4.0 リリースノート (formSheet など): <https://blog.swmansion.com/introducing-react-native-screens-4-0-0-1b833ff98a55>
