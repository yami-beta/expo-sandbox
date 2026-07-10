# E2E テスト（Maestro）

[Maestro](https://maestro.dev/) を使った UI 自動テスト（E2E）の構成と運用。`apps/sandbox` の起動〜画面表示を
Pull Request ごと（`e2e.yml`）と main ブランチへの push ごと（`e2e-main.yml`）に自動検証する。
jest-expo / Vitest のユニットテスト（[`testing.md`](./testing.md)）とは別系統。

## 方針

- **EAS のリモートビルドクレジットは使わない**。ビルドはすべて `eas build --local`（GitHub Actions の
  Linux ランナー上でローカル gradle ビルド）で完結し、リモートビルド分を消費しない。ただしローカル
  ビルドでも EAS への認証（`EXPO_TOKEN`）は必要（プロジェクト `@account/slug` の存在確認で EAS と通信する
  ため）。PR（dev-client debug / `development` プロファイル）・main の release E2E（`e2e` プロファイル）・
  main の APK 温めジョブ（dev-client / `development`）いずれも `secrets.EXPO_TOKEN` を使う。
- **PR は Development Build（Dev Client / Metro 接続）でテストする**。ローカル開発と前提を揃え、release
  ではなく debug ビルドにすることでビルド時間も短縮する。dev-client debug ビルドには eas.json の
  `development` プロファイル（`developmentClient: true` → Android は `:app:assembleDebug` = APK）を再利用し、
  CI では `eas build --local --profile development` でビルドする。Dev Client（`developmentClient: true`）は
  本来起動時に Metro dev server を探す launcher 画面が出るが、Maestro フロー側でディープリンクを送り
  **launcher を経由せず Metro へ再接続**させる（後述）。
- **expo-dev-client の config plugin は常時適用する（E2E ビルド専用の分岐は無い）**。
  `apps/sandbox/app.config.ts`（dynamic config）が Dev Client を含むすべてのビルド
  （通常の `expo run` / 配布用 dev build / CI の E2E ビルド）に対して次を常時設定する:
  - `skipOnboarding: true` / `showMenuAtLaunch: false` / `toolsButton: false`: オンボーディング・
    起動時のデベロッパーメニュー・フローティングツールボタンが assert を阻害しないよう無効化する。
    これらは以前 `E2E_BUILD=true` のときだけ有効化していたが、`expo-dev-menu` は
    `showMenuAtLaunch`/`skipOnboarding` の既定値がいずれも「表示する」側（OR 条件でどちらか一方でも
    満たせばメニューが自動表示される）で、`clearState` 後は毎回この既定値に戻ってしまうため、
    E2E ビルドだけに閉じずすべてのビルドで常時無効化することにした（CI が経験したことのない
    「メニュー自動表示」を新たに持ち込むリスクを避けるため）。
  - Metro への接続（以前は `defaultLaunchURL` をビルド時に焼き込んでいた）は config plugin ではなく
    **Maestro フロー側のディープリンク**で行う。`expo-dev-launcher` は
    `<scheme>://expo-development-client/?url=<encoded>` 形式の VIEW インテントを受け取ると、
    ビルド時の設定に関わらずそのURLのMetroへ接続する。この仕組みは起動方法を分岐する共通サブフロー
    `apps/sandbox/.maestro/subflows/launch-app.yaml` に閉じており、Dev Client ビルドのときだけ
    （`-e DEV_CLIENT=true`）実行される（「フローの書き方」参照）。
- **フローは Dev Client あり/なしの両対応**。各テストフローは起動処理を自前で書かず
  `runFlow: subflows/launch-app.yaml` の1行を呼ぶだけで、`-e DEV_CLIENT` を渡すかどうかだけで
  両方のビルド種別に対応する（「フローの書き方」参照）。
  Dev Client を含まない E2E（`e2e` プロファイル / release / 埋め込み JS）は
  `.github/workflows/e2e-main.yml` で main ブランチへの push 時に実行し、同じフローを再利用する。
- **release ビルドの lint を除外**（非 Dev Client 用 `e2e` プロファイル）。`developmentClient: false`
  は release variant でビルドされ、`lintVitalRelease`（lint）が CI ランナーのメモリを使い切って
  `OutOfMemoryError` で落ちる。lint は E2E ビルドに不要（品質チェックは oxlint / expo lint で別途実施）なため、
  `e2e` プロファイルの `android.gradleCommand` を `:app:assembleRelease -x lintVitalRelease` にして除外している。
  なお `developmentClient: false` は release variant のビルドであり、`expo-dev-launcher` 等の
  Dev Client 専用ネイティブコードは（config plugin の設定に関わらず）そもそも含まれない。
- **ネイティブ部分に変更が無ければビルドをスキップする**。dev-client debug APK を
  `eas build --local --profile development` でビルドし、`@expo/fingerprint` のハッシュ（依存関係・
  ネイティブコード・config plugin・app.json/app.config の設定が対象。JS/TSX のアプリケーションソースは
  対象外）を **exact-match キー**にした `actions/cache` で APK を永続化する。fingerprint が一致すれば
  `eas build --local` を丸ごとスキップして install に進む。多くの PR は JS のみの変更でネイティブ部分は
  変わらないため、この場合はビルドを避けられ、更新された JS は Metro（Dev Client 接続）が配信する。
  - **GitHub Actions のキャッシュはブランチスコープ**で、新規 PR ブランチが復元できるのは default ブランチ
    （main）が書き込んだキャッシュのみ。そのため `e2e-main.yml` に **dev-client APK 温めジョブ**
    （`warm-devclient-cache`）を置き、main への push ごとに PR と同一 fingerprint / 同一 profile で APK を
    先にキャッシュへ投入する。これによりネイティブ変更の無い PR は**初回プッシュから**ヒットできる。
    fingerprint が変わる（ネイティブ変更のある）PR のみ、そのコミットで一度ビルドが発生する。
  - `apps/sandbox/.fingerprintignore` でビルド中に内容が変わり誤検出（無駄な MISS）を招く既知のファイルを
    除外している。原因・調査内容はファイル内のコメントを参照。今後同様のパッケージが
    見つかった場合はこのファイルに追記する。

## 構成ファイル

| ファイル | 役割 |
| --- | --- |
| `apps/sandbox/app.config.ts` | dynamic config。`expo-dev-client` plugin（`skipOnboarding` / `showMenuAtLaunch` / `toolsButton`）を常時追記する。`E2E_DEFAULT_LOCALE` を `extra.e2eDefaultLocale` に埋め込み `src/i18n/locale.ts` の既定言語フォールバックへ渡す（こちらは通常ビルドでは未設定） |
| `apps/sandbox/.fingerprintignore` | dev-client APK キャッシュのキーに使う `@expo/fingerprint` の計算から除外するパス。ビルドで内容が変わり無駄な MISS を招く既知のファイル（`@react-native-masked-view/masked-view` の `AndroidManifest.xml` 等）を列挙 |
| `apps/sandbox/eas.json` の `development` プロファイル | PR の dev-client debug E2E ビルドに再利用（`developmentClient: true` → Android は `:app:assembleDebug` = APK） |
| `apps/sandbox/eas.json` の `e2e` プロファイル | 非 Dev Client 用（main の release E2E）ビルド設定（`developmentClient: false` / release で lint 除外 / `ios.simulator: true`） |
| `apps/sandbox/.maestro/*.yaml` | Maestro フロー。`appId: com.yamibeta.sandbox`。プラットフォーム・ビルド種別非依存（起動処理は `runFlow: subflows/launch-app.yaml` の1行に任せる。「フローの書き方」参照） |
| `apps/sandbox/.maestro/subflows/launch-app.yaml` | 起動方法をビルド種別で分岐する共通サブフロー。`DEV_CLIENT` に応じて `clearState` → ディープリンク（`openLink`）による Metro 接続を行うか、素の `launchApp: {clearState: true}` を実行するかを切り替える。各テストフローはこれを `runFlow` で呼ぶだけでよく、分岐ロジックを重複して書かない。`maestro test` はデフォルトでサブフォルダを走査しないため単独実行はされない |
| `.github/workflows/e2e.yml` | PR ごとに「fingerprint 計算 → APK キャッシュ復元／（ミス時）`eas build --local --profile development` → emulator 起動 → `expo run:android --binary <APK>`（install→Metro→`adb reverse`→dev-client 起動）→ `maestro test -e DEV_CLIENT=true`」を実行 |
| `.github/workflows/e2e-main.yml` | main への push ごとに、release E2E ジョブ（`eas build --local --profile e2e` → install → `maestro test`。Dev Client が無いため `-e DEV_CLIENT` は渡さない）と dev-client APK 温めジョブ（`warm-devclient-cache`。fingerprint → `eas build --local --profile development` → キャッシュ保存。build のみ）を並列実行 |

## フローの書き方

`apps/sandbox/.maestro/` に `*.yaml` を追加する（機能ごとに co-location）。アプリの起動処理は
自前で書かず、共通サブフロー `runFlow: subflows/launch-app.yaml` を最初に置くだけでよい:

```yaml
appId: com.yamibeta.sandbox
---
- runFlow: subflows/launch-app.yaml
- assertVisible: "ホーム"
```

`launch-app.yaml`（`apps/sandbox/.maestro/subflows/launch-app.yaml`）が `DEV_CLIENT` で
起動方法を分岐する:

```yaml
appId: com.yamibeta.sandbox
---
- runFlow:
    when:
      true: ${DEV_CLIENT == "true"}
    commands:
      - clearState
      - openLink: "exp+sandbox://expo-development-client/?url=http%3A%2F%2Flocalhost%3A8081"
    label: "Dev Client ビルドの場合はディープリンクで直接起動する（-e DEV_CLIENT=true のときのみ）"
- runFlow:
    when:
      true: ${DEV_CLIENT != "true"}
    commands:
      - launchApp:
          clearState: true
    label: "Dev Client を使わない場合（release / 埋め込み JS）は通常どおり起動する"
```

`-e DEV_CLIENT=true` を渡すと、`clearState`（独立コマンド。アプリを起動せず `pm clear` のみ）→
`openLink`（未起動の状態からディープリンクで直接コールドスタート）が実行され、Metro に接続した
状態でアプリが立ち上がる（`expo-dev-launcher` は `<scheme>://expo-development-client/?url=<encoded>`
形式の VIEW インテントを `isDevLauncherUrl` で検出し、指定 URL の Metro へ接続する。従来
`app.config.ts` の `defaultLaunchURL` がビルド時に焼き込んでいた効果をランタイムのディープリンクで
実現している）。渡さない場合（release / 埋め込み JS ビルド、あるいは Dev Client を使わずローカルで
動作確認する場合）は2つ目の `runFlow` が実行され、通常の `launchApp: {clearState: true}` で起動する。
`-e DEV_CLIENT` を渡すかどうかの分岐は `launch-app.yaml` の1ファイルに閉じており、CLI パラメータ
（`-e`）は `runFlow` のネスト（`smoke.yaml` → `launch-app.yaml`）をまたいでも自動的に引き継がれる
ため、各テストフロー側で `${DEV_CLIENT}` を意識する必要はない。`openLink` や Dev Client 専用の
分岐をテストフロー側や `launch-app.yaml` の2つの `runFlow` 以外に増やさないこと（フローの見た目上は
ビルド種別に依存する手順が無い状態を保ち、dual-mode を壊さないため）。

**`launchApp: {clearState: true}` の直後に別ステップで `openLink`（または `runFlow` 経由の
ディープリンク）を送る構成にしないこと。** 過去（b0810b4）に `launchApp(clearState)` →
`defaultLaunchURL` 経由の再接続という順序で、「ホーム」が一瞬表示された直後に空白になる flaky が
観測されていた。`defaultLaunchURL` をディープリンクに置き換える際、同じ「`launchApp` で一度
未接続の launcher 状態を作ってから別ステップで接続し直す」構成を試したところ、実機検証
（Pixel_9_Pro_API_35 emulator）で同様の遅延（素の `assertVisible` の既定7秒リトライでは
タイムアウトし、実際には十数秒後に表示される）が再発した。上記のように
`clearState`（独立コマンド）→ `openLink` による直接コールドスタートという構成に変更したところ、
同じ実機検証で素の `assertVisible` のみ・3回連続成功した（1回あたり15〜24秒）ため、
`extendedWaitUntil` によるタイムアウト延長は行わない。

### ロケールに関する注意

アプリの表示テキストは lingui の `<Trans>`（`sourceLocale: ja`）で出力され、`src/i18n/locale.ts` が
言語設定を解決して適用する。保存された言語設定が無いときの既定は通常 `"system"`（`detectLocale()`
がデバイスのロケールを見て `ja` / `en` を解決）だが、**E2E ビルドでは `E2E_DEFAULT_LOCALE`
環境変数で既定言語を上書き**する（現状 `ja`）。`apps/sandbox/app.config.ts`（dynamic config）が
これを読んで `extra.e2eDefaultLocale` に埋め込み、`expo-constants`（`Constants.expoConfig.extra`）
経由で `getStoredLocalePreference()` の（保存値が無いときの）フォールバックとして参照される。
`expo-constants` のビルドタスクは Gradle/Xcode ビルドのたびに `app.config` を再評価して埋め込むため、
Dev Client 経由（`expo run`）でも非 Dev Client 経由（`eas build --local`）でも確実に反映される
（Metro の env インライン化のようなバンドラ依存の挙動ではない）。

これにより emulator のロケールを動かす必要がなくなり（既定 `en-US` のまま）、CI から adb による
ロケール固定・フレームワーク再起動を撤廃した。アプリは常に日本語表示で起動するため、日本語で
assert（`ホーム` / `ナビゲーションパターン` / `コンポーネント`）できる。

- 「テスト時のみ既定言語が `ja` になる」分岐は `src/i18n/locale.test.ts`（`resolveDefaultPreference`）で担保する。
- 端末ロケール → アプリ言語の解決（`"system"` 経路）は emulator ロケールを動かさないため E2E では
  検証せず、ユニットテスト（`resolveLocale("system")`）でカバーする。
- 言語切替 UI そのものの E2E は現状スコープ外。将来言語別フローを足す場合、タブは `NativeTabs`
  （`expo-router/unstable-native-tabs`）に `testID` を付けられないため、タブ遷移だけ可視ラベルの
  text 正規表現（例 `設定|Settings`）に頼る点に留意する。

## ローカルで実行する

事前に **Android SDK / Maestro CLI / 起動済み emulator（ロケールは任意。既定 en-US でよい。
アプリ言語は `E2E_DEFAULT_LOCALE=ja` で固定する）** が必要。
Maestro CLI が未インストールなら `curl -fsSL "https://get.maestro.mobile.dev" | bash`。

### Dev Client 経路（推奨・ローカル開発と同一ビルドをそのまま使う）

`expo-dev-client` の config plugin は常時適用されるため、E2E 専用のビルドは無い。普段の開発で
使っている Dev Client ビルド（`pnpm --dir apps/sandbox android` あるいは既にインストール済みなら
`pnpm --dir apps/sandbox start`）をそのまま使い、Maestro 実行時にだけ `-e DEV_CLIENT=true` を渡す。

```bash
# 1. 普段どおり Dev Client ビルドを用意する（インストール済みなら Metro 起動だけでよい）
pnpm --dir apps/sandbox exec expo run:android

# 2. 別ターミナルでフローを実行する（-e DEV_CLIENT=true でディープリンクによる Metro 再接続が有効になる）
maestro test -e DEV_CLIENT=true apps/sandbox/.maestro/
```

> CI（`e2e.yml`）は同じ dev-client debug ビルドを `eas build --local --profile development` で作り
> （emulator を伴わない main の温めジョブと同一のビルドを再利用）、その APK を
> `expo run:android --binary <APK>` に渡して install→Metro→`adb reverse`→dev-client 起動まで行う
> （`--binary` で Gradle ビルドはスキップ。素の `adb install` + `expo start` では dev-client が Metro に
> 接続せず黒画面になるため、接続確立を含む run:android の launch ロジックを使う）。CI と同じ経路を手元で
> 再現したい場合は、上の Dev Client 経路（`expo run:android`）をそのまま使えばよい。

### 非 Dev Client 経路（main 互換の回帰確認）

EAS CLI（`npm i -g eas-cli`）と EAS ログイン（`eas login`）が必要。`.github/workflows/e2e-main.yml`
が CI で実行しているのと同じ経路。

```bash
# 1. e2e プロファイルで APK をローカルビルド（Dev Client 無し・Metro 不要）
#    非 Dev Client でも E2E_DEFAULT_LOCALE=ja をビルド時に設定すると app.config.ts 経由で
#    extra.e2eDefaultLocale に埋め込まれる（expo-constants のビルドタスクが毎ビルド再評価するため
#    Dev Client 経路と同じ仕組みで確実に反映される）。
E2E_DEFAULT_LOCALE=ja pnpm --dir apps/sandbox exec eas build --local --profile e2e --platform android \
  --non-interactive --output ./build-output/sandbox-e2e.apk

# 2. 起動済みの emulator に install（emulator が無ければ別途 `emulator -avd <name>` で起動）
adb install -r apps/sandbox/build-output/sandbox-e2e.apk

# 3. 同じフローを実行（Metro 不要、-e DEV_CLIENT は渡さない）
maestro test apps/sandbox/.maestro/
```

## CI（`.github/workflows/e2e.yml`）

- トリガー: `apps/sandbox/**` などを変更する PR（dependabot は除外。`eas build --local` に必要な
  `secrets.EXPO_TOKEN` が fork/dependabot には渡らないため）。
- サードパーティ Action は使わず、GitHub / Gradle / Expo / pnpm の公式 Action と、ubuntu-latest に
  プリインストール済みの Android SDK ツール（`sdkmanager` / `avdmanager` / `emulator` / `adb`）のみで構成。
- **ステップ順**: `Setup EAS`（`EXPO_TOKEN`）→ fingerprint 計算（`@expo/fingerprint` の CLI
  `pnpm exec fingerprint fingerprint:generate --platform android`。pnpm-lock.yaml 固定で決定的・EAS 認証不要）→
  `actions/cache`（キー `e2e-android-devclient-apk-x86_64-<hash>`）→ ミス時のみ
  `eas build --local --profile development`（dev-client debug APK）→ emulator 起動 →
  `expo run:android --binary <APK>`（install→Metro 起動→`adb reverse`→dev-client 起動を一括。`--binary` で
  Gradle ビルドはスキップ）→ アプリ起動（MainActivity）と Metro readiness を待って
  `maestro test -e DEV_CLIENT=true`（`clearState` 後にディープリンクで直接コールドスタートし
  Metro へ接続する）。テスト後は `expo run:android`（Metro 含む）を kill する。
- **`adb install` + `expo start` の手組みは使わない**。dev-client の初回起動（`expo run:android` が
  自身で行う Metro 接続）は run:android 自体の launch ロジックに任せる必要があり（素の `adb install` +
  `expo start` では Metro に接続せず黒画面になる）、`--binary` で Gradle ビルドのみスキップして
  このロジックを再利用する。dev-client 起動後の Metro 接続確立は run:android が担い、maestro の
  `clearState` で状態がクリアされた後の再接続は `-e DEV_CLIENT=true` によるディープリンク
  （`apps/sandbox/.maestro/subflows/launch-app.yaml`）が担う。
- `E2E_DEFAULT_LOCALE` は fingerprint 計算・ビルド・`expo run:android` の各ステップに
  step `env` として同じ値（`ja`）を渡す。dev-client では `Constants.expoConfig` が Metro 配信の
  manifest 由来のため、run:android が起動する Metro にも渡して app.config を同条件で評価させる（既定言語が `ja`）。
- アプリの言語は `E2E_DEFAULT_LOCALE=ja` で固定するため、adb によるロケール固定は行わない
  （emulator ロケールは既定 en-US のまま）。
- **ANR 対策に CI 用軽量イメージ `google_atd`（Automated Test Device）を使う**。低速な CI emulator
  （swiftshader）ではアプリ起動時の初回バンドル生成（CPU スパイク）が emulator を飢えさせ、
  通常イメージ（`google_apis`）だと SystemUI/Launcher が ANR してテストを阻害する。ATD は不要な
  システムアプリ/サービスを削った軽量イメージで、同じ CPU スパイク下でもシステムプロセスが応答しやすく
  ANR しにくい。
- `ORG_GRADLE_PROJECT_reactNativeArchitectures=x86_64` でビルド ABI を emulator の `arch` と一致させている
  （install 可能・ビルド時間短縮）。emulator には `-memory 6144 -cores 4` を付与。
- 失敗時も `maestro-report.xml`（JUnit）・`--debug-output` のスクショ/録画/ログ・`expo-run.log`・
  画面診断（スクショ/ロケール/前面 activity/UI テキスト）を artifact に保存する。
- Maestro CLI は再現性のためバージョン固定（`MAESTRO_VERSION`）。更新は意図的に PR で上げる。
- **APK ビルドキャッシュ**: fingerprint（`@expo/fingerprint`）のハッシュを **exact-match キー**
  （`e2e-android-devclient-apk-x86_64-<hash>`）にして `actions/cache` でビルド済み APK を永続化する。fingerprint が
  変われば別キーになり、正しくミスして `eas build --local` で作り直し保存する（成長型キャッシュや
  `restore-keys` は使わない）。ヒット/ミスは `Summarize APK cache result` ステップが Job Summary に表示する。
  新規 PR ブランチが初回から復元できるよう、キャッシュは `e2e-main.yml` の温めジョブが main で先に投入する
  （下記）。キャッシュミス時は `eas build --local` に安全にフォールバックする。

## CI（`.github/workflows/e2e-main.yml`）

- トリガー: `main` への push（`apps/sandbox/**` などの paths フィルタは `e2e.yml` と同様）。
  手動検証用に `workflow_dispatch` も併設している。dependabot が `@dependabot merge` 等で
  直接 main に push した場合、actor が `dependabot[bot]` になり `secrets.EXPO_TOKEN` が渡らず
  `.github/actions/setup-eas` が明示エラーで失敗し main の E2E が恒常的に失敗するノイズに
  なりうるため、`e2e.yml` の dependabot 除外と同様に `if: github.actor != 'dependabot[bot]'`
  でジョブごと skip している。
- **2 つのジョブを並列実行する**。目的が異なる（release 検証 vs dev-client キャッシュ温め）ため独立させる。
- **`e2e-android`（release E2E ジョブ）**:
  - ビルドは `eas build --local --profile e2e --platform android`（本番相当の release ビルド・
    Dev Client 無し・埋め込み JS）で行う。`E2E_DEFAULT_LOCALE=ja` のみ設定する。
    `app.config.ts` の `expo-dev-client` plugin は常時有効だが、`e2e` プロファイル
    （`developmentClient: false`）は release variant でビルドするため Dev Client の
    ネイティブコード自体が含まれず影響しない。`maestro test` にも `-e DEV_CLIENT` を渡さない
    （Metro が無いため再接続ステップが不要。渡さなければ `runFlow` がスキップされるだけで安全）。
    EAS の認証には `.github/actions/setup-eas`（`secrets.EXPO_TOKEN`）を使う。
  - Metro は使わないため、build→install→起動の自動化は無い。ビルドした APK を `adb install` するだけで、
    アプリの起動自体は `apps/sandbox/.maestro/smoke.yaml` の `launchApp` に任せる。
  - artifact 名は `maestro-results-${{ github.sha }}`（push イベントには PR 番号が無いため）。
    失敗解析用にビルド済み APK も artifact に含める。
  - その他（emulator 起動・ANR 対策の `google_atd` イメージ・アニメーション無効化・診断情報採取など）は
    `e2e.yml` と同じロジックを再利用している。
- **`warm-devclient-cache`（dev-client APK 温めジョブ）**:
  - `e2e.yml` が使う dev-client debug APK のビルドキャッシュを main で温める。GitHub Actions のキャッシュは
    ブランチスコープで、新規 PR ブランチが復元できるのは default ブランチ（main）が書き込んだキャッシュのみ
    のため、main への push ごとに `e2e.yml` と**同一の fingerprint 計算・同一 profile（`development`）・
    同一キー（`e2e-android-devclient-apk-x86_64-<hash>`）**で APK を先にキャッシュへ投入する。
  - fingerprint 計算 → `actions/cache`（ヒットなら温め不要）→ ミス時のみ
    `eas build --local --profile development` の順。**emulator / Metro / maestro は使わず build のみ**なので
    release ジョブより軽い。ミス時に build した APK を post ステップの `actions/cache` が default ブランチ
    スコープへ保存し、以降の PR が復元できる。
- `concurrency.group` は PR 番号が存在しないため固定文字列 `e2e-main` を使用し、
  `cancel-in-progress: false` として実行中の検証を中断しない（GitHub Actions の concurrency 仕様上、
  保留は最新 1 件のみ残るためキューが際限なく積み上がることはない）。温めジョブの取りこぼしは次の
  main push で再温めされるため許容する。

## iOS を対象に追加する場合

- Dev Client なら macOS ランナーで `expo run:ios`（simulator）を使い、Maestro 実行時に
  `-e DEV_CLIENT=true` を渡す。非 Dev Client なら `e2e` プロファイル（`ios.simulator: true`）を
  `eas build --local --platform ios` でビルドする。
- ワークフローに macOS ランナーの `e2e-ios` ジョブを追加し、simulator を起動 → 上記でビルド/install →
  `maestro test` を実行する。フロー（`.maestro/*.yaml`）はそのまま再利用できる。
- iOS simulator は `localhost` が直接ホストを指すため `adb reverse` は不要（`expo run:ios` 経由なら
  Metro 接続も自動）。`apps/sandbox/.maestro/subflows/launch-app.yaml` のディープリンクも
  `http://localhost:8081` のまま Metro に接続できる。
