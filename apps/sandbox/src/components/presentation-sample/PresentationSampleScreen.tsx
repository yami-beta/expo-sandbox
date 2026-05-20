import type { ReactElement, ReactNode } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Trans } from "@lingui/react/macro";
import { Spacing } from "../../constants/theme";
import { useTheme } from "../../theme/useTheme";
import { ThemedText } from "../themed-text/ThemedText";

export type PresentationSampleVariant = "opaque" | "transparent-overlay";

export interface PresentationSampleScreenProps {
  presentationValue: string;
  heading: ReactNode;
  iosBehavior: ReactNode;
  androidBehavior: ReactNode;
  dismissNote: ReactNode;
  variant?: PresentationSampleVariant;
  // タブ内 Stack 配下に置く場合は true。SafeAreaView の bottom inset が
  // タブバー高さを認識できず、コンテンツとタブバーの間に余分な余白を作るのを避ける。
  isInTab?: boolean;
}

export function PresentationSampleScreen({
  presentationValue,
  heading,
  iosBehavior,
  androidBehavior,
  dismissNote,
  variant = "opaque",
  isInTab = false,
}: PresentationSampleScreenProps): ReactElement {
  const router = useRouter();
  const { colors } = useTheme();

  const close = () => {
    router.back();
  };

  const body = (
    <SampleBody
      presentationValue={presentationValue}
      heading={heading}
      iosBehavior={iosBehavior}
      androidBehavior={androidBehavior}
      dismissNote={dismissNote}
      onClose={close}
    />
  );

  if (variant === "transparent-overlay") {
    return (
      <Pressable style={styles.backdrop} onPress={close}>
        <Pressable
          style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}
          onPress={() => {}}
        >
          <ScrollView contentContainerStyle={styles.cardScroll}>{body}</ScrollView>
        </Pressable>
      </Pressable>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={isInTab ? [] : ["bottom"]}
    >
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContent}
      >
        {body}
      </ScrollView>
    </SafeAreaView>
  );
}

interface SampleBodyProps {
  presentationValue: string;
  heading: ReactNode;
  iosBehavior: ReactNode;
  androidBehavior: ReactNode;
  dismissNote: ReactNode;
  onClose: () => void;
}

function SampleBody({
  presentationValue,
  heading,
  iosBehavior,
  androidBehavior,
  dismissNote,
  onClose,
}: SampleBodyProps): ReactElement {
  const { colors } = useTheme();

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

      <Section title={<Trans>iOS の挙動</Trans>}>{iosBehavior}</Section>
      <Section title={<Trans>Android の挙動</Trans>}>{androidBehavior}</Section>
      <Section title={<Trans>閉じる操作</Trans>}>{dismissNote}</Section>

      <Pressable
        style={({ pressed }) => [
          styles.primaryButton,
          { backgroundColor: pressed ? colors.border : colors.primary },
        ]}
        onPress={onClose}
      >
        <Text style={[styles.primaryButtonText, { color: colors.onPrimary }]}>
          <Trans>閉じる</Trans>
        </Text>
      </Pressable>
    </View>
  );
}

interface SectionProps {
  title: ReactNode;
  children: ReactNode;
}

function Section({ title, children }: SectionProps): ReactElement {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.section,
        { backgroundColor: colors.backgroundElement, borderColor: colors.border },
      ]}
    >
      <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionTitle}>
        {title}
      </ThemedText>
      <ThemedText type="default">{children}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.three,
    gap: Spacing.three,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    paddingHorizontal: Spacing.three,
  },
  card: {
    maxHeight: "85%",
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Spacing.three,
    overflow: "hidden",
  },
  cardScroll: {
    padding: Spacing.three,
  },
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
  section: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Spacing.two,
  },
  sectionTitle: {
    textTransform: "uppercase",
    letterSpacing: 0.5,
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
