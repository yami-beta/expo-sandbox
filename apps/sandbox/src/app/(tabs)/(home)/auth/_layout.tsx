import { Stack } from "expo-router";
import { buildStackScreenOptions } from "../../../../theme/navigationScreenOptions";
import { SessionProvider } from "../../../../features/auth/SessionContext";
import { useSession } from "../../../../features/auth/useSession";
import { useTheme } from "../../../../theme/useTheme";

export default function AuthLayout() {
  return (
    <SessionProvider>
      <AuthStackNavigator />
    </SessionProvider>
  );
}

function AuthStackNavigator() {
  const { colorScheme, tokens } = useTheme();
  const { isLoading, session } = useSession();
  // isLoading 中は両方の guard が true になり index/sign-in が同時に有効なルートになる
  // (各画面が isLoading を見て内部でローディング表示に倒すため実データは漏れない)。
  // isLoading をどちらか一方の条件だけに単純化しないこと: そうすると保存済みセッションの
  // 解決前 (session はまだ null) は sign-in 側だけが有効になり、解決後に session があれば
  // 一瞬 sign-in 画面が表示されてから index へジャンプする、というチラつきが発生する。
  return (
    <Stack screenOptions={buildStackScreenOptions(tokens.color, colorScheme)}>
      <Stack.Protected guard={isLoading || !!session}>
        <Stack.Screen name="index" />
      </Stack.Protected>
      <Stack.Protected guard={isLoading || !session}>
        <Stack.Screen name="sign-in" />
      </Stack.Protected>
    </Stack>
  );
}
