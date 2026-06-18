import type { ReactElement, ReactNode } from "react";
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { render, type RenderOptions } from "@testing-library/react-native";
import { ThemeProvider } from "../theme/ThemeContext";

// テスト用に lingui を最小構成で活性化する。
// 翻訳カタログ (.po) は読み込まず、メッセージ ID がそのまま描画される前提でアサートする。
i18n.loadAndActivate({ locale: "ja", messages: {} });

function AllProviders({ children }: { children: ReactNode }): ReactElement {
  return (
    <I18nProvider i18n={i18n}>
      <ThemeProvider>{children}</ThemeProvider>
    </I18nProvider>
  );
}

/**
 * アプリの Provider (I18nProvider / ThemeProvider) でラップして描画するテスト用 render。
 * クエリ (`screen` など) や `renderHook` は各テストから `@testing-library/react-native` を
 * 直接 import して使う (barrel file を避けるため再 export しない)。
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
): ReturnType<typeof render> {
  return render(ui, { wrapper: AllProviders, ...options });
}
