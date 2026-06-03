import { useCallback, type ReactElement, type ReactNode } from "react";
import { Pressable, type PressableProps, StyleSheet, View, type ViewStyle } from "react-native";
import type { SemanticColorTokens } from "../../theme/tokens/colors";
import { useTheme } from "../../theme/useTheme";
import { type HapticStyle, usePressHaptics } from "../haptics/usePressHaptics";
import { Icon, type IconName } from "../icon/Icon";
import { ThemedText, type ThemedTextTone, type ThemedTextType } from "../themed-text/ThemedText";

export type ButtonVariant = "solid" | "soft" | "ghost" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leadingIcon?: IconName;
  disabled?: boolean;
  onPress?: PressableProps["onPress"];
  /** 押下時の触覚フィードバック。`true` で light、style 指定でその種類。Web は no-op。 */
  haptic?: HapticStyle | boolean;
  /**
   * SR 読み上げ用ラベル。children がアイコンのみで文言を持たない場合に
   * `t` マクロ経由（`accessibilityLabel={t`…`}`）で渡す。通常は children が担う。
   */
  accessibilityLabel?: string;
}

interface SizeSpec {
  paddingVertical: number;
  paddingHorizontal: number;
  gap: number;
  textType: ThemedTextType;
  iconSize: number;
}

const SIZE_SPECS: Record<ButtonSize, SizeSpec> = {
  // md は最小タッチターゲット 44pt を満たす (paddingVertical 10 + body lineHeight 24)
  sm: { paddingVertical: 6, paddingHorizontal: 12, gap: 6, textType: "label", iconSize: 16 },
  md: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 8,
    textType: "bodyEmphasis",
    iconSize: 18,
  },
  lg: { paddingVertical: 14, paddingHorizontal: 24, gap: 10, textType: "headline", iconSize: 22 },
};

interface VariantColors {
  background: string;
  backgroundPressed: string;
  /** Icon に渡す色文字列。ThemedText へは `textTone` を使う。 */
  text: string;
  /** ThemedText の tone。`text` と同じ意味色を semantic tone で表す。 */
  textTone: ThemedTextTone;
  border?: string | undefined;
}

function resolveVariantColors(
  variant: ButtonVariant,
  disabled: boolean,
  color: SemanticColorTokens,
): VariantColors {
  if (disabled) {
    const solidLike = variant === "solid" || variant === "soft";
    return {
      background: solidLike ? color.background.subtle : "transparent",
      backgroundPressed: solidLike ? color.background.subtle : "transparent",
      text: color.text.disabled,
      textTone: "disabled",
      border: variant === "outline" ? color.border.default : undefined,
    };
  }
  switch (variant) {
    case "solid":
      return {
        background: color.accent.solid,
        backgroundPressed: color.accent.solidHover,
        text: color.text.onAccent,
        textTone: "onAccent",
      };
    case "soft":
      return {
        background: color.accent.soft,
        backgroundPressed: color.accent.softHover,
        text: color.accent.text,
        textTone: "accent",
      };
    case "ghost":
      return {
        background: "transparent",
        backgroundPressed: color.accent.soft,
        text: color.accent.text,
        textTone: "accent",
      };
    case "outline":
      return {
        background: "transparent",
        backgroundPressed: color.accent.soft,
        text: color.accent.text,
        textTone: "accent",
        border: color.accent.solid,
      };
  }
}

/**
 * 汎用ボタン。`Pressable` + `ThemedText` をベースに variant / size / leadingIcon / disabled を持つ。
 * 色は `tokens.color.accent.*` ・ `background.*`、角丸は `tokens.radius.md`、押下は variant ごとの
 * pressed 背景で表現する。
 */
export function Button({
  children,
  variant = "solid",
  size = "md",
  leadingIcon,
  disabled = false,
  onPress,
  haptic,
  accessibilityLabel,
}: ButtonProps): ReactElement {
  const { tokens } = useTheme();
  const spec = SIZE_SPECS[size];
  const colors = resolveVariantColors(variant, disabled, tokens.color);

  const triggerHaptic = usePressHaptics(typeof haptic === "string" ? haptic : "light");
  const handlePress = useCallback<NonNullable<PressableProps["onPress"]>>(
    (event) => {
      if (haptic) {
        triggerHaptic();
      }
      onPress?.(event);
    },
    [haptic, triggerHaptic, onPress],
  );

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
    >
      {({ pressed }) => {
        const containerStyle: ViewStyle = {
          paddingVertical: spec.paddingVertical,
          paddingHorizontal: spec.paddingHorizontal,
          gap: spec.gap,
          borderRadius: tokens.radius.md,
          backgroundColor: pressed ? colors.backgroundPressed : colors.background,
          ...(colors.border
            ? { borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border }
            : null),
        };
        return (
          <View style={[styles.container, containerStyle]}>
            {leadingIcon ? (
              <Icon name={leadingIcon} size={spec.iconSize} color={colors.text} />
            ) : null}
            <ThemedText type={spec.textType} tone={colors.textTone}>
              {children}
            </ThemedText>
          </View>
        );
      }}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
