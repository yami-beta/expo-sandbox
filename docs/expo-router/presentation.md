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
| `modal` | 下から上にスライド、上端 swipe down で閉じられる (iOS 13+ の page sheet) | `presentation` 形式は modal だが、アニメーションは `animation` プロパティ依存 (未指定なら `card` と同じ OS 標準遷移)。戻るボタン / システムジェスチャーで閉じる | ネイティブ |
| `transparentModal` | 前画面が背景に残ったまま modal を重ねる。**swipe では閉じられない** (自前で背景タップ等を実装) | 同等の透過 modal | ネイティブ |
| `containedModal` | `UIModalPresentationCurrentContext`。presentation context が定義された view controller の bounds 内に重ねる (タブ内側 Stack ならタブバーが残る) | `modal` にフォールバック | フォールバック |
| `containedTransparentModal` | `UIModalPresentationOverCurrentContext`。透過のまま presentation context の bounds 内に重ねる | `transparentModal` にフォールバック | フォールバック |
| `fullScreenModal` | `UIModalPresentationFullScreen`。画面全体を覆う。**React Navigation 公式に「ジェスチャーで dismiss できない」と明記** | `modal` にフォールバック | フォールバック |
| `formSheet` | `UIModalPresentationFormSheet`、detent (snap point) 多数指定可。detent を下回る swipe down で閉じられる | `BottomSheetBehavior`、detent は最大 3 つ | ネイティブ |

「Android 実装」が「フォールバック」の値は、Android では指定値ではなく fallback 先 (`modal` / `transparentModal`) の挙動になります。プラットフォーム差を意図しているのでなければ、対応する fallback 先の値を直接指定したほうが意図が明確です。

### iOS の swipe down 挙動について

UIKit で swipe down による対話的な dismiss ジェスチャーが組み込まれているのは iOS 13+ で導入された sheet 系 presentation、つまり `UIModalPresentationPageSheet` (`modal`) と `UIModalPresentationFormSheet` (`formSheet`) の 2 種類だけです。`UIModalPresentationCurrentContext` / `UIModalPresentationOverCurrentContext` / `UIModalPresentationFullScreen` を使う他の値 (`containedModal` / `containedTransparentModal` / `fullScreenModal`) は、UIKit のデフォルトでは sheet ジェスチャーを持ちません。

ただし、React Navigation 公式ドキュメントが **明示的に「ジェスチャーで dismiss できない」と保証している** のは `fullScreenModal` のみ ( "A screen using this presentation style can't be dismissed by gesture." )。それ以外の値が swipe で閉じないかどうかは、UIKit の挙動から結果的にそうなるという話で、ライブラリ公式の保証ではないことに注意してください。実用上はいずれにせよ、これらの presentation を使う画面には閉じるボタンや背景タップなど、明示的な dismiss 手段を必ず用意するのが安全です。

### iOS と Android で `presentation` と `animation` の関係が違う点

iOS の `presentation: "modal"` / `"formSheet"` は UIKit のネイティブ presentation スタイルを切り替え、それに **対応するシートのスライドアップアニメーションも組み込み** で提供します。そのため `animation` を明示しなくても「下から上」になります。

Android では `presentation` は presentation 形式 (背面の挙動、戻るキーの扱い、フラグメントの種類など) を切り替えるだけで、**画面遷移アニメーションは独立した `animation` プロパティ** で決まります。`animation` 未指定時のデフォルト (`"default"`) は `card` と同じ OS 標準の遷移アニメーション (多くの端末で右からスライド) になり、iOS のような「下から上」にはなりません。

Android でも下から上にしたい場合は `animation: "slide_from_bottom"` を明示する必要があります。本リポジトリのサンプルでは「素の `presentation` 指定だとどう振る舞うか」を観察できるようにするため、`animation` を上書きせずに OS デフォルトのまま使っています。

## 各値の詳細

### `card`

- **iOS**: 右側から左へスライドする push アニメーション。左端から右へのジェスチャーで戻れる (swipe back)。デフォルト値で、いわゆる通常の画面遷移。
- **Android**: OS バージョンや theme に従ったスライドアニメーション。戻るのは戻るボタン / システム戻るジェスチャー。
- **用途**: 通常のナビゲーション全般。`presentation` 未指定時のデフォルトもこれ。

### `modal`

