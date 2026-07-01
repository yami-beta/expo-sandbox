import type { ConfigContext, ExpoConfig } from "expo/config";

// app.json を base に読み込み、E2E ビルド時（E2E_BUILD=true）だけ expo-dev-client の
// config plugin を追記する dynamic config。通常の expo run / 配布用 dev build
// （eas.json の development プロファイル）には影響しない。
//
// E2E では Dev Client を Metro に自動接続させ、テストを阻害するオーバーレイを抑止する:
// - defaultLaunchURL: launcher を経由せず直接 Metro へ接続（launchMode=most-recent の
//   fallback としても効くため clearState 後も再接続する）
// - skipOnboarding / showMenuAtLaunch / toolsButton: オンボーディング・起動時メニュー・
//   フローティングツールボタンが assert を阻害しないよう無効化する
// 詳細は docs/maestro.md を参照。
export default ({ config }: ConfigContext): ExpoConfig => {
  const plugins = [...(config.plugins ?? [])];

  if (process.env.E2E_BUILD === "true") {
    const devClientPlugin: [string, Record<string, unknown>] = [
      "expo-dev-client",
      {
        skipOnboarding: true,
        showMenuAtLaunch: false,
        toolsButton: false,
        defaultLaunchURL: "http://localhost:8081",
      },
    ];
    plugins.push(devClientPlugin);
  }

  return {
    ...config,
    name: config.name ?? "sandbox",
    slug: config.slug ?? "sandbox",
    plugins,
    extra: {
      ...config.extra,
      // E2E ビルドでアプリの表示言語を固定するための既定値（src/i18n.ts が参照）。
      // 通常ビルドでは未設定 → undefined になり従来どおり "system"（端末ロケール依存）になる。
      // expo-constants の Gradle/Xcode ビルドタスクは毎ビルド app.config を再評価して埋め込むため、
      // Dev Client 経由（expo run）でも非 Dev Client 経由（eas build --local）でも確実に反映される。
      e2eDefaultLocale: process.env.E2E_DEFAULT_LOCALE,
    },
  };
};
