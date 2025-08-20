import { Trans, useLingui } from "@lingui/react/macro";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";

// 型定義
type ApiStatus = "pending" | "processing" | "completed" | "failed";
type OrderStatus = "new" | "shipped" | "delivered";
type Category = "technology" | "lifestyle" | "business";

// ステータスバッジコンポーネント
function StatusBadge({
  status,
  type,
}: {
  status: string;
  type: "api" | "order";
}) {
  const { t } = useLingui();

  const getStatusColor = () => {
    if (type === "api") {
      switch (status) {
        case "pending":
          return "#FFA500";
        case "processing":
          return "#1E90FF";
        case "completed":
          return "#32CD32";
        case "failed":
          return "#DC143C";
        default:
          return "#808080";
      }
    } else {
      switch (status) {
        case "new":
          return "#1E90FF";
        case "shipped":
          return "#FFA500";
        case "delivered":
          return "#32CD32";
        default:
          return "#808080";
      }
    }
  };

  const getTranslatedStatus = () => {
    if (type === "api") {
      switch (status) {
        case "pending":
          return t`保留中`;
        case "processing":
          return t`処理中`;
        case "completed":
          return t`完了`;
        case "failed":
          return t`失敗`;
        default:
          return status;
      }
    } else {
      switch (status) {
        case "new":
          return t`新規注文`;
        case "shipped":
          return t`発送済み`;
        case "delivered":
          return t`配達完了`;
        default:
          return status;
      }
    }
  };

  return (
    <View style={[styles.badge, { backgroundColor: getStatusColor() }]}>
      <Text style={styles.badgeText}>{getTranslatedStatus()}</Text>
    </View>
  );
}

// カテゴリーセレクターコンポーネント
function CategorySelector({
  category,
  onCategoryChange,
}: {
  category: Category;
  onCategoryChange: (category: Category) => void;
}) {
  const { t } = useLingui();

  const getCategoryLabel = (cat: Category): string => {
    switch (cat) {
      case "technology":
        return t`テクノロジー`;
      case "lifestyle":
        return t`ライフスタイル`;
      case "business":
        return t`ビジネス`;
      default:
        return cat;
    }
  };

  const categories: Category[] = ["technology", "lifestyle", "business"];

  return (
    <View style={styles.categoryContainer}>
      <Text style={styles.label}>
        <Trans>カテゴリー選択:</Trans>
      </Text>
      <View style={styles.categoryButtonRow}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryButton,
              category === cat && styles.categoryButtonActive,
            ]}
            onPress={() => onCategoryChange(cat)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                category === cat && styles.categoryButtonTextActive,
              ]}
            >
              {getCategoryLabel(cat)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.selectedText}>
        <Trans>選択中:</Trans> {getCategoryLabel(category)}
      </Text>
    </View>
  );
}

// フォールバックデモコンポーネント
function FallbackDemo() {
  const { t } = useLingui();
  const [testKey, setTestKey] = useState("test.key.missing");

  const translateWithFallback = (key: string, fallback: string): string => {
    try {
      // 実際のアプリケーションでは、動的なキーの翻訳はより洗練された方法で行います
      // ここでは簡単なデモとして実装
      const translations: Record<string, string> = {
        "status.active": t`アクティブ`,
        "status.inactive": t`非アクティブ`,
        "error.network": t`ネットワークエラー`,
      };

      return translations[key] || fallback;
    } catch {
      return fallback;
    }
  };

  const result = translateWithFallback(testKey, `Fallback: ${testKey}`);

  return (
    <View style={styles.fallbackContainer}>
      <Text style={styles.label}>
        <Trans>フォールバック戦略のデモ</Trans>
      </Text>
      <TextInput
        style={styles.input}
        value={testKey}
        onChangeText={setTestKey}
        placeholder={t`翻訳キーを入力`}
      />
      <Text style={styles.hint}>
        <Trans>試してみる: status.active, status.inactive, error.network</Trans>
      </Text>
      <View style={styles.resultBox}>
        <Text style={styles.resultLabel}>
          <Trans>結果:</Trans>
        </Text>
        <Text style={styles.resultText}>{result}</Text>
      </View>
    </View>
  );
}

export default function DynamicContentExamples() {
  const [apiStatus, setApiStatus] = useState<ApiStatus>("pending");
  const [orderStatus, setOrderStatus] = useState<OrderStatus>("new");
  const [category, setCategory] = useState<Category>("technology");

  const apiStatuses: ApiStatus[] = [
    "pending",
    "processing",
    "completed",
    "failed",
  ];
  const orderStatuses: OrderStatus[] = ["new", "shipped", "delivered"];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          <Trans>動的コンテンツの翻訳パターン</Trans>
        </Text>

        {/* セクション1: APIステータスの翻訳 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Trans>1. APIステータスの翻訳</Trans>
          </Text>

          <View style={styles.statusSection}>
            <Text style={styles.label}>
              <Trans>処理ステータス:</Trans>
            </Text>
            <StatusBadge status={apiStatus} type="api" />

            <View style={styles.buttonRow}>
              {apiStatuses.map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.button,
                    apiStatus === status && styles.buttonActive,
                  ]}
                  onPress={() => setApiStatus(status)}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      apiStatus === status && styles.buttonTextActive,
                    ]}
                  >
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.statusSection}>
            <Text style={styles.label}>
              <Trans>注文ステータス:</Trans>
            </Text>
            <StatusBadge status={orderStatus} type="order" />

            <View style={styles.buttonRow}>
              {orderStatuses.map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.button,
                    orderStatus === status && styles.buttonActive,
                  ]}
                  onPress={() => setOrderStatus(status)}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      orderStatus === status && styles.buttonTextActive,
                    ]}
                  >
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* セクション2: カテゴリー/タグの翻訳 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Trans>2. カテゴリー/タグの翻訳</Trans>
          </Text>
          <CategorySelector
            category={category}
            onCategoryChange={setCategory}
          />
        </View>

        {/* セクション3: フォールバック戦略 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Trans>3. フォールバック戦略</Trans>
          </Text>
          <FallbackDemo />
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            <Trans>
              このページでは、APIレスポンスやデータベースから取得した動的な値を
              適切に翻訳する方法を示しています。
            </Trans>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  section: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#444",
  },
  statusSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  badgeText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "white",
  },
  buttonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  buttonText: {
    fontSize: 14,
    color: "#666",
  },
  buttonTextActive: {
    color: "white",
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryButtonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginVertical: 8,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "white",
    minWidth: 100,
    alignItems: "center",
  },
  categoryButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  categoryButtonText: {
    fontSize: 14,
    color: "#666",
  },
  categoryButtonTextActive: {
    color: "white",
    fontWeight: "600",
  },
  selectedText: {
    fontSize: 16,
    color: "#333",
    marginTop: 8,
  },
  fallbackContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
    backgroundColor: "white",
  },
  hint: {
    fontSize: 12,
    color: "#888",
    marginBottom: 12,
    fontStyle: "italic",
  },
  resultBox: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  resultLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  resultText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  infoBox: {
    backgroundColor: "#E3F2FD",
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#1976D2",
    lineHeight: 20,
  },
});
