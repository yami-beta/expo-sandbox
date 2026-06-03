import { Link, type LinkProps } from "expo-router";
import type { ReactElement, ReactNode } from "react";
import { ThemedText, type ThemedTextProps } from "../themed-text/ThemedText";

export interface TextLinkProps {
  href: LinkProps["href"];
  children: ReactNode;
  type?: ThemedTextProps["type"];
  weight?: ThemedTextProps["weight"];
  align?: ThemedTextProps["align"];
  underline?: boolean;
  disabled?: boolean;
}

export function TextLink({
  href,
  children,
  type = "body",
  weight,
  align,
  underline = true,
  disabled,
}: TextLinkProps): ReactElement {
  if (disabled) {
    return (
      <ThemedText type={type} tone="disabled" weight={weight} align={align} underline={underline}>
        {children}
      </ThemedText>
    );
  }

  return (
    <Link href={href} accessibilityRole="link">
      <ThemedText type={type} tone="accent" weight={weight} align={align} underline={underline}>
        {children}
      </ThemedText>
    </Link>
  );
}
