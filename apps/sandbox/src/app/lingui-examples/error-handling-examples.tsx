import { Trans, useLingui } from "@lingui/react/macro";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";

// ===========================
// エラーコード定義
// ===========================
const ERROR_CODES = {
  // バリデーションエラー
  FIELD_REQUIRED: "V001",
  INVALID_EMAIL: "V002",
  PASSWORD_TOO_SHORT: "V003",
  PASSWORD_TOO_WEAK: "V004",
  VALUE_OUT_OF_RANGE: "V005",
  // ネットワークエラー
  NETWORK_ERROR: "N001",
  TIMEOUT: "N002",
  NOT_FOUND: "N003",
  UNAUTHORIZED: "N004",
  SERVER_ERROR: "N005",
  // システムエラー
  SYSTEM_ERROR: "S001",
  PERMISSION_DENIED: "S002",
  STORAGE_FULL: "S003",
} as const;

type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

// エラー情報の型定義
interface ErrorInfo {
  code: ErrorCode;
  field?: string;
  value?: string | number;
  retryable?: boolean;
}

// ===========================
// セクション1: エラーコード管理デモ
// ===========================
function ErrorCodeDemo() {
  const { t } = useLingui();
  const [selectedError, setSelectedError] = useState<ErrorCode | null>(null);

  // エラーコードからメッセージを取得する関数
  const getErrorMessage = (errorInfo: ErrorInfo): string => {
    const { code, field, value } = errorInfo;

    switch (code) {
      case ERROR_CODES.FIELD_REQUIRED:
        return field ? t`${field}は必須項目です` : t`この項目は必須です`;
      case ERROR_CODES.INVALID_EMAIL:
        return t`有効なメールアドレスを入力してください`;
      case ERROR_CODES.PASSWORD_TOO_SHORT:
        return t`パスワードは最低${value ?? 8}文字以上必要です`;
      case ERROR_CODES.PASSWORD_TOO_WEAK:
        return t`パスワードは大文字、小文字、数字を含む必要があります`;
      case ERROR_CODES.VALUE_OUT_OF_RANGE:
        return t`値は範囲外です`;
      case ERROR_CODES.NETWORK_ERROR:
        return t`ネットワークエラーが発生しました`;
      case ERROR_CODES.TIMEOUT:
        return t`リクエストがタイムアウトしました`;
      case ERROR_CODES.NOT_FOUND:
        return t`リソースが見つかりません`;
      case ERROR_CODES.UNAUTHORIZED:
        return t`認証が必要です`;
      case ERROR_CODES.SERVER_ERROR:
        return t`サーバーエラーが発生しました`;
      case ERROR_CODES.SYSTEM_ERROR:
        return t`システムエラーが発生しました`;
      case ERROR_CODES.PERMISSION_DENIED:
        return t`権限がありません`;
      case ERROR_CODES.STORAGE_FULL:
        return t`ストレージの空き容量が不足しています`;
      default:
        return t`エラーが発生しました`;
    }
  };

  // サンプルエラー
  const sampleErrors: { info: ErrorInfo; label: string }[] = [
    {
      info: { code: ERROR_CODES.FIELD_REQUIRED, field: t`メールアドレス` },
      label: t`必須フィールドエラー`,
    },
    {
      info: { code: ERROR_CODES.INVALID_EMAIL },
      label: t`メール形式エラー`,
    },
    {
      info: { code: ERROR_CODES.PASSWORD_TOO_SHORT, value: 10 },
      label: t`パスワード長エラー`,
    },
    {
      info: { code: ERROR_CODES.NETWORK_ERROR, retryable: true },
      label: t`ネットワークエラー`,
    },
    {
      info: { code: ERROR_CODES.SERVER_ERROR, retryable: true },
      label: t`サーバーエラー`,
    },
  ];

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        <Trans>1. エラーコード管理</Trans>
      </Text>
      <Text style={styles.description}>
        <Trans>エラーコードから適切な翻訳メッセージを生成します</Trans>
      </Text>

      <View style={styles.errorGrid}>
        {sampleErrors.map((error, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.errorCard, selectedError === error.info.code && styles.errorCardActive]}
            onPress={() => setSelectedError(error.info.code)}
          >
            <Text style={styles.errorCodeLabel}>{error.info.code}</Text>
            <Text style={styles.errorTypeLabel}>{error.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedError && (
        <View style={styles.errorDisplay}>
          <Text style={styles.errorDisplayTitle}>
            <Trans>エラーメッセージ:</Trans>
          </Text>
          <Text style={styles.errorMessage}>
            {getErrorMessage(
              sampleErrors.find((e) => e.info.code === selectedError)?.info ?? {
                code: selectedError,
              },
            )}
          </Text>
          {sampleErrors.find((e) => e.info.code === selectedError)?.info.retryable && (
            <TouchableOpacity style={styles.retryButton}>
              <Text style={styles.retryButtonText}>
                <Trans>再試行</Trans>
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

// ===========================
// セクション2: フォームバリデーション
// ===========================
function FormValidationDemo() {
  const { t } = useLingui();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    age: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // バリデーション関数
  const validateField = (field: string, value: string): string | null => {
    switch (field) {
      case "email":
        if (!value) {
          return t`メールアドレスは必須です`;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return t`有効なメールアドレスを入力してください`;
        }
        return null;

      case "password":
        if (!value) {
          return t`パスワードは必須です`;
        }
        if (value.length < 8) {
          return t`パスワードは8文字以上必要です`;
        }
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          return t`パスワードは大文字、小文字、数字を含む必要があります`;
        }
        return null;

      case "age":
        if (!value) {
          return t`年齢は必須です`;
        }
        const age = parseInt(value, 10);
        if (isNaN(age)) {
          return t`有効な数値を入力してください`;
        }
        if (age < 18 || age > 120) {
          return t`年齢は18歳から120歳の間で入力してください`;
        }
        return null;

      default:
        return null;
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // リアルタイムバリデーション（タッチ済みの場合のみ）
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({
        ...prev,
        [field]: error || "",
      }));
    }
  };

  const handleFieldBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field as keyof typeof formData]);
    setErrors((prev) => ({
      ...prev,
      [field]: error || "",
    }));
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    let hasError = false;

    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field as keyof typeof formData]);
      if (error) {
        newErrors[field] = error;
        hasError = true;
      }
    });

    setErrors(newErrors);
    setTouched({ email: true, password: true, age: true });

    if (!hasError) {
      Alert.alert(t`成功`, t`フォームが正常に送信されました`);
    }
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        <Trans>2. フォームバリデーション</Trans>
      </Text>
      <Text style={styles.description}>
        <Trans>リアルタイムバリデーションと複数エラーの管理</Trans>
      </Text>

      <View style={styles.form}>
        <View style={styles.formField}>
          <Text style={styles.label}>
            <Trans>メールアドレス</Trans>
          </Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            value={formData.email}
            onChangeText={(text) => handleFieldChange("email", text)}
            onBlur={() => handleFieldBlur("email")}
            placeholder={t`example@email.com`}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <Text style={styles.fieldError}>{errors.email}</Text>}
        </View>

        <View style={styles.formField}>
          <Text style={styles.label}>
            <Trans>パスワード</Trans>
          </Text>
          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            value={formData.password}
            onChangeText={(text) => handleFieldChange("password", text)}
            onBlur={() => handleFieldBlur("password")}
            placeholder={t`8文字以上`}
            secureTextEntry
          />
          {errors.password && <Text style={styles.fieldError}>{errors.password}</Text>}
        </View>

        <View style={styles.formField}>
          <Text style={styles.label}>
            <Trans>年齢</Trans>
          </Text>
          <TextInput
            style={[styles.input, errors.age && styles.inputError]}
            value={formData.age}
            onChangeText={(text) => handleFieldChange("age", text)}
            onBlur={() => handleFieldBlur("age")}
            placeholder={t`18-120`}
            keyboardType="numeric"
          />
          {errors.age && <Text style={styles.fieldError}>{errors.age}</Text>}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>
            <Trans>送信</Trans>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ===========================
