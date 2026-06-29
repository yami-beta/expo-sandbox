# E2E テスト（Maestro）

[Maestro](https://maestro.dev/) を使った UI 自動テスト（E2E）の構成と運用。`apps/sandbox` の起動〜画面表示を
Pull Request ごとに自動検証する。jest-expo / Vitest のユニットテスト（[`testing.md`](./testing.md)）とは別系統。

## 方針

- **EAS のビルドクレジットは使わない**。PR は `expo run:android`（GitHub Actions の Linux ランナー上で
  ローカル gradle ビルド）で完結し、EAS リモートビルドや `EXPO_TOKEN` に依存しない。将来の非 Dev Client 用
  `e2e` プロファイルのみ `eas build --local` を使う。
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
  Dev Client を含まない E2E（`e2e` プロファイル / release / 埋め込み JS）は将来 main ブランチ or 定期実行で
  行う想定で、その際も同じフローを再利用する。
- **release ビルドの lint を除外**（将来の非 Dev Client 用 `e2e` プロファイル）。`developmentClient: false`
  は release variant でビルドされ、`lintVitalRelease`（lint）が CI ランナーのメモリを使い切って
  `OutOfMemoryError` で落ちる。lint は E2E ビルドに不要（品質チェックは oxlint / expo lint で別途実施）なため、
  `e2e` プロファイルの `android.gradleCommand` を `:app:assembleRelease -x lintVitalRelease` にして除外している。

## 構成ファイル

| ファイル | 役割 |
| --- | --- |
| `apps/sandbox/app.config.ts` | dynamic config。`E2E_BUILD=true` のときだけ `expo-dev-client` plugin（`defaultLaunchURL` 等）を追記。通常ビルドは `app.json` のまま |
| `apps/sandbox/eas.json` の `e2e` プロファイル | 将来の非 Dev Client 用 E2E ビルド設定（`developmentClient: false` / release で lint 除外 / `ios.simulator: true`） |
| `apps/sandbox/.maestro/*.yaml` | Maestro フロー。`appId: com.yamibeta.sandbox`。プラットフォーム・ビルド種別非依存（単一 `launchApp`） |
| `.github/workflows/e2e.yml` | PR ごとに「emulator 起動 → `E2E_BUILD=true expo run:android`（build→install→Metro→接続）→ maestro test」を1ジョブで実行 |

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

アプリの表示テキストは lingui の `<Trans>`（`sourceLocale: ja`）で出力され、`src/i18n.ts` の
`detectLocale()` がデバイスのロケールを見て `ja` / `en` を切り替える。emulator の既定は `en-US` で、
`-prop persist.sys.locale` では変更できないため、CI では boot 後に `adb root` + `setprop
persist.sys.locale ja-JP` + フレームワーク再起動（`stop; start`）で **ja-JP に固定**し、日本語表示で
assert（`ホーム` / `ナビゲーションパターン` / `コンポーネント`）する。再起動で初回起動が遅くなることが
あるため、最初の要素は `extendedWaitUntil` で長めに待つ。

現状アプリに `testID` は無い。フローが増えてテキスト依存が不安定になったら `testID` を付与して
ロケール非依存の assert に移行する。

## ローカルで実行する

事前に **Android SDK / Maestro CLI / 起動済み emulator（ロケールは ja-JP 推奨）** が必要。
Maestro CLI が未インストールなら `curl -fsSL "https://get.maestro.mobile.dev" | bash`。

### Dev Client 経路（PR と同条件・推奨）

`E2E_BUILD=true` を付けて `expo run:android` すると、`app.config.ts` が E2E 用 config plugin を
有効化した Development Build をビルドし、Metro 起動・install・`adb reverse`・接続まで自動で行う。

```bash
# 1. E2E 設定の Development Build をビルド・install・Metro 起動（連続稼働）
E2E_BUILD=true pnpm --dir apps/sandbox exec expo run:android

# 2. 別ターミナルでフローを実行（Dev Client は defaultLaunchURL で Metro に自動接続）
maestro test apps/sandbox/.maestro/
```

### 非 Dev Client 経路（将来 main 互換の回帰確認）

EAS CLI（`npm i -g eas-cli`）と EAS ログイン（`eas login`）が必要。

```bash
# 1. e2e プロファイルで APK をローカルビルド（Dev Client 無し・Metro 不要）
pnpm --dir apps/sandbox exec eas build --local --profile e2e --platform android \
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
- emulator 起動・ロケール ja-JP 固定の後、`E2E_BUILD=true expo run:android` を background 起動し、
  build→install→Metro 起動→`adb reverse`→アプリ起動までを一括で行う（ローカル開発と同一コマンド。
  EAS / EXPO_TOKEN は不要）。アプリ起動（MainActivity）と Metro readiness を待って maestro を実行し、
  テスト後は expo run（Metro 含む）を kill する。
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

## iOS を対象に追加する場合

- Dev Client なら macOS ランナーで `E2E_BUILD=true expo run:ios`（simulator）を使う。非 Dev Client なら
  `e2e` プロファイル（`ios.simulator: true`）を `eas build --local --platform ios` でビルドする。
- ワークフローに macOS ランナーの `e2e-ios` ジョブを追加し、simulator を起動 → 上記でビルド/install →
  `maestro test` を実行する。フロー（`.maestro/*.yaml`）はそのまま再利用できる。
- iOS simulator は `localhost` が直接ホストを指すため `adb reverse` は不要（`expo run:ios` 経由なら
  Metro 接続も自動）。`defaultLaunchURL: http://localhost:8081` のまま Metro に接続できる。
