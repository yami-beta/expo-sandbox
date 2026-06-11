import {
  BottomSheetModal,
  BottomSheetView,
  type BottomSheetMethods,
} from "@expo/ui/community/bottom-sheet";
import { MenuView, type MenuAction } from "@expo/ui/community/menu";
import { Ionicons } from "@react-native-vector-icons/ionicons/static";
import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import { type ReactElement, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Button } from "../../../../../components/button/Button";
import { Card } from "../../../../../components/card/Card";
import { ScreenScrollView } from "../../../../../components/screen-scroll-view/ScreenScrollView";
import { ThemedText } from "../../../../../components/themed-text/ThemedText";
import { useTheme } from "../../../../../theme/useTheme";

type ShareTarget = "message" | "mail" | "clipboard";

export default function ShareActionsScreen(): ReactElement {
  const { t } = useLingui();
  const { tokens } = useTheme();
  const sheetRef = useRef<BottomSheetMethods>(null);
  const [statusText, setStatusText] = useState<string | null>(null);

  const menuActions: MenuAction[] = [
    { id: "edit", title: t`編集` },
    { id: "duplicate", title: t`複製` },
    { id: "copy-link", title: t`リンクをコピー` },
    { id: "delete", title: t`削除`, attributes: { destructive: true } },
  ];
  const menuActionLabels: Record<string, string> = {
    edit: t`編集`,
    duplicate: t`複製`,
    "copy-link": t`リンクをコピー`,
    delete: t`削除`,
  };

  const shareTargets: { id: ShareTarget; label: string; icon: "chatbubble" | "mail" | "copy" }[] = [
    { id: "message", label: t`メッセージ`, icon: "chatbubble" },
    { id: "mail", label: t`メール`, icon: "mail" },
    { id: "clipboard", label: t`クリップボード`, icon: "copy" },
  ];

  const handleShare = (target: ShareTarget) => {
    const label = shareTargets.find((item) => item.id === target)?.label ?? "";
    sheetRef.current?.dismiss();
    setStatusText(t`${label} に共有しました`);
  };

  return (
    <>
      <Stack.Screen.Title>{t`投稿アクション`}</Stack.Screen.Title>
      <ScreenScrollView>
        <ThemedText type="caption" tone="tertiary">
          <Trans>
            「…」が Menu、「共有」が BottomSheet のサンプルです。どちらも OS ネイティブのメニュー /
            シートで表示されます。
          </Trans>
        </ThemedText>

        <Card>
          <View style={{ gap: tokens.spacing.md }}>
            <View style={[styles.authorRow, { gap: tokens.spacing.sm }]}>
              <Ionicons
                name="person-circle-outline"
                size={36}
                color={tokens.color.text.secondary}
                accessibilityElementsHidden={true}
                importantForAccessibility="no-hide-descendants"
              />
              <View style={styles.authorText}>
                <ThemedText type="bodyEmphasis">
                  <Trans>やみ べーた</Trans>
                </ThemedText>
                <ThemedText type="caption" tone="tertiary">
                  <Trans>3 分前</Trans>
                </ThemedText>
              </View>
              <MenuView
                actions={menuActions}
                onPressAction={({ nativeEvent }) => {
                  setStatusText(
                    t`「${menuActionLabels[nativeEvent.event] ?? nativeEvent.event}」を選択しました`,
                  );
                }}
              >
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t`その他の操作`}
                  style={styles.menuTrigger}
                >
                  {({ pressed }) => (
                    <Ionicons
                      name="ellipsis-horizontal"
                      size={20}
                      color={pressed ? tokens.color.text.tertiary : tokens.color.text.secondary}
                    />
                  )}
                </Pressable>
              </MenuView>
            </View>
            <ThemedText type="body">
              <Trans>
                @expo/ui の Drop-in replacements を試しています。既存ライブラリと同じ API
                のままネイティブ実装に置き換えられるのが便利。
              </Trans>
            </ThemedText>
            <View style={styles.shareRow}>
              <Button
                variant="soft"
                size="sm"
                leadingIcon="download"
                onPress={() => sheetRef.current?.present()}
              >
                <Trans>共有</Trans>
              </Button>
            </View>
          </View>
        </Card>

        {statusText ? (
          <Card tone="surfaceElevated">
            <ThemedText type="caption" tone="secondary" accessibilityLiveRegion="polite">
              {statusText}
            </ThemedText>
          </Card>
        ) : null}
      </ScreenScrollView>

      {/*
        BottomSheetModal は present() を呼ぶまで閉じたまま。
        snapPoints を渡さないとコンテンツ高さに自動フィットする (enableDynamicSizing 既定 true)。
        @gorhom/bottom-sheet と異なりカスタム handle / backdrop / footer は使えない。
      */}
      <BottomSheetModal ref={sheetRef} enablePanDownToClose={true}>
        <BottomSheetView style={[styles.sheetContent, { gap: tokens.spacing.sm }]}>
          <ThemedText type="headline">
            <Trans>共有先を選択</Trans>
          </ThemedText>
          {shareTargets.map((target) => (
            <Pressable
              key={target.id}
              accessibilityRole="button"
              onPress={() => handleShare(target.id)}
              style={({ pressed }) => [
                styles.shareTargetRow,
                {
                  gap: tokens.spacing.md,
                  borderRadius: tokens.radius.md,
                  backgroundColor: pressed ? tokens.color.background.pressed : "transparent",
                },
              ]}
            >
              <Ionicons
                name={`${target.icon}-outline`}
                size={22}
                color={tokens.color.text.secondary}
                accessibilityElementsHidden={true}
                importantForAccessibility="no-hide-descendants"
              />
              <ThemedText type="body">{target.label}</ThemedText>
            </Pressable>
          ))}
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
}

const styles = StyleSheet.create({
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  authorText: {
    flex: 1,
    minWidth: 0,
  },
  menuTrigger: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  shareRow: {
    flexDirection: "row",
  },
  sheetContent: {
    padding: 24,
    paddingBottom: 40,
  },
  shareTargetRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 48,
    paddingHorizontal: 8,
  },
});
