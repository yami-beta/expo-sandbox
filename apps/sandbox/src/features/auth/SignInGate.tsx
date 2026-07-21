import { Link } from "expo-router";
import { Trans } from "@lingui/react/macro";
import type { ReactElement } from "react";
import { Button } from "../../components/button/Button";
import { ScreenScrollView } from "../../components/screen-scroll-view/ScreenScrollView";
import { ThemedText } from "../../components/themed-text/ThemedText";
import { SignInScreen } from "./SignInScreen";
import { useSession } from "./useSession";

// サインイン画面(app/sign-in.tsx)の表示切り替え。
// 認証済みで開かれた場合(既にサインイン済みの状態でホーム画面のリンク等から来た場合を含む)は
// SignInScreen ではなく、サインイン済みであることの確認とマイページへの導線を表示する。
export function SignInGate(): ReactElement {
  const { session } = useSession();

  if (session) {
    return (
      <ScreenScrollView>
        <ThemedText type="body">
          <Trans>サインインしています。</Trans>
        </ThemedText>
        <Link href="/account" asChild>
          <Button>
            <Trans>マイページへ</Trans>
          </Button>
        </Link>
      </ScreenScrollView>
    );
  }

  return <SignInScreen />;
}
