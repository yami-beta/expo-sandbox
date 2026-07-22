import { Link } from "expo-router";
import { Trans } from "@lingui/react/macro";
import type { PropsWithChildren, ReactElement } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Button } from "../../components/button/Button";
import { ScreenScrollView } from "../../components/screen-scroll-view/ScreenScrollView";
import { ThemedText } from "../../components/themed-text/ThemedText";
import { useTheme } from "../../theme/useTheme";
import { useSession } from "./useSession";

type RequireAuthProps = PropsWithChildren<{
  // true にすると /sign-in への遷移を push ではなく replace で行う。
  // 既定は push: 任意の保護ページから開いた場合、サインイン後に戻るボタンで
  // 元のページへ戻れる(features/auth/RequireAuth.test.tsx 参照)。
  // account.tsx のように「サインイン画面とマイページが同じ認証状態を映す1箇所」を
  // 行き来するだけの画面では、push のままだと往復のたびにスタックが積み上がり続けるため
  // replace を指定する。
  replace?: boolean;
}>;

// 認証済みの場合は children をそのまま描画する(スクロール等のラップは呼び出し元の責務)。
export function RequireAuth({ children, replace = false }: RequireAuthProps): ReactElement {
  const { isLoading, session } = useSession();
  const { tokens } = useTheme();

  if (isLoading) {
    return (
      <ScreenScrollView>
        <View style={[styles.pendingRow, { gap: tokens.spacing.sm }]}>
          <ActivityIndicator color={tokens.color.text.secondary} />
          <ThemedText type="body" tone="secondary">
            <Trans>読み込み中…</Trans>
          </ThemedText>
        </View>
      </ScreenScrollView>
    );
  }

  if (!session) {
    return (
      <ScreenScrollView>
        <ThemedText type="body">
          <Trans>このページの閲覧にはサインインが必要です。</Trans>
        </ThemedText>
        <Link href="/sign-in" replace={replace} asChild>
          <Button>
            <Trans>サインイン画面へ</Trans>
          </Button>
        </Link>
      </ScreenScrollView>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  pendingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
});
