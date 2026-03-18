import { toast } from "sonner";

// Re-export sonner's toast as the primary toast API
export { toast };

// Minimal useToast hook for backward compatibility
function useToast() {
  return {
    toast,
    dismiss: (toastId?: string | number) => {
      if (toastId) {
        toast.dismiss(toastId);
      } else {
        toast.dismiss();
      }
    },
    toasts: [] as never[],
  };
}

export { useToast };
