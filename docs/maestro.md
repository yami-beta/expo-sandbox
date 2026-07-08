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
  本来起動時に Metro dev server を探す launcher 画面が出るが、**`defaultLaunchURL` を焼き込んで Metro へ
  自動接続**させることで launcher を経由せず起動する。
- **config plugin の設定は E2E ビルド時のみ適用する**。`apps/sandbox/app.config.ts`（dynamic config）が
  `E2E_BUILD=true` のときだけ `expo-dev-client` plugin を追記する。これにより通常の `expo run` や配布用
  dev build（`eas-build.yml` の `development` プロファイル）の開発体験には影響しない。E2E では次を設定:
  - `defaultLaunchURL: "http://localhost:8081"`: launcher を経由せず直接 Metro へ接続。`launchMode`
    （既定 `most-recent`）の fallback としても効くため、`clearState` 後の起動でも再接続する。
  - `skipOnboarding: true` / `showMenuAtLaunch: false` / `toolsButton: false`: オンボーディング・
    起動時のデベロッパーメニュー・フローティングツールボタンが assert を阻害しないよう無効化する。
- **フローは Dev Client あり/なしの両対応**。`defaultLaunchURL` による自動接続のおかげで、Maestro フローは
  単一の `launchApp` で済み、Dev Client あり（自動接続）/ なし（埋め込み JS）の両方が同じフローで通る。
  Dev Client を含まない E2E（`e2e` プロファイル / release / 埋め込み JS）は `.github/workflows/e2e-main.yml`
  で main ブランチへの push 時に実行し、同じフローを再利用する。
- **release ビルドの lint を除外**（非 Dev Client 用 `e2e` プロファイル）。`developmentClient: false`
  は release variant でビルドされ、`lintVitalRelease`（lint）が CI ランナーのメモリを使い切って
  `OutOfMemoryError` で落ちる。lint は E2E ビルドに不要（品質チェックは oxlint / expo lint で別途実施）なため、
  `e2e` プロファイルの `android.gradleCommand` を `:app:assembleRelease -x lintVitalRelease` にして除外している。
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
| `apps/sandbox/app.config.ts` | dynamic config。`E2E_BUILD=true` のときだけ `expo-dev-client` plugin（`defaultLaunchURL` 等）を追記。`E2E_DEFAULT_LOCALE` を `extra.e2eDefaultLocale` に埋め込み `src/i18n/locale.ts` の既定言語フォールバックへ渡す。通常ビルドはどちらも未設定 |
| `apps/sandbox/.fingerprintignore` | dev-client APK キャッシュのキーに使う `@expo/fingerprint` の計算から除外するパス。ビルドで内容が変わり無駄な MISS を招く既知のファイル（`@react-native-masked-view/masked-view` の `AndroidManifest.xml` 等）を列挙 |
| `apps/sandbox/eas.json` の `development` プロファイル | PR の dev-client debug E2E ビルドに再利用（`developmentClient: true` → Android は `:app:assembleDebug` = APK） |
| `apps/sandbox/eas.json` の `e2e` プロファイル | 非 Dev Client 用（main の release E2E）ビルド設定（`developmentClient: false` / release で lint 除外 / `ios.simulator: true`） |
| `apps/sandbox/.maestro/*.yaml` | Maestro フロー。`appId: com.yamibeta.sandbox`。プラットフォーム・ビルド種別非依存（単一 `launchApp`） |
| `.github/workflows/e2e.yml` | PR ごとに「fingerprint 計算 → APK キャッシュ復元／（ミス時）`eas build --local --profile development` → emulator 起動 → `adb install` → `expo start`（Metro）→ maestro test」を実行 |
| `.github/workflows/e2e-main.yml` | main への push ごとに、release E2E ジョブ（`eas build --local --profile e2e` → install → maestro）と dev-client APK 温めジョブ（`warm-devclient-cache`。fingerprint → `eas build --local --profile development` → キャッシュ保存。build のみ）を並列実行 |

## フローの書き方

`apps/sandbox/.maestro/` に `*.yaml` を追加する（機能ごとに co-location）。

```yaml
appId: com.yamibeta.sandbox
---
- launchApp:
    clearState: true
- assertVisible: "ホーム"
```

Dev Client（E2E ビルド）では `defaultLaunchURL` により `launchApp` だけで Metro へ自動接続するため、
`openLink` や Dev Client 専用の分岐は不要。同じフローが非 Dev Client ビルドでもそのまま動く。
launcher 操作などビルド種別に依存する手順をフローに書かないこと（dual-mode を壊さないため）。

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

### Dev Client 経路（推奨・ローカル開発と同一）

`E2E_BUILD=true` を付けて `expo run:android` すると、`app.config.ts` が E2E 用 config plugin を
有効化した Development Build をビルドし、Metro 起動・install・`adb reverse`・接続まで自動で行う。

