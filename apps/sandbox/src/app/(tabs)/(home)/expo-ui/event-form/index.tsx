import { DateTimePicker } from "@expo/ui/community/datetime-picker";
import { Picker } from "@expo/ui/community/picker";
import { SegmentedControl } from "@expo/ui/community/segmented-control";
import { Slider } from "@expo/ui/community/slider";
import { Stack } from "expo-router";
import { Trans, useLingui } from "@lingui/react/macro";
import { type ReactElement, type ReactNode, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Button } from "../../../../../components/button/Button";
import { Card } from "../../../../../components/card/Card";
import { ScreenScrollView } from "../../../../../components/screen-scroll-view/ScreenScrollView";
import { ThemedText } from "../../../../../components/themed-text/ThemedText";
import { useTheme } from "../../../../../theme/useTheme";

type Visibility = "public" | "friends" | "private";

const VISIBILITIES: readonly Visibility[] = ["public", "friends", "private"];

export default function EventFormScreen(): ReactElement {
  const { t } = useLingui();
  const { tokens } = useTheme();

  const [date, setDate] = useState(() => {
    const initial = new Date();
    initial.setDate(initial.getDate() + 7);
    initial.setHours(19, 0, 0, 0);
    return initial;
  });
  const [category, setCategory] = useState("meetup");
  const [visibilityIndex, setVisibilityIndex] = useState(0);
  const [reminderMinutes, setReminderMinutes] = useState(15);

  const visibilityLabels: Record<Visibility, string> = {
    public: t`公開`,
    friends: t`友達のみ`,
    private: t`非公開`,
  };
  const categoryLabels: Record<string, string> = {
    meetup: t`勉強会`,
    party: t`飲み会`,
    sports: t`スポーツ`,
    other: t`その他`,
  };

  const visibility = VISIBILITIES[visibilityIndex] ?? "public";

  // date / time の 2 フィールドで 1 つの Date を共有しているため、
  // ピッカーの戻り値をそのまま採用せず該当成分のみマージする。
  // (Android のダイアログは選択した日付の 0 時相当を返し、時刻成分が巻き戻るため)
  const handleDateChange = (next: Date) => {
    setDate((prev) => {
      const merged = new Date(prev);
      merged.setFullYear(next.getFullYear(), next.getMonth(), next.getDate());
      return merged;
    });
  };
  const handleTimeChange = (next: Date) => {
    setDate((prev) => {
      const merged = new Date(prev);
      merged.setHours(next.getHours(), next.getMinutes(), 0, 0);
      return merged;
    });
  };

  return (
    <>
      <Stack.Screen.Title>{t`イベント作成`}</Stack.Screen.Title>
      <ScreenScrollView>
        <FormField
          label={<Trans>開催日</Trans>}
          description={
            <Trans>DateTimePicker (date)。iOS はインライン、Android はダイアログで選択</Trans>
          }
        >
          <DateField mode="date" value={date} onValueChange={handleDateChange} />
        </FormField>

        <FormField
          label={<Trans>開始時刻</Trans>}
          description={<Trans>DateTimePicker (time)</Trans>}
        >
          <DateField mode="time" value={date} onValueChange={handleTimeChange} />
        </FormField>

        <FormField
          label={<Trans>カテゴリ</Trans>}
          description={<Trans>Picker。iOS はホイール、Android はドロップダウン</Trans>}
        >
          <Picker selectedValue={category} onValueChange={(value) => setCategory(String(value))}>
            {Object.entries(categoryLabels).map(([value, label]) => (
              <Picker.Item key={value} label={label} value={value} />
            ))}
          </Picker>
        </FormField>

        <FormField label={<Trans>公開範囲</Trans>} description={<Trans>SegmentedControl</Trans>}>
          <SegmentedControl
            values={VISIBILITIES.map((value) => visibilityLabels[value])}
            selectedIndex={visibilityIndex}
            onChange={(event) => setVisibilityIndex(event.nativeEvent.selectedSegmentIndex)}
          />
        </FormField>

        <FormField
          label={<Trans>リマインダー</Trans>}
          description={<Trans>Slider。5 分刻みで 0〜60 分前</Trans>}
        >
          <View style={{ gap: tokens.spacing.xs }}>
            <Slider
              value={reminderMinutes}
              minimumValue={0}
              maximumValue={60}
              step={5}
              onValueChange={(value) => setReminderMinutes(Math.round(value))}
            />
            <ThemedText type="caption" tone="secondary">
              {reminderMinutes === 0 ? t`通知しない` : t`${reminderMinutes} 分前に通知`}
            </ThemedText>
          </View>
        </FormField>

        <Card tone="surfaceElevated">
          <View style={{ gap: tokens.spacing.xs }}>
            <ThemedText type="bodyEmphasis">
              <Trans>作成内容</Trans>
            </ThemedText>
            <ThemedText type="caption" tone="secondary">
              {t`開催: ${formatDate(date)} ${formatTime(date)}`}
            </ThemedText>
            <ThemedText type="caption" tone="secondary">
              {t`カテゴリ: ${categoryLabels[category]} / 公開範囲: ${visibilityLabels[visibility]}`}
            </ThemedText>
            <ThemedText type="caption" tone="secondary">
              {reminderMinutes === 0
                ? t`リマインダー: なし`
                : t`リマインダー: ${reminderMinutes} 分前`}
            </ThemedText>
          </View>
        </Card>
      </ScreenScrollView>
    </>
  );
}

