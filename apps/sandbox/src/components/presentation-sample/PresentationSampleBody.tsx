import type { ReactElement, ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Trans } from "@lingui/react/macro";
import { Spacing } from "../../constants/theme";
import { useTheme } from "../../theme/useTheme";
import { ThemedText } from "../themed-text/ThemedText";
import { PresentationSection } from "./PresentationSection";

export interface PresentationSampleBodyProps {
  presentationValue: string;
  heading: ReactNode;
  iosBehavior: ReactNode;
  androidBehavior: ReactNode;
  dismissNote: ReactNode;
  additionalNotes?: ReactNode;
}

export function PresentationSampleBody({
  presentationValue,
  heading,
  iosBehavior,
  androidBehavior,
  dismissNote,
  additionalNotes,
}: PresentationSampleBodyProps): ReactElement {
  const router = useRouter();
  const { colors } = useTheme();

  const close = () => {
    router.back();
  };

  return (
    <View style={styles.body}>
      <View style={styles.headerRow}>
        <View style={[styles.badge, { backgroundColor: colors.backgroundSelected }]}>
          <Text style={[styles.badgeText, { color: colors.text }]}>{presentationValue}</Text>
        </View>
        <ThemedText type="title" style={styles.heading}>
          {heading}
        </ThemedText>
      </View>

      <PresentationSection title={<Trans>iOS の挙動</Trans>}>{iosBehavior}</PresentationSection>
      <PresentationSection title={<Trans>Android の挙動</Trans>}>
        {androidBehavior}
      </PresentationSection>
      <PresentationSection title={<Trans>閉じる操作</Trans>}>{dismissNote}</PresentationSection>
      {additionalNotes ? (
        <PresentationSection title={<Trans>実装メモ</Trans>}>{additionalNotes}</PresentationSection>
      ) : null}

      <Pressable
        style={({ pressed }) => [
          styles.primaryButton,
          { backgroundColor: pressed ? colors.border : colors.primary },
        ]}
        onPress={close}
      >
        <Text style={[styles.primaryButtonText, { color: colors.onPrimary }]}>
          <Trans>閉じる</Trans>
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: Spacing.three,
  },
  headerRow: {
    gap: Spacing.two,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.two,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  heading: {
    fontSize: 24,
    lineHeight: 32,
  },
  primaryButton: {
    paddingVertical: Spacing.three,
    borderRadius: Spacing.two,
    alignItems: "center",
    marginTop: Spacing.two,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