```bash
# 1. E2E 設定の Development Build をビルド・install・Metro 起動（連続稼働）
#    E2E_DEFAULT_LOCALE=ja でアプリの言語既定値を ja に固定する
E2E_BUILD=true E2E_DEFAULT_LOCALE=ja pnpm --dir apps/sandbox exec expo run:android

# 2. 別ターミナルでフローを実行（Dev Client は defaultLaunchURL で Metro に自動接続）
maestro test apps/sandbox/.maestro/
```

> CI（`e2e.yml`）は同じ dev-client debug ビルドを `eas build --local --profile development` で作り、
> `adb install` → `expo start`（Metro）→ `adb reverse` の順で実行する（emulator を伴わない main の
> 温めジョブと同一のビルドを再利用するため）。CI と同じ経路を手元で再現したい場合は次を使う:
>
> ```bash
> E2E_BUILD=true E2E_DEFAULT_LOCALE=ja pnpm --dir apps/sandbox exec eas build --local \
>   --profile development --platform android --non-interactive \
>   --output ./build-output/sandbox-e2e-devclient.apk
> ```

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

# 3. 同じフローを実行（Metro 不要）
maestro test apps/sandbox/.maestro/
```

## CI（`.github/workflows/e2e.yml`）

- トリガー: `apps/sandbox/**` などを変更する PR（dependabot は除外。`eas build --local` に必要な
  `secrets.EXPO_TOKEN` が fork/dependabot には渡らないため）。
- サードパーティ Action は使わず、GitHub / Gradle / Expo / pnpm の公式 Action と、ubuntu-latest に
  プリインストール済みの Android SDK ツール（`sdkmanager` / `avdmanager` / `emulator` / `adb`）のみで構成。
- **ステップ順**: `Setup EAS`（`EXPO_TOKEN`）→ fingerprint 計算（`eas fingerprint:generate --json`）→
  `actions/cache`（キー `e2e-android-devclient-apk-x86_64-<hash>`）→ ミス時のみ
  `eas build --local --profile development`（dev-client debug APK）→ emulator 起動 →
  `adb install -r` → `expo start`（Metro を background 起動）→ `adb reverse tcp:8081 tcp:8081` →
  Metro readiness 待ち → `maestro test`。テスト後は `expo start`（Metro）を kill する。
- Dev Client は `defaultLaunchURL` により起動時に `localhost:8081` の Metro へ自動接続するため、
  明示的な初回 launch は不要（maestro の `launchApp` が起動を担う）。
- `E2E_BUILD` / `E2E_DEFAULT_LOCALE` は fingerprint 計算・ビルド・`expo start` の各ステップに step `env`
  として同じ値（`true` / `ja`）を渡す。dev-client では `Constants.expoConfig` が Metro 配信の manifest
  由来のため、`expo start` にも渡して app.config を同条件で評価させる（既定言語が `ja` になる）。
- アプリの言語は `E2E_DEFAULT_LOCALE=ja` で固定するため、adb によるロケール固定は行わない
  （emulator ロケールは既定 en-US のまま）。
- **ANR 対策に CI 用軽量イメージ `google_atd`（Automated Test Device）を使う**。低速な CI emulator
  （swiftshader）ではアプリ起動時の初回バンドル生成（CPU スパイク）が emulator を飢えさせ、
  通常イメージ（`google_apis`）だと SystemUI/Launcher が ANR してテストを阻害する。ATD は不要な
  システムアプリ/サービスを削った軽量イメージで、同じ CPU スパイク下でもシステムプロセスが応答しやすく
  ANR しにくい。
- `ORG_GRADLE_PROJECT_reactNativeArchitectures=x86_64` でビルド ABI を emulator の `arch` と一致させている
  （install 可能・ビルド時間短縮）。emulator には `-memory 6144 -cores 4` を付与。
- 失敗時も `maestro-report.xml`（JUnit）・`--debug-output` のスクショ/録画/ログ・`expo-start.log`・
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
    Dev Client 無し・埋め込み JS）で行う。`E2E_BUILD` は設定しない（`E2E_DEFAULT_LOCALE=ja` のみ設定）。
    設定すると `app.config.ts` が `expo-dev-client` plugin を有効化して Dev Client が混入するため。
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

- Dev Client なら macOS ランナーで `E2E_BUILD=true expo run:ios`（simulator）を使う。非 Dev Client なら
  `e2e` プロファイル（`ios.simulator: true`）を `eas build --local --platform ios` でビルドする。
- ワークフローに macOS ランナーの `e2e-ios` ジョブを追加し、simulator を起動 → 上記でビルド/install →
  `maestro test` を実行する。フロー（`.maestro/*.yaml`）はそのまま再利用できる。
- iOS simulator は `localhost` が直接ホストを指すため `adb reverse` は不要（`expo run:ios` 経由なら
  Metro 接続も自動）。`defaultLaunchURL: http://localhost:8081` のまま Metro に接続できる。
