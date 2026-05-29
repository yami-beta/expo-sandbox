import { Link, type LinkProps } from "expo-router";
import type { ReactElement, ReactNode } from "react";
import type { StyleProp, TextStyle } from "react-native";
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
  const textStyle: StyleProp<TextStyle> = [
    underline ? { textDecorationLine: "underline" } : null,
    style,
  ];

  if (disabled) {
    return (
      <ThemedText type={type} tone="disabled" weight={weight} align={align} style={textStyle}>
        {children}
      </ThemedText>
    );
  }

  return (
    <Link href={href}>
      <ThemedText type={type} tone="accent" weight={weight} align={align} style={textStyle}>
        {children}
      </ThemedText>
    </Link>
  );
}
