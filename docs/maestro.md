# E2E テスト（Maestro）

[Maestro](https://maestro.dev/) を使った UI 自動テスト（E2E）の構成と運用。`apps/sandbox` の起動〜画面表示を
Pull Request ごとに自動検証する。jest-expo / Vitest のユニットテスト（[`testing.md`](./testing.md)）とは別系統。

## 方針

- **EAS リモートビルドは使わない**。`eas build --local` で GitHub Actions の Linux ランナー上に APK を
  ビルドするため、EAS のビルドクレジットを消費しない。
- **Dev Client は使わない**。Dev Client（`developmentClient: true`）の APK は起動時に Metro dev server を
  探す launcher 画面が出て E2E が不安定になる。代わりに **e2e プロファイル**（`developmentClient: false`、
  JS バンドル埋め込み）でビルドし、Metro なしで単体起動する APK をテストする。この方式では Dev Client の
  ツールボタン・オンボーディング・デベロッパーメニューがそもそも表示されないため、無効化のための
  config plugin は不要。
- **release ビルドの lint を除外**。`developmentClient: false` は release variant でビルドされ、
  `lintVitalRelease`（lint）が CI ランナーのメモリを使い切って `OutOfMemoryError` で落ちる。lint は E2E
  ビルドに不要（品質チェックは oxlint / expo lint で別途実施）なため、`e2e` プロファイルの
  `android.gradleCommand` を `:app:assembleRelease -x lintVitalRelease` にして lint を除外している。

## 構成ファイル

| ファイル | 役割 |
| --- | --- |
| `apps/sandbox/eas.json` の `e2e` プロファイル | E2E 用 APK のビルド設定（Dev Client 無し / release ビルドで lint 除外 / `ios.simulator: true`） |
| `apps/sandbox/.maestro/*.yaml` | Maestro フロー。`appId: com.yamibeta.sandbox`。プラットフォーム非依存 |
| `.github/workflows/e2e.yml` | PR ごとに「local build → emulator 起動 → install → maestro test」を1ジョブで実行 |

## フローの書き方

`apps/sandbox/.maestro/` に `*.yaml` を追加する（機能ごとに co-location）。

```yaml
appId: com.yamibeta.sandbox
---
- launchApp:
    clearState: true
- assertVisible: "ホーム"
```

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

事前に **Android SDK / EAS CLI（`npm i -g eas-cli`）/ EAS ログイン（`eas login`）** が必要。

```bash
# 1. e2e プロファイルで APK をローカルビルド（Dev Client 無し・Metro 不要）
pnpm --dir apps/sandbox exec eas build --local --profile e2e --platform android \
  --non-interactive --output ./build-output/sandbox-e2e.apk

# 2. 起動済みの emulator（ロケールは ja-JP 推奨）に APK をインストール
#    emulator が無ければ別途 `emulator -avd <name>` で起動しておく
adb install -r apps/sandbox/build-output/sandbox-e2e.apk

# 3. Maestro CLI（未インストールなら）
curl -fsSL "https://get.maestro.mobile.dev" | bash

# 4. フローを実行
maestro test apps/sandbox/.maestro/
```

## CI（`.github/workflows/e2e.yml`）

- トリガー: `apps/sandbox/**` などを変更する PR（dependabot は除外）。
- サードパーティ Action は使わず、GitHub / Gradle / Expo / pnpm の公式 Action と、ubuntu-latest に
  プリインストール済みの Android SDK ツール（`sdkmanager` / `avdmanager` / `emulator` / `adb`）のみで構成。
- `eas build --local` の APK ABI（`x86_64`）と emulator の `arch` を一致させている。
- 失敗時も `maestro-report.xml`（JUnit）と `--debug-output` のスクショ/録画/ログを artifact に保存する。
- Maestro CLI は再現性のためバージョン固定（`MAESTRO_VERSION`）。更新は意図的に PR で上げる。

## iOS を対象に追加する場合

- `e2e` プロファイルは `ios.simulator: true` を持つため、`--platform ios` で simulator 向けにもビルドできる。
- ワークフローに macOS ランナーの `e2e-ios` ジョブを追加し、`xcrun simctl` で simulator を起動 → `.app` を
  インストール → `maestro test` を実行する。フロー（`.maestro/*.yaml`）はそのまま再利用できる。
