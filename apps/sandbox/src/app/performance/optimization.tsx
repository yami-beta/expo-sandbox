import { Trans, useLingui } from "@lingui/react/macro";
import { useState, useMemo, useCallback, memo } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  TextInput,
} from "react-native";

// メモ化されたリストアイテムコンポーネント
const ListItem = memo(function ListItem({
  item,
  index,
}: {
  item: string;
  index: number;
}) {
  const { t } = useLingui();

  return (
    <View style={styles.listItem}>
      <Text style={styles.listItemText}>
        {t`アイテム ${index + 1}: ${item}`}
      </Text>
    </View>
  );
});

// パフォーマンス比較用の非メモ化コンポーネント
const NonMemoizedItem = ({ item, index }: { item: string; index: number }) => {
  const { t } = useLingui();

  return (
    <View style={styles.listItem}>
      <Text style={styles.listItemText}>
        {t`アイテム ${index + 1}: ${item}`}
      </Text>
    </View>
  );
};

// ヘッダーコンポーネント（メモ化して再レンダリングを防止）
const HeaderSection = memo(function HeaderSection({
  searchQuery,
  setSearchQuery,
  useMemoization,
  setUseMemoization,
  statistics,
  setRenderCount,
  renderCount,
}: {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  useMemoization: boolean;
  setUseMemoization: (value: boolean) => void;
  statistics: {
    total: number;
    products: number;
    services: number;
    categories: number;
  };
  setRenderCount: (value: number) => void;
  renderCount: number;
}) {
  const { t } = useLingui();

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>
        <Trans>最適化サンプル</Trans>
      </Text>
      <Text style={styles.description}>
        <Trans>
          useMemo、useCallback、React.memoを使用した翻訳の最適化パターンを実演します。
        </Trans>
      </Text>

      {/* 最適化の切り替え */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <Trans>最適化の有効/無効</Trans>
        </Text>
        <Pressable
          style={[styles.button, useMemoization && styles.buttonActive]}
          onPress={() => {
            setUseMemoization(!useMemoization);
            setRenderCount(renderCount + 1);
          }}
        >
          <Text
            style={[
              styles.buttonText,
              useMemoization && styles.buttonTextActive,
            ]}
          >
            {useMemoization ? (
              <Trans>メモ化: 有効</Trans>
            ) : (
              <Trans>メモ化: 無効</Trans>
            )}
          </Text>
        </Pressable>
        <Text style={styles.hint}>
          <Trans>
            メモ化を無効にすると、検索時の再レンダリングが増加します
          </Trans>
        </Text>
      </View>

      {/* 検索フィルター */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <Trans>検索フィルター</Trans>
        </Text>
        <TextInput
          style={styles.input}
          placeholder={t`検索キーワードを入力...`}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* 統計情報（メモ化された計算結果） */}
        <View style={styles.stats}>
          <Text style={styles.statsText}>
            <Trans>合計: {statistics.total}件</Trans>
          </Text>
          <Text style={styles.statsText}>
            <Trans>商品: {statistics.products}件</Trans>
          </Text>
          <Text style={styles.statsText}>
            <Trans>サービス: {statistics.services}件</Trans>
          </Text>
          <Text style={styles.statsText}>
            <Trans>カテゴリー: {statistics.categories}件</Trans>
          </Text>
        </View>
      </View>

      {/* リストタイトル */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <Trans>最適化されたリスト表示</Trans>
        </Text>
        <Text style={styles.sectionDescription}>
          <Trans>
            FlatListとメモ化を組み合わせて、大量のアイテムを効率的に表示します。
          </Trans>
        </Text>
      </View>
    </View>
  );
});

export default function OptimizationScreen() {
  const { t } = useLingui();
  const [searchQuery, setSearchQuery] = useState("");
  const [useMemoization, setUseMemoization] = useState(true);
  const [renderCount, setRenderCount] = useState(0);

  // サンプルデータ（100件）
  const allItems = useMemo(
    () =>
      Array.from({ length: 100 }, (_, i) => {
        const type =
          i % 3 === 0 ? t`商品` : i % 3 === 1 ? t`サービス` : t`カテゴリー`;
        return `${type} ${i + 1}`;
      }),
    [t],
  );

  // メモ化された検索結果
  const filteredItems = useMemo(() => {
    if (!searchQuery) return allItems;
    return allItems.filter((item) =>
      item.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [allItems, searchQuery]);

  // メモ化された統計情報
  const statistics = useMemo(() => {
    const total = filteredItems.length;
    const products = filteredItems.filter((item) =>
      item.includes(t`商品`),
    ).length;
    const services = filteredItems.filter((item) =>
      item.includes(t`サービス`),
    ).length;
    const categories = filteredItems.filter((item) =>
      item.includes(t`カテゴリー`),
    ).length;

    return { total, products, services, categories };
  }, [filteredItems, t]);

  // メモ化されたkeyExtractor
  const keyExtractor = useCallback(
    (item: string, index: number) => `${item}-${index}`,
    [],
  );

  // メモ化されたrenderItem
  const renderItem = useCallback(
    ({ item, index }: { item: string; index: number }) => {
      if (useMemoization) {
        return <ListItem item={item} index={index} />;
      }
      return <NonMemoizedItem item={item} index={index} />;
    },
    [useMemoization],
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <HeaderSection
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            useMemoization={useMemoization}
            setUseMemoization={setUseMemoization}
            statistics={statistics}
            setRenderCount={setRenderCount}
            renderCount={renderCount}
          />
        }
        ListFooterComponent={() => (
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>
              <Trans>最適化のポイント</Trans>
            </Text>
            <Text style={styles.infoText}>
              <Trans>1. useMemoで翻訳結果と計算結果をキャッシュ</Trans>
            </Text>
            <Text style={styles.infoText}>
              <Trans>2. useCallbackでコールバック関数を安定化</Trans>
            </Text>
            <Text style={styles.infoText}>
              <Trans>3. React.memoでコンポーネントの再レンダリングを防止</Trans>
            </Text>
            <Text style={styles.infoText}>
              <Trans>4. FlatListの最適化オプションを活用</Trans>
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerContainer: {
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
    marginHorizontal: 20,
    color: "#333",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#666",
    marginBottom: 24,
    marginHorizontal: 20,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  sectionDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: "#666",
    marginBottom: 12,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  buttonActive: {
    backgroundColor: "#007AFF",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
  },
  buttonTextActive: {
    color: "white",
  },
  hint: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
    marginBottom: 16,
  },
  stats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statsText: {
    fontSize: 14,
    color: "#666",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  listItem: {
    padding: 12,
    marginBottom: 1,
    marginHorizontal: 20,
    backgroundColor: "white",
    borderRadius: 8,
  },
  listItemText: {
    fontSize: 14,
    color: "#333",
  },
  infoBox: {
    backgroundColor: "#E8F4FD",
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#555",
    marginBottom: 4,
  },
});
