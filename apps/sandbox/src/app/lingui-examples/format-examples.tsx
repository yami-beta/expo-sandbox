import { Trans, useLingui } from "@lingui/react/macro";
import { ScrollView, View, Text, TextInput, StyleSheet } from "react-native";
import { useState } from "react";
import { useThemeContext } from "../../theme/ThemeContext";
import { useFormatters } from "../../i18n/useFormatters";

export default function FormatExamples() {
  const { theme } = useThemeContext();
  const { t } = useLingui();
  const formatters = useFormatters();

  // 基準となる現在時刻を1つに統一
  const now = Date.now();

  // サンプル用の日時と数値
  const [sampleDate] = useState(new Date(now));
  const [sampleNumber] = useState(1234567.89);
  const [sampleCurrency] = useState(12345);
  const [samplePercent] = useState(0.856);

  // 相対時間のサンプル日時（統一されたnowから計算）
  const yesterday = new Date(now - 24 * 60 * 60 * 1000);
  const tomorrow = new Date(now + 24 * 60 * 60 * 1000);
  const threeHoursAgo = new Date(now - 3 * 60 * 60 * 1000);
  const inTwoHours = new Date(now + 2 * 60 * 60 * 1000);
  const thirtyMinutesAgo = new Date(now - 30 * 60 * 1000);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* 日付フォーマット */}
      <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          <Trans>日付フォーマット</Trans>
        </Text>

        <View style={styles.example}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            <Trans>完全な日付</Trans>
          </Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {formatters.date.full(sampleDate)}
          </Text>
        </View>

        <View style={styles.example}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            <Trans>長い形式（曜日付き）</Trans>
          </Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {formatters.date.long(sampleDate)}
          </Text>
        </View>

        <View style={styles.example}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            <Trans>短い形式</Trans>
          </Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {formatters.date.short(sampleDate)}
          </Text>
        </View>

        <View style={styles.example}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            <Trans>月と日のみ</Trans>
          </Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {formatters.date.monthDay(sampleDate)}
          </Text>
        </View>

        <View style={styles.example}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            <Trans>カスタム（年と月のみ）</Trans>
          </Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {formatters.date.custom(sampleDate, {
              year: "numeric",
              month: "long",
            })}
          </Text>
        </View>
      </View>

      {/* 時刻フォーマット */}
      <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          <Trans>時刻フォーマット</Trans>
        </Text>

        <View style={styles.example}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            <Trans>時刻（24時間表記）</Trans>
          </Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {formatters.time.time(sampleDate)}
          </Text>
        </View>

        <View style={styles.example}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            <Trans>時刻と秒</Trans>
          </Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {formatters.time.timeWithSeconds(sampleDate)}
          </Text>
        </View>

        <View style={styles.example}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            <Trans>12時間表記</Trans>
          </Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {formatters.time.time12h(sampleDate)}
          </Text>
        </View>

        <View style={styles.example}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            <Trans>日付と時刻</Trans>
          </Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {formatters.time.dateTime(sampleDate)}
          </Text>
        </View>
      </View>

      {/* 数値フォーマット */}
      <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          <Trans>数値フォーマット</Trans>
        </Text>

        <View style={styles.example}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            <Trans>基本的な数値（桁区切り）</Trans>
          </Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {formatters.number.decimal(sampleNumber)}
          </Text>
        </View>

        <View style={styles.example}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            <Trans>整数のみ</Trans>
          </Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {formatters.number.integer(sampleNumber)}
          </Text>
        </View>

        <View style={styles.example}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            <Trans>小数点以下2桁まで</Trans>
          </Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {formatters.number.decimalWithPrecision(sampleNumber, 2, 2)}
          </Text>
        </View>

        <View style={styles.example}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            <Trans>パーセンテージ</Trans>
          </Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {formatters.number.percent(samplePercent)}
          </Text>
        </View>

        <View style={styles.example}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            <Trans>コンパクト表記</Trans>
          </Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {formatters.number.compact(1234567)} / {formatters.number.compact(12345678)}
          </Text>
        </View>

        <View style={styles.example}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            <Trans>TextInputでの使用例</Trans>
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: theme.colors.border,
                color: theme.colors.text,
                backgroundColor: theme.colors.background,
              },
            ]}
            placeholder={t`数値を入力: ${formatters.number.decimal(123456)}`}
            placeholderTextColor={theme.colors.text + "80"}
          />
        </View>
      </View>

      {/* 通貨フォーマット */}
      <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          <Trans>通貨フォーマット</Trans>
        </Text>

        <View style={styles.example}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            <Trans>デフォルト通貨（ロケール依存）</Trans>
          </Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {formatters.number.currency(sampleCurrency)}
          </Text>
        </View>

        <View style={styles.example}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            <Trans>整数表示</Trans>
          </Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {formatters.number.currencyInteger(sampleCurrency)}
          </Text>
        </View>

        <View style={styles.example}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            <Trans>米ドル</Trans>
          </Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {formatters.number.currency(sampleCurrency, "USD")}
          </Text>
        </View>

        <View style={styles.example}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            <Trans>ユーロ</Trans>
          </Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {formatters.number.currency(sampleCurrency, "EUR")}
          </Text>
        </View>

        <View style={styles.example}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            <Trans>英ポンド</Trans>
          </Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {formatters.number.currency(sampleCurrency, "GBP")}
          </Text>
        </View>
      </View>

      {/* 相対時間フォーマット */}
      <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          <Trans>相対時間フォーマット（簡易版）</Trans>
        </Text>

        <View style={styles.example}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            <Trans>日付の相対表示</Trans>
          </Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {formatters.relativeTime.formatRelativeDay(sampleDate)} /{" "}
            {formatters.relativeTime.formatRelativeDay(yesterday)} /{" "}
            {formatters.relativeTime.formatRelativeDay(tomorrow)}
          </Text>
        </View>

        <View style={styles.example}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            <Trans>時間の相対表示</Trans>
          </Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {formatters.relativeTime.formatRelativeHours(threeHoursAgo)} /{" "}
            {formatters.relativeTime.formatRelativeHours(inTwoHours)}
          </Text>
        </View>

        <View style={styles.example}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            <Trans>分の相対表示</Trans>
          </Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {formatters.relativeTime.formatRelativeMinutes(thirtyMinutesAgo)} /{" "}
            {formatters.relativeTime.formatRelativeMinutes(sampleDate)}
          </Text>
        </View>
      </View>

      {/* インタラクティブな例 */}
      <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          <Trans>インタラクティブな例</Trans>
        </Text>

        <View style={styles.example}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            <Trans>現在時刻（リアルタイム）</Trans>
          </Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {formatters.time.dateTime(sampleDate)}
          </Text>
        </View>

        <View style={styles.example}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            <Trans>大きな数値のフォーマット</Trans>
          </Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {formatters.number.decimal(9876543210.123)} →{" "}
            {formatters.number.compact(9876543210.123)}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  example: {
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
    paddingVertical: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    marginVertical: 4,
  },
});
