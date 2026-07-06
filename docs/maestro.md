# E2E テスト（Maestro）

[Maestro](https://maestro.dev/) を使った UI 自動テスト（E2E）の構成と運用。`apps/sandbox` の起動〜画面表示を
Pull Request ごと（`e2e.yml`）と main ブランチへの push ごと（`e2e-main.yml`）に自動検証する。
jest-expo / Vitest のユニットテスト（[`testing.md`](./testing.md)）とは別系統。

## 方針

- **EAS のビルドクレジットは PR では使わない**。PR は `expo run:android`（GitHub Actions の Linux ランナー上で
  ローカル gradle ビルド）で完結し、EAS リモートビルドや `EXPO_TOKEN` に依存しない。main ブランチ用の
  非 Dev Client `e2e` プロファイルのみ `eas build --local` を使う（`EXPO_TOKEN` が必要）。
- **PR は Development Build（Dev Client / Metro 接続）でテストする**。ローカル開発（`expo start` +
  `expo run:ios/android`）と前提を揃え、release ではなく debug ビルドにすることでビルド時間も短縮する。
  Dev Client（`developmentClient: true`）は本来起動時に Metro dev server を探す launcher 画面が出るが、
  **`defaultLaunchURL` を焼き込んで Metro へ自動接続**させることで launcher を経由せず起動する。
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
- **ネイティブ部分に変更が無ければ Gradle ビルドをスキップする**。`apps/sandbox/app.config.ts` が
  `E2E_BUILD=true` のときだけ `buildCacheProvider` に組み込みのローカル provider
  （`expo/local-build-cache-provider`）を設定する。`expo run:android` はネイティブのフィンガープリント
  （`@expo/fingerprint`。依存関係・ネイティブコード・config plugin・app.json/app.config の設定が対象。
  JS/TSX のアプリケーションソースは対象外）が前回と一致すればキャッシュ済みバイナリの install・Metro 起動まで
  内部で自動的に行い、フルビルドをスキップする。CI では `apps/sandbox/.expo/build-cache`（既定のキャッシュ
  保存先）を `actions/cache` で永続化する。多くの PR は JS のみの変更でネイティブ部分は変わらないため、
  この場合は毎回のフルビルドを避けられる。値は必ずオブジェクト形式 `{ plugin: "..." }` で指定すること
  （生文字列は `@expo/cli` に `Invalid build cache provider` として拒否される）。
  - `apps/sandbox/.fingerprintignore` でビルド中に内容が変わり誤検出を招く既知のファイルを
    除外している。原因・調査内容はファイル内のコメントを参照。今後同様のパッケージが
    見つかった場合はこのファイルに追記する。

## 構成ファイル

| ファイル | 役割 |
| --- | --- |
| `apps/sandbox/app.config.ts` | dynamic config。`E2E_BUILD=true` のときだけ `expo-dev-client` plugin（`defaultLaunchURL` 等）と `buildCacheProvider`（ネイティブビルドキャッシュ）を追記。`E2E_DEFAULT_LOCALE` を `extra.e2eDefaultLocale` に埋め込み `src/i18n/locale.ts` の既定言語フォールバックへ渡す。通常ビルドはどちらも未設定 |
| `apps/sandbox/.fingerprintignore` | ネイティブビルドキャッシュのフィンガープリント計算から除外するパス。ビルドで内容が変わり無限に MISS を招く既知のファイル（`@react-native-masked-view/masked-view` の `AndroidManifest.xml` 等）を列挙 |
| `apps/sandbox/eas.json` の `e2e` プロファイル | 非 Dev Client 用 E2E ビルド設定（`developmentClient: false` / release で lint 除外 / `ios.simulator: true`） |
| `apps/sandbox/.maestro/*.yaml` | Maestro フロー。`appId: com.yamibeta.sandbox`。プラットフォーム・ビルド種別非依存（単一 `launchApp`） |
| `.github/workflows/e2e.yml` | PR ごとに「emulator 起動 → `E2E_BUILD=true expo run:android`（build→install→Metro→接続）→ maestro test」を1ジョブで実行 |
| `.github/workflows/e2e-main.yml` | main への push ごとに「`eas build --local --profile e2e`（release / 埋め込み JS）→ emulator 起動 → APK install → maestro test」を1ジョブで実行 |

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

### Dev Client 経路（PR と同条件・推奨）

`E2E_BUILD=true` を付けて `expo run:android` すると、`app.config.ts` が E2E 用 config plugin を
有効化した Development Build をビルドし、Metro 起動・install・`adb reverse`・接続まで自動で行う。

```bash
# 1. E2E 設定の Development Build をビルド・install・Metro 起動（連続稼働）
#    E2E_DEFAULT_LOCALE=ja でアプリの言語既定値を ja に固定する
E2E_BUILD=true E2E_DEFAULT_LOCALE=ja pnpm --dir apps/sandbox exec expo run:android

# 2. 別ターミナルでフローを実行（Dev Client は defaultLaunchURL で Metro に自動接続）
maestro test apps/sandbox/.maestro/
```

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

- トリガー: `apps/sandbox/**` などを変更する PR（dependabot は除外）。
- サードパーティ Action は使わず、GitHub / Gradle / Expo / pnpm の公式 Action と、ubuntu-latest に
  プリインストール済みの Android SDK ツール（`sdkmanager` / `avdmanager` / `emulator` / `adb`）のみで構成。
- emulator 起動（ロケールは既定 en-US のまま）の後、`E2E_BUILD=true E2E_DEFAULT_LOCALE=ja
  expo run:android` を background 起動し、build→install→Metro 起動→`adb reverse`→アプリ起動までを
  一括で行う（ローカル開発と同一コマンド。EAS / EXPO_TOKEN は不要）。アプリ起動（MainActivity）と
  Metro readiness を待って maestro を実行し、テスト後は expo run（Metro 含む）を kill する。
- アプリの言語は `E2E_DEFAULT_LOCALE=ja` で固定するため、adb によるロケール固定は行わない
  （emulator ロケールは既定 en-US のまま）。
- **ANR 対策に CI 用軽量イメージ `google_atd`（Automated Test Device）を使う**。低速な CI emulator
  （swiftshader）ではアプリ起動時の初回バンドル生成（CPU スパイク）が emulator を飢えさせ、
  通常イメージ（`google_apis`）だと SystemUI/Launcher が ANR してテストを阻害する。ATD は不要な
  システムアプリ/サービスを削った軽量イメージで、同じ CPU スパイク下でもシステムプロセスが応答しやすく
  ANR しにくい。コマンドは素の `expo run:android` のままで、`nice` や pre-warm 等の小細工は使わない。
- `ORG_GRADLE_PROJECT_reactNativeArchitectures=x86_64` でビルド ABI を emulator の `arch` と一致させている。
  emulator には `-memory 6144 -cores 4` を付与。
- 失敗時も `maestro-report.xml`（JUnit）・`--debug-output` のスクショ/録画/ログ・`expo-run.log`・
  画面診断（スクショ/ロケール/前面 activity/UI テキスト）を artifact に保存する。
- Maestro CLI は再現性のためバージョン固定（`MAESTRO_VERSION`）。更新は意図的に PR で上げる。
- **ネイティブビルドキャッシュ**（`buildCacheProvider`）が使う `apps/sandbox/.expo/build-cache` を
  `actions/cache` で永続化する（`Restore native build cache` ステップ）。key は `github.run_id` で
  常にユニークにし `restore-keys` で直近のキャッシュを復元する成長型キャッシュとしている。固定キーだと
  `actions/cache` の「完全一致時は保存しない」仕様により、ネイティブ変更後も二度と更新されなくなるため。
  ヒット/ミスの判定は `expo-run.log` を要約する `Summarize native build cache result` ステップが
  Job Summary に表示する。異なるフィンガープリントのキャッシュエントリは自動削除されず
  `.expo/build-cache` は増え続けるが、GitHub 側の自動退役に任せている。キャッシュミス時は通常の
  フルビルドに安全にフォールバックする。

## CI（`.github/workflows/e2e-main.yml`）

- トリガー: `main` への push（`apps/sandbox/**` などの paths フィルタは `e2e.yml` と同様）。
  手動検証用に `workflow_dispatch` も併設している。`e2e.yml` にある dependabot 除外条件（PR の
  submitter 判定）はここでは付けていない。dependabot が `@dependabot merge` 等で直接 main に
  push した場合は actor が `dependabot[bot]` になり `secrets.EXPO_TOKEN` が渡らず
  `.github/actions/setup-eas` が明示エラーで失敗する経路が残るが、`eas-build-main.yml` も同じ
  制約を持っており今回新たに生じたものではない。
- ビルドは `eas build --local --profile e2e --platform android`（本番相当の release ビルド・
  Dev Client 無し・埋め込み JS）で行う。`E2E_BUILD` は設定しない（`E2E_DEFAULT_LOCALE=ja` のみ設定）。
  設定すると `app.config.ts` が `expo-dev-client` plugin と `buildCacheProvider` を有効化してしまい
  Dev Client が混入するため。EAS の認証には `.github/actions/setup-eas`（`secrets.EXPO_TOKEN`）を使う。
- Metro は使わないため、`expo run:android` のような build→install→起動の自動化は無い。ビルドした APK を
  `adb install` するだけで、アプリの起動自体は `apps/sandbox/.maestro/smoke.yaml` の `launchApp` に
  任せる（maestro test 実行前に明示的に起動する必要は無い）。
- `e2e.yml` が使うネイティブビルドキャッシュ（`buildCacheProvider`）は使わない（上記の通り
  `E2E_BUILD` を設定しないため）。そのため毎回フルの release ビルド相当になる。
- `concurrency.group` は PR 番号が存在しないため固定文字列 `e2e-main` を使用し、
  `cancel-in-progress: false` として実行中の検証を中断しない（GitHub Actions の concurrency 仕様上、
  保留は最新 1 件のみ残るためキューが際限なく積み上がることはない）。
- artifact 名は `maestro-results-${{ github.sha }}`（push イベントには PR 番号が無いため）。
  失敗解析用にビルド済み APK も artifact に含める。
- その他（emulator 起動・ANR 対策の `google_atd` イメージ・アニメーション無効化・
  診断情報採取など）は `e2e.yml` と同じロジックを再利用している。

## iOS を対象に追加する場合

- Dev Client なら macOS ランナーで `E2E_BUILD=true expo run:ios`（simulator）を使う。非 Dev Client なら
  `e2e` プロファイル（`ios.simulator: true`）を `eas build --local --platform ios` でビルドする。
- ワークフローに macOS ランナーの `e2e-ios` ジョブを追加し、simulator を起動 → 上記でビルド/install →
  `maestro test` を実行する。フロー（`.maestro/*.yaml`）はそのまま再利用できる。
- iOS simulator は `localhost` が直接ホストを指すため `adb reverse` は不要（`expo run:ios` 経由なら
  Metro 接続も自動）。`defaultLaunchURL: http://localhost:8081` のまま Metro に接続できる。
