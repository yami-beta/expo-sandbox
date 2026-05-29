import { Ionicons } from "@expo/vector-icons";
import { Link, type LinkProps } from "expo-router";
import { type ReactElement, type ReactNode, useContext } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "../../theme/useTheme";
import { ThemedText } from "../themed-text/ThemedText";
import { LinkSectionContext } from "./LinkSectionContext";

export const ICON_SLOT_WIDTH = 28;
export const ICON_GAP = 12;
const MIN_ROW_HEIGHT = 44;

interface CommonItemFields {
  text: ReactNode;
  description?: ReactNode;
  leadingIcon?: ReactNode;
  trailingBadge?: ReactNode;
}

export type LinkListItemProps =
  | (CommonItemFields & {
      href: LinkProps["href"];
      disabled?: false;
    })
  | (CommonItemFields & {
      disabled: true;
    });

export function LinkListItem(props: LinkListItemProps): ReactElement {
  const ctx = useContext(LinkSectionContext);
  const iconSlotReserved = ctx?.iconSlotReserved ?? false;

  if (props.disabled) {
    return <DisabledRow {...props} iconSlotReserved={iconSlotReserved} />;
  }
  return <LinkRow {...props} iconSlotReserved={iconSlotReserved} />;
}

interface LinkRowProps extends CommonItemFields {
  href: LinkProps["href"];
  iconSlotReserved: boolean;
}

function LinkRow({
  href,
  text,
  description,
  leadingIcon,
  trailingBadge,
  iconSlotReserved,
}: LinkRowProps): ReactElement {
  const { tokens } = useTheme();

  return (
    <Link href={href} asChild>
      <Pressable>
        {({ pressed }) => (
          <View
            style={[
              styles.row,
              {
                minHeight: MIN_ROW_HEIGHT,
                paddingHorizontal: tokens.spacing.lg,
                paddingVertical: 10,
                backgroundColor: pressed ? tokens.color.background.pressed : "transparent",
              },
            ]}
          >
            <RowContent
              text={text}
              description={description}
              leadingIcon={leadingIcon}
              trailingBadge={trailingBadge}
              iconSlotReserved={iconSlotReserved}
              disabled={false}
            />
            <Ionicons
              name="chevron-forward"
              size={16}
              color={tokens.color.text.tertiary}
              style={styles.chevron}
            />
          </View>
        )}
      </Pressable>
    </Link>
  );
}

interface DisabledRowProps extends CommonItemFields {
  iconSlotReserved: boolean;
}

function DisabledRow({
  text,
  description,
  leadingIcon,
  trailingBadge,
  iconSlotReserved,
}: DisabledRowProps): ReactElement {
  const { tokens } = useTheme();

  return (
    <View
      style={[
        styles.row,
        {
          minHeight: MIN_ROW_HEIGHT,
          paddingHorizontal: tokens.spacing.lg,
          paddingVertical: 10,
        },
      ]}
    >
      <RowContent
        text={text}
        description={description}
        leadingIcon={leadingIcon}
        trailingBadge={trailingBadge}
        iconSlotReserved={iconSlotReserved}
        disabled
      />
    </View>
  );
}

interface RowContentProps extends CommonItemFields {
  iconSlotReserved: boolean;
  disabled: boolean;
}

function RowContent({
  text,
  description,
  leadingIcon,
  trailingBadge,
  iconSlotReserved,
  disabled,
}: RowContentProps): ReactElement {
  const textTone = disabled ? "disabled" : "primary";
  const descriptionTone = disabled ? "disabled" : "secondary";

  return (
    <>
      {iconSlotReserved ? (
        <View style={[styles.iconSlot, { marginRight: ICON_GAP }]}>{leadingIcon ?? null}</View>
      ) : null}
      <View style={styles.textCol}>
        <ThemedText type="body" tone={textTone}>
          {text}
        </ThemedText>
        {description ? (
          <ThemedText type="caption" tone={descriptionTone} style={styles.description}>
            {description}
          </ThemedText>
        ) : null}
      </View>
      {trailingBadge ? <View style={styles.trailingSlot}>{trailingBadge}</View> : null}
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconSlot: {
    width: ICON_SLOT_WIDTH,
    height: ICON_SLOT_WIDTH,
    alignItems: "center",
    justifyContent: "center",
  },
  textCol: {
    flex: 1,
    minWidth: 0,
  },
  description: {
    marginTop: 2,
  },
  trailingSlot: {
    marginLeft: 12,
  },
  chevron: {
    marginLeft: 8,
  },
});
