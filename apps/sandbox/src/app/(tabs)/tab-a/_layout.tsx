import { Stack } from "expo-router";
import { useTheme } from "../../../theme/useTheme";
import { buildStackScreenOptions } from "../../../theme/navigationScreenOptions";

// anchor（旧 initialRouteName）。効果が出るのは「コールド起動のディープリンク」時のみで、
// アプリ内ナビゲーションでは無視される。anchor: index なら sandbox://tab-a/detail で
// コールド起動しても index がスタック底に敷かれ、「戻る」で index に着地できる。
// tab-b は anchor を指定せず、この差（コールド起動時に戻れるか）を見比べる対照にしている。
// なお index は既定の初期ルートのため明示自体は冗長だが、対照として残している。
export const unstable_settings = { anchor: "index" };

export default function TabALayout() {
  const { colorScheme, tokens } = useTheme();

  return <Stack screenOptions={buildStackScreenOptions(tokens.color, colorScheme)} />;
}
