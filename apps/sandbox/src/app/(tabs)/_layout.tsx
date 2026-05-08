import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useLingui } from "@lingui/react/macro";
import { useThemeContext } from "../../theme/ThemeContext";

export default function TabLayout() {
  const { colors } = useThemeContext();
  const { t } = useLingui();

  return (
    <NativeTabs
      backgroundColor={colors.background}
      tintColor={colors.text}
      iconColor={{ default: colors.textSecondary, selected: colors.text }}
      labelStyle={{
        default: { color: colors.textSecondary },
        selected: { color: colors.text, fontWeight: "600" },
      }}
      indicatorColor={colors.backgroundElement}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon sf={{ default: "house", selected: "house.fill" }} md="home" />
        <NativeTabs.Trigger.Label>{t`ホーム`}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Icon
          sf={{ default: "gearshape", selected: "gearshape.fill" }}
          md="settings"
        />
        <NativeTabs.Trigger.Label>{t`設定`}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
