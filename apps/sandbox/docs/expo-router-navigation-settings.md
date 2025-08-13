# Expo Router ナビゲーション設定ガイド

## 概要

Expo Routerでナビゲーション設定（特に`presentation`オプション）を行う際の重要な仕様と制限事項について記載します。

## 重要な仕様

### Stack.Screenの設定場所による挙動の違い

Expo Routerでは、`Stack.Screen`の設定場所によって、利用可能なオプションに制限があります。

#### ❌ 動作しない例：個別routeファイルでのpresentation設定

```tsx
// apps/sandbox/src/app/navigation-patterns/modal-screen.tsx
import { Stack } from "expo-router";

export default function ModalScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "モーダル画面",
          presentation: "modal", // ⚠️ この設定は効果がない
        }}
      />
      {/* コンテンツ */}
    </>
  );
}
```

#### ✅ 正しい実装：レイアウトファイルでのpresentation設定

```tsx
// apps/sandbox/src/app/_layout.tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="navigation-patterns/modal-screen"
        options={{
          title: "モーダル画面",
          presentation: "modal", // ✅ ここで設定すると正しく動作
        }}
      />
    </Stack>
  );
}
```

## 設定可能なオプションの違い

### レイアウトファイル（\_layout.tsx）で設定可能

- `presentation`（modal, formSheet, card など）
- `sheetGrabberVisible`（formSheet用）
- `title`
- `headerShown`
- `headerStyle`
- その他すべてのナビゲーションオプション

### 個別routeファイルで設定可能

- `title`
- `headerStyle`
- `headerRight`
- `headerLeft`
- その他のヘッダー関連オプション
- **ただし`presentation`は効果がない**

## 推奨される実装パターン

### パターン1: すべてのオプションをレイアウトファイルに集約（推奨）

オプションが分散すると管理が複雑になるため、すべての設定をレイアウトファイルに集約することを推奨します。

```tsx
// apps/sandbox/src/app/_layout.tsx
import { Stack } from "expo-router";
import { useLingui } from "@lingui/react/macro";

function RootLayoutContent() {
  const { t } = useLingui();
  const { theme } = useThemeContext();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.card,
        },
        headerTintColor: theme.colors.text,
        headerShadowVisible: !theme.dark,
      }}
    >
      {/* 通常の画面 */}
      <Stack.Screen
        name="navigation-patterns/index"
        options={{
          title: t`ナビゲーションパターン`,
        }}
      />

      {/* モーダル表示 */}
      <Stack.Screen
        name="navigation-patterns/modal-screen"
        options={{
          title: t`モーダル画面`,
          presentation: "modal",
        }}
      />

      {/* フォームシート表示（iOS） */}
      <Stack.Screen
        name="navigation-patterns/form-sheet-screen"
        options={{
          title: t`フォームシート画面`,
          presentation: "formSheet",
          sheetGrabberVisible: true,
        }}
      />
    </Stack>
  );
}
```

### パターン2: 動的な設定が必要な場合

動的な設定が必要な場合は、個別routeファイルで`navigation.setOptions()`を使用することもできますが、`presentation`の動的変更はサポートされていません。

```tsx
// 個別routeファイル
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";

export default function DynamicScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: "動的なタイトル",
      // presentation: "modal", // ⚠️ これは効果がない
    });
  }, [navigation]);

  return <View>{/* コンテンツ */}</View>;
}
```

## presentationオプションの種類

| オプション         | 説明                                       | プラットフォーム                     |
| ------------------ | ------------------------------------------ | ------------------------------------ |
| `card`             | デフォルトのカード型遷移                   | 全プラットフォーム                   |
| `modal`            | モーダル表示（下から上へのアニメーション） | 全プラットフォーム                   |
| `transparentModal` | 透明背景のモーダル                         | 全プラットフォーム                   |
| `fullScreenModal`  | フルスクリーンモーダル                     | 全プラットフォーム                   |
| `formSheet`        | フォームシート表示                         | iOS（Androidではモーダルとして表示） |
| `containedModal`   | 含まれたモーダル                           | iOS                                  |

## トラブルシューティング

### Q: presentationオプションが効かない

**A:** レイアウトファイル（`_layout.tsx`）で設定してください。個別のrouteファイルでは効果がありません。

### Q: ネストしたStack Navigatorでの問題

**A:** 異なるStack間でのモーダル表示には制限があります。可能な限りルートのStackで管理することを推奨します。

### Q: iOSで戻るボタンが表示されない

**A:** ネストしたStack Navigatorが原因の可能性があります。ルートのStack Navigatorで直接管理するようにしてください。

## 参考資料

- [Expo Router Stack Documentation](https://docs.expo.dev/router/advanced/stack/)
- [Expo Router Modals Documentation](https://docs.expo.dev/router/advanced/modals/)
- [GitHub Issue #630 - Presentation Modal not working](https://github.com/expo/router/issues/630)

## 関連ファイル

- `/apps/sandbox/src/app/_layout.tsx` - ルートレイアウトファイル
- `/apps/sandbox/src/app/navigation-patterns/` - ナビゲーションパターンの実装例

## 更新履歴

- 2025-01-13: 初版作成
  - Expo Router v5.1.4での動作確認
  - presentation オプションの設定場所に関する制限事項を記載
