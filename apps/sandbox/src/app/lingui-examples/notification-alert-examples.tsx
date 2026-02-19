import { Trans, useLingui } from "@lingui/react/macro";
import { plural } from "@lingui/core/macro";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  TextInput,
} from "react-native";
import { useThemeContext } from "../../theme/ThemeContext";

// 通知タイプの定義
type NotificationType = "message" | "follow" | "like" | "system";
type ToastType = "success" | "error" | "info" | "warning";
type PermissionType = "camera" | "location" | "notification";

interface PushNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  timestamp: Date;
  data?: {
    userName?: string;
    count?: number;
    itemName?: string;
  };
}

interface ToastNotification {
  id: string;
  type: ToastType;
  message: string;
  action?: string;
  duration?: number;
}

export default function NotificationAlertExamples() {
  const { theme } = useThemeContext();
  const { t } = useLingui();

  // セクション1: プッシュ通知のシミュレーション
  const [notifications, setNotifications] = useState<PushNotification[]>([]);
  const [userName, setUserName] = useState("Alice");
  const [notificationCount, setNotificationCount] = useState(3);

  // セクション2: トースト通知
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [autoHide, setAutoHide] = useState(true);

  // セクション3: システムアラート
  const [permissionRequests, setPermissionRequests] = useState<Record<PermissionType, boolean>>({
    camera: false,
    location: false,
    notification: false,
  });

  // プッシュ通知のタイトルを生成
  const getNotificationTitle = (notification: PushNotification): string => {
    const { type, data } = notification;
    switch (type) {
      case "message":
        return data?.userName ? t`${data.userName}からのメッセージ` : t`新しいメッセージ`;
      case "follow":
        return t`新しいフォロワー`;
      case "like":
        return t`いいねを受け取りました`;
      case "system":
        return t`システム通知`;
      default:
        return t`通知`;
    }
  };

  // プッシュ通知のボディを生成
  const getNotificationBody = (notification: PushNotification): string => {
    const { type, data } = notification;
    switch (type) {
      case "message":
        return data?.count
          ? plural(data.count, {
              one: "# 件の新しいメッセージがあります",
              other: "# 件の新しいメッセージがあります",
            })
          : t`メッセージを確認してください`;
      case "follow":
        return data?.userName
          ? t`${data.userName}があなたをフォローしました`
          : t`誰かがあなたをフォローしました`;
      case "like":
        return data?.itemName
          ? t`あなたの${data.itemName}がいいねされました`
          : t`あなたの投稿がいいねされました`;
      case "system":
        return t`アプリの更新が利用可能です`;
      default:
        return t`タップして詳細を確認`;
    }
  };

  // プッシュ通知を追加
  const addPushNotification = (type: NotificationType) => {
    const newNotification: PushNotification = {
      id: Date.now().toString(),
      type,
      title: "",
      body: "",
      timestamp: new Date(),
      data: {
        userName,
        count: notificationCount,
        itemName: t`写真`,
      },
    };

    // タイトルとボディを設定
    newNotification.title = getNotificationTitle(newNotification);
    newNotification.body = getNotificationBody(newNotification);

    setNotifications((prev) => [newNotification, ...prev]);
  };

  // トースト通知を追加
  const addToast = (type: ToastType, withAction = false) => {
    const messages: Record<ToastType, string> = {
      success: t`操作が正常に完了しました`,
      error: t`エラーが発生しました`,
      info: t`新しい情報があります`,
      warning: t`注意が必要です`,
    };

    const newToast: ToastNotification = {
      id: Date.now().toString(),
      type,
      message: messages[type],
      ...(withAction && { action: t`元に戻す` }),
      ...(autoHide && { duration: 3000 }),
    };

    setToasts((prev) => [...prev, newToast]);

    // 自動的に消去
    if (autoHide) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 3000);
    }
  };

  // トーストを削除
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // 権限リクエストを表示
  const requestPermission = (type: PermissionType) => {
    const titles: Record<PermissionType, string> = {
      camera: t`カメラへのアクセス`,
      location: t`位置情報へのアクセス`,
      notification: t`通知の送信`,
    };

    const messages: Record<PermissionType, string> = {
      camera: t`このアプリは写真撮影のためにカメラへのアクセスが必要です`,
      location: t`このアプリは近くの場所を表示するために位置情報が必要です`,
      notification: t`重要な更新やメッセージを受け取るために通知を有効にしてください`,
    };

    Alert.alert(
      titles[type],
      messages[type],
      [
        {
          text: t`許可しない`,
          style: "cancel",
          onPress: () => {
            setPermissionRequests((prev) => ({ ...prev, [type]: false }));
          },
        },
        {
          text: t`許可`,
          onPress: () => {
            setPermissionRequests((prev) => ({ ...prev, [type]: true }));
            Alert.alert(t`成功`, t`権限が許可されました`);
          },
        },
      ],
      { cancelable: false },
    );
  };

  // システム制限アラート
  const showSystemAlert = (type: "storage" | "network" | "battery") => {
    const alerts = {
      storage: {
        title: t`ストレージ容量不足`,
        message: t`デバイスのストレージ容量が不足しています。不要なファイルを削除してください`,
      },
      network: {
        title: t`ネットワーク制限`,
        message: t`データ使用量が制限に近づいています。Wi-Fi接続を推奨します`,
      },
      battery: {
        title: t`バッテリー残量低下`,
        message: t`バッテリー残量が20%以下です。充電してください`,
      },
    };

    const alert = alerts[type];
    Alert.alert(alert.title, alert.message, [
      {
        text: t`後で`,
        style: "cancel",
      },
      {
        text: t`設定を開く`,
        onPress: () => {
          Alert.alert(t`設定`, t`設定画面を開きます（シミュレーション）`);
        },
      },
    ]);
  };

  // トーストのスタイルを取得
  const getToastStyle = (type: ToastType) => {
    const colors = {
      success: "#4CAF50",
      error: "#F44336",
      info: "#2196F3",
      warning: "#FF9800",
    };
    return {
      backgroundColor: colors[type],
    };
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* セクション1: プッシュ通知のシミュレーション */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          <Trans>プッシュ通知のシミュレーション</Trans>
        </Text>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            <Trans>ユーザー名</Trans>
          </Text>
          <TextInput
            style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
            value={userName}
            onChangeText={setUserName}
            placeholder={t`ユーザー名を入力`}
            placeholderTextColor={theme.colors.text + "80"}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            <Trans>通知数</Trans>
          </Text>
          <View style={styles.counterContainer}>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => setNotificationCount(Math.max(0, notificationCount - 1))}
            >
              <Text style={styles.counterButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={[styles.counterText, { color: theme.colors.text }]}>
              {notificationCount}
            </Text>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => setNotificationCount(notificationCount + 1)}
            >
              <Text style={styles.counterButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={() => addPushNotification("message")}
          >
            <Text style={styles.buttonText}>
              <Trans>メッセージ通知</Trans>
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={() => addPushNotification("follow")}
          >
            <Text style={styles.buttonText}>
              <Trans>フォロー通知</Trans>
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={() => addPushNotification("like")}
          >
            <Text style={styles.buttonText}>
              <Trans>いいね通知</Trans>
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={() => addPushNotification("system")}
          >
            <Text style={styles.buttonText}>
              <Trans>システム通知</Trans>
            </Text>
          </TouchableOpacity>
        </View>

        {notifications.length > 0 && (
          <View style={styles.notificationList}>
            {notifications.slice(0, 3).map((notification) => (
              <View
                key={notification.id}
                style={[styles.notificationItem, { backgroundColor: theme.colors.card }]}
              >
                <Text style={[styles.notificationTitle, { color: theme.colors.text }]}>
                  {notification.title}
                </Text>
                <Text style={[styles.notificationBody, { color: theme.colors.text + "CC" }]}>
                  {notification.body}
                </Text>
              </View>
            ))}
          </View>
        )}

        {notifications.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={() => setNotifications([])}>
            <Text style={[styles.clearButtonText, { color: theme.colors.notification }]}>
              <Trans>すべてクリア</Trans>
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* セクション2: トースト通知 */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          <Trans>アプリ内通知（トースト）</Trans>
        </Text>

        <View style={styles.switchContainer}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            <Trans>自動的に消去</Trans>
          </Text>
          <Switch value={autoHide} onValueChange={setAutoHide} />
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#4CAF50" }]}
            onPress={() => addToast("success")}
          >
            <Text style={styles.buttonText}>
              <Trans>成功</Trans>
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#F44336" }]}
            onPress={() => addToast("error")}
          >
            <Text style={styles.buttonText}>
              <Trans>エラー</Trans>
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#2196F3" }]}
            onPress={() => addToast("info", true)}
          >
            <Text style={styles.buttonText}>
              <Trans>情報（アクション付き）</Trans>
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#FF9800" }]}
            onPress={() => addToast("warning")}
          >
            <Text style={styles.buttonText}>
              <Trans>警告</Trans>
            </Text>
          </TouchableOpacity>
        </View>

        {/* トーストコンテナ */}
        <View style={styles.toastContainer}>
          {toasts.map((toast) => (
            <TouchableOpacity
              key={toast.id}
              style={[styles.toast, getToastStyle(toast.type)]}
              onPress={() => removeToast(toast.id)}
              activeOpacity={0.9}
            >
              <Text style={styles.toastMessage}>{toast.message}</Text>
              {toast.action && (
                <TouchableOpacity
                  style={styles.toastAction}
                  onPress={() => {
                    Alert.alert(t`アクション`, t`${toast.action}を実行しました`);
                    removeToast(toast.id);
                  }}
                >
                  <Text style={styles.toastActionText}>{toast.action}</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* セクション3: システムアラート */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          <Trans>システムアラート</Trans>
        </Text>

        <Text style={[styles.subsectionTitle, { color: theme.colors.text }]}>
          <Trans>権限リクエスト</Trans>
        </Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: permissionRequests.camera ? "#4CAF50" : theme.colors.primary,
              },
            ]}
            onPress={() => requestPermission("camera")}
          >
            <Text style={styles.buttonText}>
              <Trans>カメラ</Trans>
              {permissionRequests.camera && " ✓"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: permissionRequests.location ? "#4CAF50" : theme.colors.primary,
              },
            ]}
            onPress={() => requestPermission("location")}
          >
            <Text style={styles.buttonText}>
              <Trans>位置情報</Trans>
              {permissionRequests.location && " ✓"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: permissionRequests.notification ? "#4CAF50" : theme.colors.primary,
              },
            ]}
            onPress={() => requestPermission("notification")}
          >
            <Text style={styles.buttonText}>
              <Trans>通知</Trans>
              {permissionRequests.notification && " ✓"}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.subsectionTitle, { color: theme.colors.text }]}>
          <Trans>システム制限</Trans>
        </Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#FF5722" }]}
            onPress={() => showSystemAlert("storage")}
          >
            <Text style={styles.buttonText}>
              <Trans>ストレージ不足</Trans>
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#FF9800" }]}
            onPress={() => showSystemAlert("network")}
          >
            <Text style={styles.buttonText}>
              <Trans>ネットワーク制限</Trans>
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#FFC107" }]}
            onPress={() => showSystemAlert("battery")}
          >
            <Text style={styles.buttonText}>
              <Trans>バッテリー低下</Trans>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 10,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  counterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
  },
  counterButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  counterText: {
    fontSize: 18,
    minWidth: 30,
    textAlign: "center",
  },
  buttonGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginVertical: 10,
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 80,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  notificationList: {
    marginTop: 15,
    gap: 10,
  },
  notificationItem: {
    padding: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  notificationBody: {
    fontSize: 13,
  },
  clearButton: {
    marginTop: 10,
    alignSelf: "center",
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  toastContainer: {
    marginTop: 15,
    gap: 10,
  },
  toast: {
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toastMessage: {
    color: "white",
    fontSize: 14,
    flex: 1,
  },
  toastAction: {
    marginLeft: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 4,
  },
  toastActionText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
});