// セクション3: APIエラーハンドリング
// ===========================
function ApiErrorDemo() {
  const { t } = useLingui();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorInfo | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // HTTPステータスコードからエラーコードへのマッピング
  const getErrorFromStatus = (status: number): ErrorInfo => {
    switch (status) {
      case 401:
        return { code: ERROR_CODES.UNAUTHORIZED };
      case 404:
        return { code: ERROR_CODES.NOT_FOUND };
      case 408:
        return { code: ERROR_CODES.TIMEOUT, retryable: true };
      case 500:
      case 502:
      case 503:
        return { code: ERROR_CODES.SERVER_ERROR, retryable: true };
      default:
        if (status >= 400 && status < 500) {
          return { code: ERROR_CODES.SYSTEM_ERROR };
        }
        if (status >= 500) {
          return { code: ERROR_CODES.SERVER_ERROR, retryable: true };
        }
        return { code: ERROR_CODES.NETWORK_ERROR, retryable: true };
    }
  };

  // APIリクエストのシミュレーション
  const simulateApiCall = async (shouldFail: boolean, statusCode?: number) => {
    setLoading(true);
    setError(null);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (shouldFail && statusCode) {
      const errorInfo = getErrorFromStatus(statusCode);
      setError(errorInfo);
      setLoading(false);
      return;
    }

    setLoading(false);
    Alert.alert(t`成功`, t`データの取得に成功しました`);
  };

  const handleRetry = () => {
    if (error?.retryable) {
      setRetryCount((prev) => prev + 1);
      simulateApiCall(retryCount < 2, 500);
    }
  };

  // エラーシナリオ
  const errorScenarios = [
    { status: 404, label: t`404 Not Found` },
    { status: 401, label: t`401 Unauthorized` },
    { status: 408, label: t`408 Timeout` },
    { status: 500, label: t`500 Server Error` },
    { status: 503, label: t`503 Service Unavailable` },
  ];

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        <Trans>3. APIエラーハンドリング</Trans>
      </Text>
      <Text style={styles.description}>
        <Trans>HTTPステータスコードに応じたエラー処理とリトライ機能</Trans>
      </Text>

      <View style={styles.scenarioGrid}>
        {errorScenarios.map((scenario) => (
          <TouchableOpacity
            key={scenario.status}
            style={styles.scenarioButton}
            onPress={() => simulateApiCall(true, scenario.status)}
            disabled={loading}
          >
            <Text style={styles.scenarioButtonText}>{scenario.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.successButton, loading && styles.buttonDisabled]}
        onPress={() => simulateApiCall(false)}
        disabled={loading}
      >
        <Text style={styles.successButtonText}>
          <Trans>成功リクエスト</Trans>
        </Text>
      </TouchableOpacity>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>
            <Trans>読み込み中...</Trans>
          </Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>
            <Trans>エラーが発生しました</Trans>
          </Text>
          <Text style={styles.errorCode}>{t`エラーコード: ${error.code}`}</Text>
          <Text style={styles.errorDescription}>
            {error.code === ERROR_CODES.NOT_FOUND && (
              <Trans>要求されたリソースが見つかりません</Trans>
            )}
            {error.code === ERROR_CODES.UNAUTHORIZED && (
              <Trans>このリソースにアクセスする権限がありません</Trans>
            )}
            {error.code === ERROR_CODES.TIMEOUT && (
              <Trans>サーバーからの応答がありませんでした。もう一度お試しください</Trans>
            )}
            {error.code === ERROR_CODES.SERVER_ERROR && (
              <Trans>サーバーで問題が発生しました。しばらくしてからもう一度お試しください</Trans>
            )}
          </Text>
          {error.retryable && (
            <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
              <Text style={styles.retryButtonText}>
                <Trans>再試行</Trans> {retryCount > 0 && `(${retryCount})`}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

// ===========================
// メインコンポーネント
// ===========================
export default function ErrorHandlingExamples() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <ErrorCodeDemo />
        <FormValidationDemo />
        <ApiErrorDemo />
      </View>
    </ScrollView>
  );
}

// ===========================
// スタイル定義
// ===========================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: "#fff",
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
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  // エラーコードデモのスタイル
  errorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  errorCard: {
    backgroundColor: "#f8f8f8",
    borderRadius: 6,
    padding: 12,
    margin: 4,
    minWidth: 100,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  errorCardActive: {
    backgroundColor: "#e3f2fd",
    borderColor: "#2196F3",
  },
  errorCodeLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 4,
  },
  errorTypeLabel: {
    fontSize: 11,
    color: "#888",
  },
  errorDisplay: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#fff3e0",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ffb74d",
  },
  errorDisplayTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 4,
  },
  errorMessage: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  // フォームバリデーションのスタイル
  form: {
    marginTop: 8,
  },
  formField: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    backgroundColor: "#fff",
  },
  inputError: {
    borderColor: "#f44336",
  },
  fieldError: {
    fontSize: 12,
    color: "#f44336",
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  // APIエラーデモのスタイル
  scenarioGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
    marginBottom: 12,
  },
  scenarioButton: {
    backgroundColor: "#ff9800",
    borderRadius: 6,
    padding: 10,
    margin: 4,
    flex: 1,
    minWidth: 100,
    alignItems: "center",
  },
  scenarioButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  successButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 12,
  },
  successButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  loadingContainer: {
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
  },
  errorContainer: {
    backgroundColor: "#ffebee",
    borderRadius: 6,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ef5350",
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#c62828",
    marginBottom: 8,
  },
  errorCode: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
    fontFamily: "monospace",
  },
  errorDescription: {
    fontSize: 14,
    color: "#333",
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
