import { Alert, Platform } from 'react-native';

interface ConfirmActionParams {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void | Promise<void>;
}

// Alert.alert buttons are not interactive on RN Web; use the browser dialog there.
export const confirmAction = ({ title, message, confirmLabel, onConfirm }: ConfirmActionParams) => {
  if (Platform.OS === 'web') {
    if (window.confirm(`${title}\n\n${message}`)) void onConfirm();
    return;
  }

  Alert.alert(title, message, [
    { text: 'Cancel', style: 'cancel' },
    { text: confirmLabel, style: 'destructive', onPress: () => void onConfirm() },
  ]);
};
