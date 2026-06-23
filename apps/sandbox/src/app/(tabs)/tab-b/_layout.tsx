import { Stack } from "expo-router";
import { useTheme } from "../../../theme/useTheme";
import { buildStackScreenOptions } from "../../../theme/navigationScreenOptions";

// tab-a と異なり anchor（unstable_settings）を指定しない対照。
// コールド起動のディープリンク（sandbox://tab-b/detail）で tab-b 配下の深い画面に入ると、
// index がスタック底に敷かれず detail が起点になるため「戻る」が出ない。
// アプリ内ナビゲーションでは anchor は無視されるので、この差はコールド起動時のみ現れる。
export default function TabBLayout() {
  const { colorScheme, tokens } = useTheme();

  return <Stack screenOptions={buildStackScreenOptions(tokens.color, colorScheme)} />;
}
