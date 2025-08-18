import { useLingui } from "@lingui/react/macro";
import { createFormatters } from "./formatters";

// フォーマッター関数を返すカスタムフック
// useLinguiを使うことで、言語変更時に自動的に再レンダリングされる
export function useFormatters() {
  // 言語変更を検知するためにuseLinguiを呼び出す
  // これにより言語が変更されたときにコンポーネントが再レンダリングされる
  const { i18n } = useLingui();

  // i18nインスタンスを渡してフォーマッターを作成
  // 各フォーマッター関数は渡されたi18nオブジェクトを参照するため、
  // 現在の言語設定に応じた適切なフォーマットが適用される
  return createFormatters(i18n);
}

// 日付フォーマット専用フック
export function useDateFormatters() {
  const { i18n } = useLingui();
  return createFormatters(i18n).date;
}

// 時刻フォーマット専用フック
export function useTimeFormatters() {
  const { i18n } = useLingui();
  return createFormatters(i18n).time;
}

// 数値フォーマット専用フック
export function useNumberFormatters() {
  const { i18n } = useLingui();
  return createFormatters(i18n).number;
}

// 相対時間フォーマット専用フック
export function useRelativeTimeFormatters() {
  const { i18n } = useLingui();
  return createFormatters(i18n).relativeTime;
}