interface FormFieldProps {
  label: ReactNode;
  description?: ReactNode;
  children: ReactNode;
}

function FormField({ label, description, children }: FormFieldProps): ReactElement {
  const { tokens } = useTheme();
  return (
    <View style={{ gap: tokens.spacing.sm }}>
      <View style={{ gap: tokens.spacing.xs }}>
        <ThemedText type="label">{label}</ThemedText>
        {description ? (
          <ThemedText type="caption" tone="tertiary">
            {description}
          </ThemedText>
        ) : null}
      </View>
      {children}
    </View>
  );
}

interface DateFieldProps {
  mode: "date" | "time";
  value: Date;
  onValueChange: (date: Date) => void;
}

/**
 * DateTimePicker の OS 差を吸収するフィールド。
 * - iOS: presentation は常に inline のためそのまま配置する。
 * - Android: 既定の presentation "dialog" はマウントと同時にダイアログが開き、
 *   確定/キャンセルで閉じる (呼び出し側がアンマウントする) 仕様のため、
 *   ボタン押下でマウントする @react-native-community/datetimepicker と同じ慣習で組む。
 */
function DateField({ mode, value, onValueChange }: DateFieldProps): ReactElement {
  const [dialogVisible, setDialogVisible] = useState(false);

  if (Platform.OS === "ios") {
    // iOS 実装は Host matchContents が縦方向のみで、横幅は親レイアウト任せ。
    // 幅を縮める (alignItems: flex-start 等) と日付カプセルが画面外に描画されるため、
    // 横幅いっぱいに伸ばしたまま配置する。
    return (
      <DateTimePicker
        value={value}
        mode={mode}
        onValueChange={(_event, date) => onValueChange(date)}
      />
    );
  }

  return (
    <>
      <View style={styles.androidButtonRow}>
        <Button variant="outline" size="sm" onPress={() => setDialogVisible(true)}>
          {mode === "date" ? formatDate(value) : formatTime(value)}
        </Button>
      </View>
      {dialogVisible ? (
        <DateTimePicker
          value={value}
          mode={mode}
          onValueChange={(_event, date) => {
            setDialogVisible(false);
            onValueChange(date);
          }}
          onDismiss={() => setDialogVisible(false)}
        />
      ) : null}
    </>
  );
}

function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

const styles = StyleSheet.create({
  androidButtonRow: {
    alignItems: "flex-start",
  },
});
