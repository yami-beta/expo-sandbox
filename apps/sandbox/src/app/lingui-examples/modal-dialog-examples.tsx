import { StyleSheet, Text, View, ScrollView, Pressable, Modal, Alert } from "react-native";
import { useState } from "react";
import { useThemeContext } from "../../theme/ThemeContext";
import { Trans, useLingui } from "@lingui/react/macro";
import { plural } from "@lingui/core/macro";

// 確認ダイアログコンポーネント
const ConfirmDialog = ({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  theme,
}: {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  theme: any;
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.modalOverlay}>
        <View style={[styles.dialogContainer, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.dialogTitle, { color: theme.colors.text }]}>{title}</Text>
          <Text style={[styles.dialogMessage, { color: theme.colors.text }]}>{message}</Text>
          <View style={styles.dialogButtons}>
            <Pressable
              style={({ pressed }) => [
                styles.dialogButton,
                styles.cancelButton,
                {
                  backgroundColor: pressed ? theme.colors.border : theme.colors.background,
                },
              ]}
              onPress={onCancel}
            >
              <Text style={[styles.dialogButtonText, { color: theme.colors.text }]}>
                <Trans>キャンセル</Trans>
              </Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.dialogButton,
                styles.confirmButton,
                {
                  backgroundColor: pressed ? theme.colors.border : theme.colors.primary,
                },
              ]}
              onPress={onConfirm}
            >
              <Text style={[styles.dialogButtonText, { color: "white" }]}>
                <Trans>OK</Trans>
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// アクションシートコンポーネント
const ActionSheet = ({
  visible,
  title,
  options,
  onSelect,
  onCancel,
  theme,
}: {
  visible: boolean;
  title: string;
  options: { label: string; destructive?: boolean }[];
  onSelect: (index: number) => void;
  onCancel: () => void;
  theme: any;
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <Pressable style={styles.modalOverlay} onPress={onCancel}>
        <View style={[styles.actionSheetContainer, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.actionSheetTitle, { color: theme.colors.text }]}>{title}</Text>
          {options.map((option, index) => (
            <Pressable
              key={index}
              style={({ pressed }) => [
                styles.actionSheetOption,
                {
                  backgroundColor: pressed ? theme.colors.border : "transparent",
                },
              ]}
              onPress={() => onSelect(index)}
            >
              <Text
                style={[
                  styles.actionSheetOptionText,
                  {
                    color: option.destructive ? theme.colors.notification : theme.colors.primary,
                  },
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          ))}
          <View style={[styles.actionSheetDivider, { backgroundColor: theme.colors.border }]} />
          <Pressable
            style={({ pressed }) => [
              styles.actionSheetOption,
              {
                backgroundColor: pressed ? theme.colors.border : "transparent",
              },
            ]}
            onPress={onCancel}
          >
            <Text
              style={[
                styles.actionSheetOptionText,
                styles.actionSheetCancel,
                { color: theme.colors.text },
              ]}
            >
              <Trans>キャンセル</Trans>
            </Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

// カスタムモーダルコンポーネント
const CustomModal = ({
  visible,
  type,
  title,
  message,
  onClose,
  theme,
}: {
  visible: boolean;
  type: "success" | "error" | "info";
  title: string;
  message: string;
  onClose: () => void;
  theme: any;
}) => {
  const getIconColor = () => {
    switch (type) {
      case "success":
        return "#4CAF50";
      case "error":
        return theme.colors.notification;
      case "info":
      default:
        return theme.colors.primary;
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      case "info":
      default:
        return "i";
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.customModalContainer, { backgroundColor: theme.colors.card }]}>
          <View style={[styles.customModalIcon, { backgroundColor: getIconColor() }]}>
            <Text style={styles.customModalIconText}>{getIcon()}</Text>
          </View>
          <Text style={[styles.customModalTitle, { color: theme.colors.text }]}>{title}</Text>
          <Text style={[styles.customModalMessage, { color: theme.colors.text }]}>{message}</Text>
          <Pressable
            style={({ pressed }) => [
              styles.customModalButton,
              {
                backgroundColor: pressed ? theme.colors.border : theme.colors.primary,
              },
            ]}
            onPress={onClose}
          >
            <Text style={styles.customModalButtonText}>
              <Trans>閉じる</Trans>
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default function ModalDialogExamples() {
  const { theme } = useThemeContext();
  const { t } = useLingui();

  // 削除アイテム数
  const [deleteCount, setDeleteCount] = useState(1);

  // ダイアログの表示状態
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);

  // 選択結果
  const [lastAction, setLastAction] = useState("");

  // 確認ダイアログの処理
  const handleDeleteConfirm = () => {
    setConfirmVisible(false);
    setLastAction(t`${deleteCount}件のアイテムを削除しました`);
    setSuccessModalVisible(true);
  };

  // アクションシートの選択肢
  const actionSheetOptions = [
    { label: t`写真を撮る`, destructive: false },
    { label: t`ライブラリから選択`, destructive: false },
    { label: t`削除`, destructive: true },
  ];

  // アクションシートの処理
  const handleActionSelect = (index: number) => {
    setActionSheetVisible(false);
    setLastAction(t`「${actionSheetOptions[index]?.label}」を選択しました`);
  };

  // React Native標準のAlertも使用
  const showNativeAlert = () => {
    Alert.alert(t`ネイティブアラート`, t`これはReact Native標準のAlertです`, [
      {
        text: t`キャンセル`,
        style: "cancel",
      },
      {
        text: t`OK`,
        onPress: () => setLastAction(t`ネイティブアラートでOKが押されました`),
      },
    ]);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          <Trans>モーダルダイアログ</Trans>
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text }]}>
          <Trans>確認ダイアログ、アクションシート、カスタムモーダルの例</Trans>
        </Text>
      </View>

      {/* 確認ダイアログセクション */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          <Trans>確認ダイアログ</Trans>
        </Text>
        <View style={styles.inputRow}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            <Trans>削除アイテム数:</Trans>
          </Text>
          <View style={styles.counterContainer}>
            <Pressable
              style={[styles.counterButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => setDeleteCount(Math.max(1, deleteCount - 1))}
            >
              <Text style={styles.counterButtonText}>-</Text>
            </Pressable>
            <Text style={[styles.counterValue, { color: theme.colors.text }]}>{deleteCount}</Text>
            <Pressable
              style={[styles.counterButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => setDeleteCount(deleteCount + 1)}
            >
              <Text style={styles.counterButtonText}>+</Text>
            </Pressable>
          </View>
        </View>
        <Pressable
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={() => setConfirmVisible(true)}
        >
          <Text style={styles.buttonText}>
            <Trans>削除確認ダイアログを表示</Trans>
          </Text>
        </Pressable>
      </View>

      {/* アクションシートセクション */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          <Trans>アクションシート</Trans>
        </Text>
        <Pressable
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={() => setActionSheetVisible(true)}
        >
          <Text style={styles.buttonText}>
            <Trans>アクションシートを表示</Trans>
          </Text>
        </Pressable>
      </View>

      {/* カスタムモーダルセクション */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          <Trans>カスタムモーダル</Trans>
        </Text>
        <View style={styles.buttonRow}>
          <Pressable
            style={[styles.smallButton, { backgroundColor: "#4CAF50" }]}
            onPress={() => setSuccessModalVisible(true)}
          >
            <Text style={styles.buttonText}>
              <Trans>成功</Trans>
            </Text>
          </Pressable>
          <Pressable
            style={[styles.smallButton, { backgroundColor: theme.colors.notification }]}
            onPress={() => setErrorModalVisible(true)}
          >
            <Text style={styles.buttonText}>
              <Trans>エラー</Trans>
            </Text>
          </Pressable>
          <Pressable
            style={[styles.smallButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => setInfoModalVisible(true)}
          >
            <Text style={styles.buttonText}>
              <Trans>情報</Trans>
            </Text>
          </Pressable>
        </View>
      </View>

      {/* ネイティブアラートセクション */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          <Trans>ネイティブアラート</Trans>
        </Text>
        <Pressable
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={showNativeAlert}
        >
          <Text style={styles.buttonText}>
            <Trans>React Native Alertを表示</Trans>
          </Text>
        </Pressable>
      </View>

      {/* 結果表示 */}
      {lastAction ? (
        <View style={[styles.resultBox, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.resultLabel, { color: theme.colors.text }]}>
            <Trans>最後のアクション:</Trans>
          </Text>
          <Text style={[styles.resultText, { color: theme.colors.text }]}>{lastAction}</Text>
        </View>
      ) : null}

      {/* 確認ダイアログ */}
      <ConfirmDialog
        visible={confirmVisible}
        title={t`削除の確認`}
        message={plural(deleteCount, {
          one: "1件のアイテムを削除しますか？",
          other: "#件のアイテムを削除しますか？",
        })}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmVisible(false)}
        theme={theme}
      />

      {/* アクションシート */}
      <ActionSheet
        visible={actionSheetVisible}
        title={t`画像の選択`}
        options={actionSheetOptions}
        onSelect={handleActionSelect}
        onCancel={() => setActionSheetVisible(false)}
        theme={theme}
      />

      {/* 成功モーダル */}
      <CustomModal
        visible={successModalVisible}
        type="success"
        title={t`成功`}
        message={t`操作が正常に完了しました`}
        onClose={() => setSuccessModalVisible(false)}
        theme={theme}
      />

      {/* エラーモーダル */}
      <CustomModal
        visible={errorModalVisible}
        type="error"
        title={t`エラー`}
        message={t`操作中にエラーが発生しました`}
        onClose={() => setErrorModalVisible(false)}
        theme={theme}
      />

      {/* 情報モーダル */}
      <CustomModal
        visible={infoModalVisible}
        type="info"
        title={t`お知らせ`}
        message={t`新しいアップデートが利用可能です`}
        onClose={() => setInfoModalVisible(false)}
        theme={theme}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginRight: 10,
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  counterButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  counterButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
  counterValue: {
    fontSize: 20,
    fontWeight: "600",
    marginHorizontal: 20,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  smallButton: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  resultBox: {
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
  },
  resultText: {
    fontSize: 16,
  },
  // モーダル関連のスタイル
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  // 確認ダイアログ
  dialogContainer: {
    width: "85%",
    padding: 20,
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dialogTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  dialogMessage: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  dialogButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  dialogButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "#ddd",
  },
  confirmButton: {},
  dialogButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  // アクションシート
  actionSheetContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  actionSheetTitle: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  actionSheetOption: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  actionSheetOptionText: {
    fontSize: 18,
    textAlign: "center",
  },
  actionSheetDivider: {
    height: 8,
    marginVertical: 8,
  },
  actionSheetCancel: {
    fontWeight: "600",
  },
  // カスタムモーダル
  customModalContainer: {
    width: "85%",
    padding: 30,
    borderRadius: 16,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  customModalIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  customModalIconText: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },
  customModalTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 10,
  },
  customModalMessage: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 25,
  },
  customModalButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  customModalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
