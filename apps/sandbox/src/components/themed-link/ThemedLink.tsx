import { Link, type LinkProps } from "expo-router";
import type { ReactElement, ReactNode } from "react";
import { Pressable, type StyleProp, type TextStyle } from "react-native";
import { ThemedText, type ThemedTextProps } from "../themed-text/ThemedText";

export interface ThemedLinkProps {
  href: LinkProps["href"];
  children: ReactNode;
  type?: ThemedTextProps["type"];
  weight?: ThemedTextProps["weight"];
  align?: ThemedTextProps["align"];
  underline?: boolean;
  disabled?: boolean;
  style?: StyleProp<TextStyle>;
}

export function ThemedLink({
  href,
  children,
  type = "body",
  weight,
  align,
  underline = true,
  disabled,
  style,
}: ThemedLinkProps): ReactElement {
  return (
    <Link href={href} asChild>
      <Pressable disabled={disabled} accessibilityState={{ disabled: !!disabled }}>
        <ThemedText
          type={type}
          tone={disabled ? "disabled" : "accent"}
          weight={weight}
          align={align}
          style={[underline && { textDecorationLine: "underline" }, style]}
        >
          {children}
        </ThemedText>
      </Pressable>
    </Link>
  );
}
