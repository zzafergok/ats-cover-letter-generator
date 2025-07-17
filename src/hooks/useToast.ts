import { useToastStore } from '@/store/toastStore'

export const useToast = () => {
  const store = useToastStore()

  return {
    toast: store.addToast,
    success: store.showSuccess,
    error: store.showError,
    warning: store.showWarning,
    info: store.showInfo,
    dismiss: store.removeToast,
    dismissAll: store.clearAllToasts,
  }
}
