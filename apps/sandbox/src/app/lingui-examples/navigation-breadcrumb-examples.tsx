import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";
import { useState } from "react";
import { useThemeContext } from "../../theme/ThemeContext";
import { Trans, useLingui } from "@lingui/react/macro";

// パンくずリストアイテムの型定義
type BreadcrumbItem = {
  id: string;
  label: string;
  translatedLabel?: string;
};

// パンくずリストコンポーネント
const Breadcrumb = ({
  items,
  onItemPress,
  theme,
  separator,
  maxItems = 4,
}: {
  items: BreadcrumbItem[];
  onItemPress: (index: number) => void;
  theme: any;
  separator: string;
  maxItems?: number;
}) => {
  const displayItems = [...items];
  let showEllipsis = false;

  // アイテムが多い場合は省略表示
  if (items.length > maxItems) {
    showEllipsis = true;
    // 最初の1つと最後の(maxItems - 2)個を表示
    displayItems.splice(1, items.length - maxItems + 1);
  }

  return (
    <View style={styles.breadcrumbContainer}>
      {displayItems.map((item, index) => {
        const actualIndex =
          showEllipsis && index > 0
            ? items.length - (displayItems.length - index)
            : index;
        const isLast = actualIndex === items.length - 1;
        const isEllipsis = showEllipsis && index === 1;

        return (
          <View key={item.id} style={styles.breadcrumbItemContainer}>
            {isEllipsis && (
              <>
                <Text style={[styles.ellipsis, { color: theme.colors.border }]}>
                  ...
                </Text>
                <Text
                  style={[styles.separator, { color: theme.colors.border }]}
                >
                  {separator}
                </Text>
              </>
            )}
            <Pressable
              onPress={() => !isLast && onItemPress(actualIndex)}
              disabled={isLast}
            >
              <Text
                style={[
                  styles.breadcrumbItem,
                  {
                    color: isLast ? theme.colors.text : theme.colors.primary,
                    fontWeight: isLast ? "600" : "400",
                  },
                ]}
              >
                {item.translatedLabel || item.label}
              </Text>
            </Pressable>
            {!isLast && (
              <Text style={[styles.separator, { color: theme.colors.border }]}>
                {separator}
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
};

export default function NavigationBreadcrumbExamples() {
  const { theme } = useThemeContext();
  const { t } = useLingui();

  // パンくずリストのパス
  const [breadcrumbPath, setBreadcrumbPath] = useState<BreadcrumbItem[]>([
    { id: "home", label: "ホーム", translatedLabel: t`ホーム` },
  ]);

  // カスタムパス入力
  const [customPath, setCustomPath] = useState("");

  // 区切り文字の選択
  const [separatorType, setSeparatorType] = useState<
    "arrow" | "slash" | "chevron"
  >("arrow");

  // 最大表示数
  const [maxDisplayItems, setMaxDisplayItems] = useState(4);

  // カテゴリとアイテムの定義
  const categories = [
    { id: "products", label: t`製品` },
    { id: "services", label: t`サービス` },
    { id: "support", label: t`サポート` },
    { id: "company", label: t`会社情報` },
  ];

  const subCategories = {
    products: [
      { id: "electronics", label: t`電子機器` },
      { id: "clothing", label: t`衣料品` },
      { id: "books", label: t`書籍` },
    ],
    services: [
      { id: "consulting", label: t`コンサルティング` },
      { id: "development", label: t`開発` },
      { id: "training", label: t`トレーニング` },
    ],
    support: [
      { id: "documentation", label: t`ドキュメント` },
      { id: "faq", label: t`よくある質問` },
      { id: "contact", label: t`お問い合わせ` },
    ],
    company: [
      { id: "about", label: t`会社概要` },
      { id: "careers", label: t`採用情報` },
      { id: "news", label: t`ニュース` },
    ],
  };

  // 区切り文字の取得
  const getSeparator = () => {
    switch (separatorType) {
      case "arrow":
        return " > ";
      case "slash":
        return " / ";
      case "chevron":
        return " › ";
      default:
        return " > ";
    }
  };

  // パンくずリストアイテムをクリック
  const handleBreadcrumbClick = (index: number) => {
    setBreadcrumbPath(breadcrumbPath.slice(0, index + 1));
  };

  // カテゴリを追加
  const addCategory = (category: { id: string; label: string }) => {
    const home = breadcrumbPath[0];
    if (!home) return;

    const newItem: BreadcrumbItem = {
      id: category.id,
      label: category.label,
      translatedLabel: category.label,
    };
    setBreadcrumbPath([home, newItem]);
  };

  // サブカテゴリを追加
  const addSubCategory = (subCategory: { id: string; label: string }) => {
    const newItem: BreadcrumbItem = {
      id: subCategory.id,
      label: subCategory.label,
      translatedLabel: subCategory.label,
    };

    // カテゴリレベルまでのパスを保持
    const basePath = breadcrumbPath.slice(0, 2);
    setBreadcrumbPath([...basePath, newItem]);
  };

  // 詳細ページを追加
  const addDetailPage = (name: string) => {
    const newItem: BreadcrumbItem = {
      id: `detail-${Date.now()}`,
      label: name,
      translatedLabel: name,
    };

    // サブカテゴリレベルまでのパスを保持
    const basePath = breadcrumbPath.slice(0, 3);
    setBreadcrumbPath([...basePath, newItem]);
  };

  // ホームに戻る
  const goHome = () => {
    const home = breadcrumbPath[0];
    if (home) {
      setBreadcrumbPath([home]);
    }
  };

  // 現在のカテゴリを取得
  const getCurrentCategory = () => {
    if (breadcrumbPath.length > 1 && breadcrumbPath[1]) {
      return breadcrumbPath[1].id as keyof typeof subCategories;
    }
    return null;
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>
        <Trans>パンくずリスト</Trans>
      </Text>

      <Text style={[styles.subtitle, { color: theme.colors.text }]}>
        <Trans>現在のパス</Trans>
      </Text>

      <View
        style={[styles.currentPathBox, { backgroundColor: theme.colors.card }]}
      >
        <Breadcrumb
          items={breadcrumbPath}
          onItemPress={handleBreadcrumbClick}
          theme={theme}
          separator={getSeparator()}
          maxItems={maxDisplayItems}
        />
      </View>

      <Text style={[styles.subtitle, { color: theme.colors.text }]}>
        <Trans>ナビゲーション操作</Trans>
      </Text>

      <View style={styles.section}>
        <Text style={[styles.label, { color: theme.colors.text }]}>
          <Trans>カテゴリを選択:</Trans>
        </Text>
        <View style={styles.buttonGroup}>
          {categories.map((category) => (
            <Pressable
              key={category.id}
              style={[
                styles.categoryButton,
                {
                  backgroundColor: theme.colors.primary,
                  opacity: breadcrumbPath.length > 1 ? 0.5 : 1,
                },
              ]}
              onPress={() => addCategory(category)}
              disabled={breadcrumbPath.length > 1}
            >
              <Text style={styles.buttonText}>{category.label}</Text>
            </Pressable>
          ))}
        </View>

        {getCurrentCategory() && subCategories[getCurrentCategory()!] && (
          <>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              <Trans>サブカテゴリを選択:</Trans>
            </Text>
            <View style={styles.buttonGroup}>
              {subCategories[getCurrentCategory()!].map((subCategory) => (
                <Pressable
                  key={subCategory.id}
                  style={[
                    styles.categoryButton,
                    {
                      backgroundColor: theme.colors.notification,
                      opacity: breadcrumbPath.length > 2 ? 0.5 : 1,
                    },
                  ]}
                  onPress={() => addSubCategory(subCategory)}
                  disabled={breadcrumbPath.length > 2}
                >
                  <Text style={styles.buttonText}>{subCategory.label}</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}

        {breadcrumbPath.length === 3 && (
          <>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              <Trans>詳細ページ名を入力:</Trans>
            </Text>
            <View style={styles.inputRow}>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.colors.card,
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                  },
                ]}
                value={customPath}
                onChangeText={setCustomPath}
                placeholder={t`例: 製品詳細ページ`}
                placeholderTextColor={theme.colors.border}
              />
              <Pressable
                style={[
                  styles.addButton,
                  { backgroundColor: theme.colors.primary },
                ]}
                onPress={addDetailPage.bind(null, customPath)}
                disabled={!customPath.trim()}
              >
                <Text style={styles.buttonText}>
                  <Trans>追加</Trans>
                </Text>
              </Pressable>
            </View>
          </>
        )}

        <Pressable
          style={[styles.homeButton, { backgroundColor: theme.colors.border }]}
          onPress={goHome}
        >
          <Text style={styles.buttonText}>
            <Trans>ホームに戻る</Trans>
          </Text>
        </Pressable>
      </View>

      <Text style={[styles.subtitle, { color: theme.colors.text }]}>
        <Trans>表示オプション</Trans>
      </Text>

      <View style={styles.section}>
        <Text style={[styles.label, { color: theme.colors.text }]}>
          <Trans>区切り文字:</Trans>
        </Text>
        <View style={styles.optionGroup}>
          {[
            { value: "arrow" as const, label: ">", display: t`矢印 (>)` },
            { value: "slash" as const, label: "/", display: t`スラッシュ (/)` },
            {
              value: "chevron" as const,
              label: "›",
              display: t`シェブロン (›)`,
            },
          ].map((option) => (
            <Pressable
              key={option.value}
              style={[
                styles.optionButton,
                {
                  backgroundColor:
                    separatorType === option.value
                      ? theme.colors.primary
                      : theme.colors.card,
                },
              ]}
              onPress={() => setSeparatorType(option.value)}
            >
              <Text
                style={[
                  styles.optionText,
                  {
                    color:
                      separatorType === option.value
                        ? "white"
                        : theme.colors.text,
                  },
                ]}
              >
                {option.display}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.label, { color: theme.colors.text }]}>
          <Trans>最大表示数:</Trans> {maxDisplayItems}
        </Text>
        <View style={styles.counterRow}>
          <Pressable
            style={[
              styles.counterButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={() => setMaxDisplayItems(Math.max(2, maxDisplayItems - 1))}
          >
            <Text style={styles.buttonText}>-</Text>
          </Pressable>
          <Text style={[styles.counterValue, { color: theme.colors.text }]}>
            {maxDisplayItems}
          </Text>
          <Pressable
            style={[
              styles.counterButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={() =>
              setMaxDisplayItems(Math.min(10, maxDisplayItems + 1))
            }
          >
            <Text style={styles.buttonText}>+</Text>
          </Pressable>
        </View>
      </View>

      <View style={[styles.infoBox, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.infoTitle, { color: theme.colors.text }]}>
          <Trans>実装のポイント</Trans>
        </Text>
        <Text style={[styles.infoText, { color: theme.colors.text }]}>
          <Trans>• 階層的なナビゲーションパスの管理</Trans>
        </Text>
        <Text style={[styles.infoText, { color: theme.colors.text }]}>
          <Trans>• クリック可能な各階層へのジャンプ機能</Trans>
        </Text>
        <Text style={[styles.infoText, { color: theme.colors.text }]}>
          <Trans>• パスが長い場合の省略表示（...）</Trans>
        </Text>
        <Text style={[styles.infoText, { color: theme.colors.text }]}>
          <Trans>• 区切り文字のカスタマイズ</Trans>
        </Text>
        <Text style={[styles.infoText, { color: theme.colors.text }]}>
          <Trans>• 現在位置の視覚的な強調</Trans>
        </Text>
      </View>

      <View style={[styles.exampleBox, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.exampleTitle, { color: theme.colors.text }]}>
          <Trans>使用例</Trans>
        </Text>
        <Text style={[styles.exampleText, { color: theme.colors.text }]}>
          <Trans>• ECサイトのカテゴリナビゲーション</Trans>
        </Text>
        <Text style={[styles.exampleText, { color: theme.colors.text }]}>
          <Trans>• ドキュメントサイトの階層表示</Trans>
        </Text>
        <Text style={[styles.exampleText, { color: theme.colors.text }]}>
          <Trans>• ファイルシステムのパス表示</Trans>
        </Text>
        <Text style={[styles.exampleText, { color: theme.colors.text }]}>
          <Trans>• 管理画面の階層メニュー</Trans>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  currentPathBox: {
    padding: 15,
    borderRadius: 12,
    minHeight: 50,
    justifyContent: "center",
  },
  breadcrumbContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  breadcrumbItemContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  breadcrumbItem: {
    fontSize: 14,
    paddingVertical: 2,
  },
  separator: {
    fontSize: 14,
    marginHorizontal: 8,
  },
  ellipsis: {
    fontSize: 14,
    marginRight: 8,
  },
  buttonGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 15,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  inputRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  addButton: {
    paddingHorizontal: 20,
    justifyContent: "center",
    borderRadius: 8,
  },
  homeButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  optionGroup: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 15,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  optionText: {
    fontSize: 14,
    fontWeight: "500",
  },
  counterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  counterButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  counterValue: {
    fontSize: 18,
    fontWeight: "600",
    minWidth: 30,
    textAlign: "center",
  },
  infoBox: {
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 5,
  },
  exampleBox: {
    padding: 15,
    borderRadius: 12,
    marginTop: 15,
  },
  exampleTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  exampleText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 5,
  },
});
