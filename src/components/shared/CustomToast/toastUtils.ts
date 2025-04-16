import Toast, {ToastType} from 'react-native-toast-message';

export function showToast(type?: ToastType, text1?: string, text2?: string) {
  Toast.show({
    type,
    text1,
    text2,
  });
}