- **iOS**: 下から上へスライドする modal。`UIModalPresentationPageSheet` 相当のシート表示で、上端の swipe down で閉じられる。ネスト Stack をホストできる。シートのスライドアップアニメーションは presentation 自体に組み込まれているため `animation` の指定は不要。
- **Android**: presentation 形式は modal (背面 view が残り、ハードウェアバック / システム戻るジェスチャーで閉じる) になるが、**遷移アニメーションは `animation` プロパティで別途決まる**。`animation` 未指定時は `card` と同じ OS 標準の遷移 (多くの端末で右からスライド) になり、iOS のような「下から上」にはならない。下から上にしたい場合は `animation: "slide_from_bottom"` を明示する。
- **共通の用途**: 一時的なフロー (作成系フォーム、設定など) で「いま開いているコンテキストの上に重ねている」ことを示したい場合。
- **注意**: 本プロジェクトでは `modal` をルート Stack に置いている。タブ内側 Stack に置くと Android で push と区別がつかない挙動になる ([`screen-options.md`](./screen-options.md#modal--formsheet-画面はルート-stack-配下に置く))。

### `transparentModal`

- **iOS**: 背景を透明にしたまま modal を重ねる。前画面の内容が見えたままになる。背景透過モーダルは UIKit のデフォルトでは sheet ジェスチャーを持たないため、自前で背景タップ等の dismiss を実装する。
- **Android**: 同等の transparent modal として実装される。
- **用途**: アクションシート風のオーバーレイ、半透明バックドロップ + ダイアログ風 UI を画面コンポーネントとして実装したいとき。
- **注意**: 自前で背景タップで閉じる挙動を組む必要があり、画面コンポーネント側のスタイルでセーフエリアやレイアウトを補正することが多い。

### `containedModal`

- **iOS**: `UIModalPresentationCurrentContext` を使用 ([React Navigation の native-stack `presentation`](https://reactnavigation.org/docs/native-stack-navigator/#presentation))。`definesPresentationContext: true` を持つ最も近い祖先 view controller の bounds 内に表示される。例えばタブ内側 Stack で開くとタブバー領域を含まない範囲で重なる。`fullScreenModal` との違いは表示範囲で、`fullScreenModal` は presentation context に関係なく画面全体を覆うのに対し、`containedModal` は presentation context の bounds に収まる。
- swipe down ジェスチャーについて: UIKit の `UIModalPresentationCurrentContext` は sheet ジェスチャーを持たないため、結果として swipe では閉じない。**ただしこれは React Navigation 公式の保証ではなく、UIKit の挙動から導かれるもの**。`fullScreenModal` のように「ジェスチャー不可」と明記されているわけではない点に注意。
- **Android**: `modal` にフォールバック。アニメーションは上記 `modal` と同じく `animation` プロパティ依存になる。
- **用途**: タブやネスト navigator のコンテキストを残したままモーダル表示したいとき。基本的にはまず `modal` の利用を検討し、コンテキスト保持が必須な場合に選択する。

### `containedTransparentModal`

- **iOS**: `UIModalPresentationOverCurrentContext` を使用 ([React Navigation の native-stack `presentation`](https://reactnavigation.org/docs/native-stack-navigator/#presentation))。`transparentModal` の "current context 限定" 版で、透過のまま presentation context の bounds 内に重ねる。`transparentModal` 同様、UIKit のデフォルトでは sheet ジェスチャーを持たないので自前で背景タップ等の dismiss 手段を実装する。
- **Android**: `transparentModal` にフォールバック。
- **用途**: iOS で nested navigator の中だけにスコープした透過 modal を実装したいケース。Android では `transparentModal` と差がない。

### `fullScreenModal`

- **iOS**: `UIModalPresentationFullScreen` を使用 ([React Navigation の native-stack `presentation`](https://reactnavigation.org/docs/native-stack-navigator/#presentation))。画面全体を完全に覆う。**React Navigation 公式に「ジェスチャーで dismiss できない」 (`"A screen using this presentation style can't be dismissed by gesture."`) と明記されている** ため、swipe で閉じない挙動はライブラリの保証として依拠できる。閉じる手段は明示的に用意する必要がある。
- `containedModal` との違い: `containedModal` は presentation context の bounds 内に収まるのに対し、`fullScreenModal` は presentation context に関係なく画面全体を覆う。
- **Android**: `modal` にフォールバック。戻るボタン / システム戻るジェスチャーで閉じる挙動が残る。Android では「閉じさせない」は iOS と同等には強制できない。アニメーションは上記 `modal` と同じく `animation` プロパティ依存。
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
- 本プロジェクトのサンプル実装: ホームタブ「ナビゲーションパターン」から開くと、各値の素の挙動を iOS / Android で比較できる。
  - **ホーム Stack 配下** (`apps/sandbox/src/app/(tabs)/(home)/navigation-patterns/`)
    - `card.tsx` → デフォルト push
    - `contained-modal.tsx` → `presentation: "containedModal"`
    - `contained-transparent-modal.tsx` → `presentation: "containedTransparentModal"` + `animation: "fade"`
  - **ルート Stack 配下** (`apps/sandbox/src/app/navigation-patterns/`)
    - `modal.tsx` → `presentation: "modal"`
    - `transparent-modal.tsx` → `presentation: "transparentModal"` + `animation: "fade"`
    - `full-screen-modal.tsx` → `presentation: "fullScreenModal"` + `gestureEnabled: false`
    - `form-sheet.tsx` → `presentation: "formSheet"` + `sheetGrabberVisible: true`
- `containedModal` / `containedTransparentModal` をタブ内側 Stack に置いている理由は [`screen-options.md`](./screen-options.md#例外-containedmodal--containedtransparentmodal-はタブ内側-stack-配下) を参照。`contained*` 独自の「presentation context の bounds 内に収まる (タブバーが残る)」挙動を iOS で観察するための配置です。

## 参考リンク

- React Navigation Native Stack Navigator `presentation`: <https://reactnavigation.org/docs/native-stack-navigator/#presentation>
- Expo Router Stack: <https://docs.expo.dev/router/advanced/stack/>
- react-native-screens 4.0 リリースノート (formSheet など): <https://blog.swmansion.com/introducing-react-native-screens-4-0-0-1b833ff98a55>
