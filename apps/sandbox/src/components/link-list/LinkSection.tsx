import {
  Children,
  Fragment,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useMemo,
} from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../../theme/useTheme";
import { ThemedText } from "../themed-text/ThemedText";
import { ICON_GAP, ICON_SLOT_WIDTH } from "./LinkListItem";
import { LinkSectionContext, type LinkSectionContextValue } from "./LinkSectionContext";

interface LinkSectionProps {
  title?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

const isLinkListItemElement = (
  child: ReactNode,
): child is ReactElement<{ leadingIcon?: ReactNode }> => isValidElement(child);

export function LinkSection({ title, footer, children }: LinkSectionProps): ReactElement {
  const { colorScheme, tokens } = useTheme();

  const childArray = Children.toArray(children).filter(isLinkListItemElement);
  const iconSlotReserved = childArray.some((child) => child.props.leadingIcon != null);

  const islandStyle = {
    backgroundColor: tokens.color.background.surface,
    borderRadius: tokens.radius.lg,
    ...(colorScheme === "dark"
      ? {
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: tokens.color.border.subtle,
        }
      : tokens.shadow.sm),
  };

  const separatorInset = tokens.spacing.lg + (iconSlotReserved ? ICON_SLOT_WIDTH + ICON_GAP : 0);

  const contextValue = useMemo<LinkSectionContextValue>(
    () => ({ iconSlotReserved }),
    [iconSlotReserved],
  );

  return (
    <LinkSectionContext.Provider value={contextValue}>
      <View>
        {title ? (
          <ThemedText
            type="caption"
            tone="tertiary"
            style={[
              styles.title,
              { paddingHorizontal: tokens.spacing.lg, paddingBottom: tokens.spacing.sm },
            ]}
          >
            {title}
          </ThemedText>
        ) : null}

        <View style={[styles.island, islandStyle]}>
          {childArray.map((child, index) => (
            <Fragment key={child.key}>
              {index > 0 ? (
                <View
                  style={{
                    height: StyleSheet.hairlineWidth,
                    marginLeft: separatorInset,
                    backgroundColor: tokens.color.border.subtle,
                  }}
                />
              ) : null}
              {child}
            </Fragment>
          ))}
        </View>

        {footer ? (
          <ThemedText
            type="caption"
            tone="tertiary"
            style={{ paddingHorizontal: tokens.spacing.lg, paddingTop: tokens.spacing.sm }}
          >
            {footer}
          </ThemedText>
        ) : null}
      </View>
    </LinkSectionContext.Provider>
  );
}

const styles = StyleSheet.create({
  title: {
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  island: {
    overflow: "hidden",
  },
});
