import { MaskedView } from "@expo/ui/community/masked-view";
import { PagerView, type PagerViewRef } from "@expo/ui/community/pager-view";
import { Stack, useRouter } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import { type ReactElement, type ReactNode, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../../components/button/Button";
import { ThemedText } from "../../../components/themed-text/ThemedText";
import { useTheme } from "../../../theme/useTheme";

// MaskedView のデモ用。テキストを mask にして下のストライプを透過させる
// (expo-linear-gradient を追加しないため、グラデーションの代わりに色帯で表現)。
const STRIPE_COLORS = ["#FF6B6B", "#FFB347", "#FFD93D", "#6BCB77", "#4D96FF"] as const;

const PAGE_COUNT = 3;

/**
 * 初回起動オンボーディングのサンプル。
 * タブ UI の外に全画面で出すのが自然なユースケースのため、ルート Stack 配下の
 * fullScreenModal として提示する (Root layout で presentation を指定)。
 * タブバーが重ならないため、フッターは SafeAreaView の bottom edge だけで足りる。
 */
export default function OnboardingScreen(): ReactElement {
  const { t } = useLingui();
  const { tokens } = useTheme();
  const router = useRouter();
  const pagerRef = useRef<PagerViewRef>(null);
  const [page, setPage] = useState(0);

  const isLastPage = page === PAGE_COUNT - 1;

  const handleNext = () => {
    if (isLastPage) {
      router.back();
      return;
    }
    pagerRef.current?.setPage(page + 1);
  };

  return (
    <>
      <Stack.Screen.Title>{t`オンボーディング`}</Stack.Screen.Title>
      <SafeAreaView
        style={[styles.screen, { backgroundColor: tokens.color.background.canvas }]}
        edges={["bottom"]}
      >
        <PagerView
          ref={pagerRef}
          style={styles.pager}
          initialPage={0}
          onPageSelected={(event) => setPage(event.nativeEvent.position)}
        >
          <View key="welcome" style={[styles.page, { gap: tokens.spacing.xl }]}>
            <MaskedView
              style={styles.maskedTitle}
              maskElement={
                <View style={styles.maskCenter}>
                  {/* mask は不透過ピクセルだけが下のコンテンツを通す。色は形状にのみ使われる */}
                  <ThemedText type="displayLg">Expo Sandbox</ThemedText>
                </View>
              }
            >
              <View style={styles.stripeRow}>
                {STRIPE_COLORS.map((color) => (
                  <View key={color} style={[styles.stripe, { backgroundColor: color }]} />
                ))}
              </View>
            </MaskedView>
            <PageBody>
              <Trans>
                ようこそ。このタイトルは MaskedView で文字を型抜きし、背面の色帯を透過させています。
              </Trans>
            </PageBody>
          </View>
          <View key="native-ui" style={[styles.page, { gap: tokens.spacing.xl }]}>
            <ThemedText type="title">
              <Trans>ネイティブ UI</Trans>
            </ThemedText>
            <PageBody>
              <Trans>
                このページ送りは PagerView によるもので、iOS / Android
                それぞれのネイティブ実装でスワイプが動きます。
              </Trans>
            </PageBody>
          </View>
          <View key="start" style={[styles.page, { gap: tokens.spacing.xl }]}>
            <ThemedText type="title">
              <Trans>準備完了</Trans>
            </ThemedText>
            <PageBody>
              <Trans>「はじめる」を押すとオンボーディングを終了します。</Trans>
            </PageBody>
          </View>
        </PagerView>

        <View style={[styles.footer, { gap: tokens.spacing.lg, padding: tokens.spacing.xl }]}>
          <View
            style={[styles.dots, { gap: tokens.spacing.sm }]}
            accessible={true}
            accessibilityLabel={t`全 ${PAGE_COUNT} ページ中 ${page + 1} ページ目`}
          >
            {Array.from({ length: PAGE_COUNT }, (_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      index === page ? tokens.color.accent.solid : tokens.color.border.default,
                  },
                ]}
              />
            ))}
          </View>
          <Button onPress={handleNext}>
            {isLastPage ? <Trans>はじめる</Trans> : <Trans>次へ</Trans>}
          </Button>
          {isLastPage ? null : (
            <Button variant="ghost" onPress={() => pagerRef.current?.setPage(PAGE_COUNT - 1)}>
              <Trans>スキップ</Trans>
            </Button>
          )}
        </View>
      </SafeAreaView>
    </>
  );
}

function PageBody({ children }: { children: ReactNode }): ReactElement {
  return (
    <View style={styles.pageBody}>
      <ThemedText type="body" tone="secondary" align="center">
        {children}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  pager: {
    flex: 1,
  },
  page: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  maskedTitle: {
    alignSelf: "stretch",
    height: 48,
  },
  maskCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  stripeRow: {
    flex: 1,
    flexDirection: "row",
  },
  stripe: {
    flex: 1,
  },
  pageBody: {
    maxWidth: 320,
  },
  footer: {
    alignItems: "stretch",
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
