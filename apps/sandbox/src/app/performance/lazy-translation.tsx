import { msg } from "@lingui/core/macro";
import { Trans, useLingui } from "@lingui/react/macro";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";

// 遅延翻訳の例1: ドロップダウンの選択肢
const countryOptions = [
  { value: "jp", label: msg`日本` },
  { value: "us", label: msg`アメリカ` },
  { value: "uk", label: msg`イギリス` },
  { value: "fr", label: msg`フランス` },
  { value: "de", label: msg`ドイツ` },
];

// 遅延翻訳の例2: ステータスメッセージのマッピング
const statusMessages = {
  pending: msg`処理待ち`,
  processing: msg`処理中`,
  completed: msg`完了`,
  failed: msg`失敗`,
} as const;

type Status = keyof typeof statusMessages;

export default function LazyTranslationScreen() {
  const { i18n } = useLingui();
  const [selectedCountry, setSelectedCountry] = useState("jp");
  const [currentStatus, setCurrentStatus] = useState<Status>("pending");

  const statusList: Status[] = ["pending", "processing", "completed", "failed"];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          <Trans>遅延翻訳パターン</Trans>
        </Text>
        <Text style={styles.description}>
          <Trans>
            msgマクロを使用すると、翻訳を事前に定義して後で使用できます。
            ドロップダウンやステータス表示など、動的な選択肢に最適です。
          </Trans>
        </Text>

        {/* Linguiの遅延ロードの仕組み */}
        <View style={styles.explanationBox}>
          <Text style={styles.explanationTitle}>
            <Trans>📚 Linguiの遅延ロードの仕組み</Trans>
          </Text>
          <Text style={styles.explanationText}>
            <Trans>
              msgマクロは翻訳を実行せず、MessageDescriptor（翻訳に必要な情報を含むオブジェクト）を返します。
              実際の翻訳はi18n._()を呼ぶまで遅延されます。
            </Trans>
          </Text>
          <View style={styles.codeExample}>
            <Text style={styles.codeText}>
              {`// 即時翻訳（t マクロ）
const label = t\`商品\`; // すぐに翻訳

// 遅延翻訳（msg マクロ）  
const message = msg\`商品\`; // Descriptor返却
const translated = i18n._(message); // 使用時に翻訳`}
            </Text>
          </View>
        </View>

        {/* React Nativeでの制限事項 */}
        <View style={styles.warningBox}>
          <Text style={styles.warningTitle}>
            <Trans>⚠️ React Nativeでの制限事項</Trans>
          </Text>
          <Text style={styles.warningText}>
            <Trans>
              Webと異なり、React Nativeでは動的インポートができないため、
              すべての翻訳ファイルが最初からバンドルに含まれます。
              そのため、バンドルサイズ削減効果はありません。
            </Trans>
          </Text>
          <Text style={styles.warningSubText}>
            <Trans>
              主な価値：コードの整理、型安全性、翻訳タイミングの制御
            </Trans>
          </Text>
        </View>

        {/* 実際に効果があるケース */}
        <View style={styles.benefitBox}>
          <Text style={styles.benefitTitle}>
            <Trans>✅ 実際に効果があるケース</Trans>
          </Text>
          <Text style={styles.benefitItem}>
            <Trans>• 条件付き翻訳（使わないメッセージを翻訳しない）</Trans>
          </Text>
          <Text style={styles.benefitItem}>
            <Trans>• 大量データの初期化コスト削減</Trans>
          </Text>
          <Text style={styles.benefitItem}>
            <Trans>• メモリ使用量の最適化（未使用翻訳のメモリ節約）</Trans>
          </Text>
          <Text style={styles.benefitItem}>
            <Trans>• タブやモーダルの遅延初期化</Trans>
          </Text>
        </View>

        {/* 例1: 国選択ドロップダウン */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Trans>例1: 国選択ドロップダウン</Trans>
          </Text>
          <Text style={styles.sectionDescription}>
            <Trans>
              選択肢を事前に定義し、必要な時に翻訳します。
              これにより、コードの整理と再利用性が向上します。
            </Trans>
          </Text>

          <View style={styles.buttonGroup}>
            {countryOptions.map((option) => (
              <Pressable
                key={option.value}
                style={[
                  styles.countryButton,
                  selectedCountry === option.value &&
                    styles.countryButtonActive,
                ]}
                onPress={() => setSelectedCountry(option.value)}
              >
                <Text
                  style={[
                    styles.countryButtonText,
                    selectedCountry === option.value &&
                      styles.countryButtonTextActive,
                  ]}
                >
                  {i18n._(option.label)}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.result}>
            <Trans>選択された国:</Trans>{" "}
            {i18n._(
              countryOptions.find((c) => c.value === selectedCountry)?.label!,
            )}
          </Text>
        </View>

        {/* 例2: ステータス表示 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Trans>例2: ステータス表示システム</Trans>
          </Text>
          <Text style={styles.sectionDescription}>
            <Trans>
              APIレスポンスなどのステータスコードを、事前定義した翻訳メッセージにマッピングします。
            </Trans>
          </Text>

          <View style={styles.statusContainer}>
            {statusList.map((status) => (
              <Pressable
                key={status}
                style={[
                  styles.statusButton,
                  currentStatus === status && styles.statusButtonActive,
                ]}
                onPress={() => setCurrentStatus(status)}
              >
                <Text
                  style={[
                    styles.statusButtonText,
                    currentStatus === status && styles.statusButtonTextActive,
                  ]}
                >
                  {i18n._(statusMessages[status])}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={[styles.statusDisplay, styles[currentStatus]]}>
            <Text style={styles.statusText}>
              <Trans>現在のステータス:</Trans>{" "}
              {i18n._(statusMessages[currentStatus])}
            </Text>
          </View>
        </View>

        {/* msgマクロの利点 */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>
            <Trans>msgマクロを使うメリット</Trans>
          </Text>
          <Text style={styles.infoText}>
            <Trans>1. 選択肢やマッピングを定数として定義できる</Trans>
          </Text>
          <Text style={styles.infoText}>
            <Trans>2. TypeScriptの型安全性を保てる</Trans>
          </Text>
          <Text style={styles.infoText}>
            <Trans>3. 翻訳が必要な時だけ実行される（遅延評価）</Trans>
          </Text>
          <Text style={styles.infoText}>
            <Trans>4. コードの可読性と保守性が向上する</Trans>
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
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#666",
    marginBottom: 24,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
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
    marginBottom: 8,
    color: "#333",
  },
  sectionDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: "#666",
    marginBottom: 16,
  },
  buttonGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  countryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  countryButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  countryButtonText: {
    fontSize: 14,
    color: "#666",
  },
  countryButtonTextActive: {
    color: "white",
    fontWeight: "600",
  },
  result: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  statusContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  statusButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  statusButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  statusButtonText: {
    fontSize: 14,
    color: "#666",
  },
  statusButtonTextActive: {
    color: "white",
    fontWeight: "600",
  },
  statusDisplay: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  pending: {
    backgroundColor: "#FFF3E0",
    borderLeftWidth: 4,
    borderLeftColor: "#FF9800",
  },
  processing: {
    backgroundColor: "#E3F2FD",
    borderLeftWidth: 4,
    borderLeftColor: "#2196F3",
  },
  completed: {
    backgroundColor: "#E8F5E9",
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  failed: {
    backgroundColor: "#FFEBEE",
    borderLeftWidth: 4,
    borderLeftColor: "#F44336",
  },
  infoBox: {
    backgroundColor: "#E8F4FD",
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
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
  explanationBox: {
    backgroundColor: "#F0F8FF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#4169E1",
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  explanationText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#555",
    marginBottom: 12,
  },
  codeExample: {
    backgroundColor: "#2D3748",
    borderRadius: 6,
    padding: 12,
    marginTop: 8,
  },
  codeText: {
    fontSize: 12,
    lineHeight: 18,
    color: "#E2E8F0",
    fontFamily: "monospace",
  },
  warningBox: {
    backgroundColor: "#FFF9E6",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#FFC107",
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  warningText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#555",
    marginBottom: 8,
  },
  warningSubText: {
    fontSize: 13,
    lineHeight: 18,
    color: "#666",
    fontStyle: "italic",
  },
  benefitBox: {
    backgroundColor: "#E8F5E9",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  benefitItem: {
    fontSize: 14,
    lineHeight: 20,
    color: "#555",
    marginBottom: 6,
  },
});
