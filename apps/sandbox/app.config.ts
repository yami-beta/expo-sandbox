import type { ConfigContext, ExpoConfig } from "expo/config";

// app.json を base に読み込む dynamic config。
//
// expo-dev-client の launch 時オンボーディング・起動時デベロッパーメニュー・フローティング
// ツールボタンは Maestro E2E の assert を阻害するため常時無効化する（E2E ビルド専用の分岐は
// 設けず、通常の expo run / 配布用 dev build を含むすべての Dev Client ビルドに適用する）:
// - skipOnboarding / showMenuAtLaunch / toolsButton: オンボーディング・起動時メニュー・
//   フローティングツールボタンが assert を阻害しないよう無効化する
// この plugin エントリ自体は eas.json の全プロファイル（preview/production 含む）で評価されるが、
// developmentClient を有効にしないビルド（e2e/preview/production）は Dev Client のネイティブ
// コード自体を含まないため、上記オプションは実質的に無関係で影響しない。
//
// Metro への接続（従来 defaultLaunchURL で焼き込んでいたもの）はビルド設定ではなく、
// Maestro フロー側のディープリンク（apps/sandbox/e2e/common/launch-app.yaml）で
// 行う。詳細は docs/maestro.md を参照。
export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    name: config.name ?? "sandbox",
    slug: config.slug ?? "sandbox",
    plugins: [
      ...(config.plugins ?? []),
      ["expo-dev-client", { skipOnboarding: true, showMenuAtLaunch: false, toolsButton: false }],
    ],
    extra: {
      ...config.extra,
      // E2E ビルドでアプリの表示言語を固定するための既定値（src/i18n/locale.ts が参照）。
      // 通常ビルドでは未設定 → undefined になり従来どおり "system"（端末ロケール依存）になる。
      // expo-constants の Gradle/Xcode ビルドタスクは毎ビルド app.config を再評価して埋め込むため、
      // Dev Client 経由（expo run）でも非 Dev Client 経由（eas build --local）でも確実に反映される。
      e2eDefaultLocale: process.env.E2E_DEFAULT_LOCALE,
    },
  };
};
