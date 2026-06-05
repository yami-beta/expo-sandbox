import { MaterialIcons } from "@react-native-vector-icons/material-icons/static";
import { SymbolView, type SymbolViewProps, type SymbolWeight } from "expo-symbols";
import type { ComponentProps, ReactElement } from "react";
import { Platform, type StyleProp, View, type ViewProps, type ViewStyle } from "react-native";
import { useTheme } from "../../theme/useTheme";

// SymbolViewProps["name"] は `SFSymbol | { ios; android; web }` の union。
// 文字列側 (SFSymbol) のみ取り出して registry の型に使う。
type SfSymbolName = Extract<SymbolViewProps["name"], string>;
type MaterialIconName = ComponentProps<typeof MaterialIcons>["name"];

interface IconDefinition {
  /** iOS: SF Symbols 名 */
  sf: SfSymbolName;
  /** Android / Web: Material Icons 名 */
  material: MaterialIconName;
}

/**
 * アプリ内で使うアイコンの semantic 名 → プラットフォーム別グリフのマッピング。
 * 利用側はこの semantic 名のみを意識すればよい (SF / Material の差異を吸収)。
 */
const ICONS = {
  "chevron-right": { sf: "chevron.right", material: "chevron-right" },
  gear: { sf: "gearshape", material: "settings" },
  palette: { sf: "paintbrush", material: "palette" },
  bell: { sf: "bell", material: "notifications" },
  heart: { sf: "heart", material: "favorite" },
  star: { sf: "star", material: "star" },
  trash: { sf: "trash", material: "delete" },
  info: { sf: "info.circle", material: "info" },
  grid: { sf: "square.grid.2x2", material: "grid-view" },
  download: { sf: "arrow.down.circle", material: "cloud-download" },
  document: { sf: "doc.text", material: "description" },
} as const satisfies Record<string, IconDefinition>;

export type IconName = keyof typeof ICONS;

export interface IconProps {
  name: IconName;
  /** @default 24 */
  size?: number;
  /** @default tokens.color.text.primary */
  color?: string;
  weight?: SymbolWeight;
  style?: StyleProp<ViewStyle>;
  /**
   * 意味を持つアイコン単体の SR 読み上げラベル。`t` マクロ経由（`accessibilityLabel={t`…`}`）で渡す。
   * 指定すると装飾扱い (`decorative`) より優先され、image 要素として読み上げられる。
   */
  accessibilityLabel?: string;
  /**
   * 装飾アイコンとして SR から隠す。テキスト併記時のグリフ名二重読み上げを防ぐ。
   * `accessibilityLabel` と未指定のときは現状どおり a11y 属性を付けない。
   * @default false
   */
  decorative?: boolean;
}

/**
 * `accessibilityLabel` / `decorative` から外側 View に載せる a11y 属性を導出する。
 * label を最優先 (意味アイコン) → decorative (隠す) → どちらも無ければ無指定 (現状維持)。
 */
function resolveAccessibilityProps(
  accessibilityLabel: string | undefined,
  decorative: boolean,
): Pick<
  ViewProps,
  | "accessible"
  | "accessibilityLabel"
  | "accessibilityRole"
  | "accessibilityElementsHidden"
  | "importantForAccessibility"
> {
  if (accessibilityLabel != null) {
    return { accessible: true, accessibilityLabel, accessibilityRole: "image" };
  }
  if (decorative) {
    return { accessibilityElementsHidden: true, importantForAccessibility: "no-hide-descendants" };
  }
  return {};
}

/**
 * プラットフォーム横断のアイコン。iOS は SF Symbols (`expo-symbols`)、
 * Android / Web は Material Icons (`@react-native-vector-icons/material-icons`) にフォールバックする。
 * `GroupedList` の `leadingIcon` や `Button` の icon で再利用する想定。
 */
export function Icon({
  name,
  size = 24,
  color,
  weight,
  style,
  accessibilityLabel,
  decorative = false,
}: IconProps): ReactElement {
  const { tokens } = useTheme();
  const resolvedColor = color ?? tokens.color.text.primary;
  const def = ICONS[name];
  const a11yProps = resolveAccessibilityProps(accessibilityLabel, decorative);

  // SymbolView は ViewStyle、MaterialIcons は TextStyle を取り両者の StyleProp は
  // 相互代入できないため、外側の View に ViewStyle を持たせ、グリフ自体は size/color で制御する。
  return (
    <View style={style} {...a11yProps}>
      {Platform.OS === "ios" ? (
        <SymbolView
          name={def.sf}
          size={size}
          tintColor={resolvedColor}
          {...(weight ? { weight } : null)}
        />
      ) : (
        <MaterialIcons name={def.material} size={size} color={resolvedColor} />
      )}
    </View>
  );
}
