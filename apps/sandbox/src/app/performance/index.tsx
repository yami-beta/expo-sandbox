import { Trans } from "@lingui/react/macro";
// import { Link } from "expo-router"; // TODO: 実装後に有効化
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function PerformanceScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          <Trans>パフォーマンス最適化</Trans>
        </Text>
        <Text style={styles.description}>
          <Trans>
            Linguiを使用したReact
            Nativeアプリケーションのパフォーマンス最適化テクニックを学習します。
          </Trans>
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Trans>バンドル分析</Trans>
          </Text>
          <Text style={styles.sectionDescription}>
            <Trans>
              翻訳ファイルのサイズと使用状況を分析し、バンドルサイズ最適化の機会を特定します。
            </Trans>
          </Text>
          {/* TODO: 実装後にコメントを解除
          <Link href="/performance/bundle-analysis" style={styles.link}>
            <Text style={styles.linkText}>
              <Trans>バンドル分析ツールを開く →</Trans>
            </Text>
          </Link>
          */}
          <Text style={styles.comingSoon}>
            <Trans>（近日実装予定）</Trans>
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Trans>遅延翻訳パターン</Trans>
          </Text>
          <Text style={styles.sectionDescription}>
            <Trans>
              msgマクロを使用した遅延翻訳や、条件付きメッセージローディングのパターンを実装します。
            </Trans>
          </Text>
          {/* TODO: 実装後にコメントを解除
          <Link href="/performance/lazy-translation" style={styles.link}>
            <Text style={styles.linkText}>
              <Trans>遅延翻訳の例を見る →</Trans>
            </Text>
          </Link>
          */}
          <Text style={styles.comingSoon}>
            <Trans>（近日実装予定）</Trans>
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Trans>最適化サンプル</Trans>
          </Text>
          <Text style={styles.sectionDescription}>
            <Trans>
              useMemoやuseCallbackを活用した翻訳のメモ化と、リスト表示の最適化テクニックを紹介します。
            </Trans>
          </Text>
          {/* TODO: 実装後にコメントを解除
          <Link href="/performance/optimization" style={styles.link}>
            <Text style={styles.linkText}>
              <Trans>最適化サンプルを見る →</Trans>
            </Text>
          </Link>
          */}
          <Text style={styles.comingSoon}>
            <Trans>（近日実装予定）</Trans>
          </Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>
            <Trans>React Nativeでの制限事項</Trans>
          </Text>
          <Text style={styles.infoText}>
            <Trans>
              React
              Nativeでは、Webと異なり言語別の動的インポート（コードスプリッティング）に制限があります。
              そのため、メッセージレベルでの最適化に注力することが重要です。
            </Trans>
          </Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>
            <Trans>Metro Transformerの利点</Trans>
          </Text>
          <Text style={styles.infoText}>
            <Trans>
              このプロジェクトではMetro
              Transformerを使用しているため、.poファイルを直接インポートでき、コンパイルステップが不要です。
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
    marginBottom: 12,
  },
  link: {
    marginTop: 8,
  },
  linkText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
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
    marginBottom: 8,
    color: "#333",
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#555",
  },
  comingSoon: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
    marginTop: 8,
  },
});
