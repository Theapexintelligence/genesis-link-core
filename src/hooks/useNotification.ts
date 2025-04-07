
import { toast } from "sonner";

type NotificationType = "info" | "success" | "warning" | "error";

interface NotificationOptions {
  duration?: number;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function useNotification() {
  const notify = (
    type: NotificationType,
    title: string,
    options?: NotificationOptions
  ) => {
    const { duration = 5000, description, action } = options || {};
    
    switch (type) {
      case "success":
        toast.success(title, {
          description,
          duration,
          action: action
            ? {
                label: action.label,
                onClick: action.onClick,
              }
            : undefined,
        });
        break;
      case "error":
        toast.error(title, {
          description,
          duration,
          action: action
            ? {
                label: action.label,
                onClick: action.onClick,
              }
            : undefined,
        });
        break;
      case "warning":
        toast.warning(title, {
          description,
          duration,
          action: action
            ? {
                label: action.label,
                onClick: action.onClick,
              }
            : undefined,
        });
        break;
      default:
        toast.info(title, {
          description,
          duration,
          action: action
            ? {
                label: action.label,
                onClick: action.onClick,
              }
            : undefined,
        });
    }
  };

  return {
    notifySuccess: (title: string, options?: NotificationOptions) =>
      notify("success", title, options),
    notifyError: (title: string, options?: NotificationOptions) =>
      notify("error", title, options),
    notifyWarning: (title: string, options?: NotificationOptions) =>
      notify("warning", title, options),
    notifyInfo: (title: string, options?: NotificationOptions) =>
      notify("info", title, options),
  };
}
