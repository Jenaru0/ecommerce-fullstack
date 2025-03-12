// frontend/composables/useToast.ts
import { ref } from "vue";

// Definir tipos para mejorar la seguridad y autocompletado
export type ToastType = "success" | "error" | "warning" | "info";

// Singleton para mantener la consistencia del estado
const toastInstance = ref<any>(null);

// Estado global del toast
const toast = ref({
  show: false,
  message: "",
  type: "info" as ToastType,
  duration: 5000,
});

export function useToast() {
  // Mostrar un toast
  const showToast = (
    message: string,
    type: ToastType = "info",
    duration: number = 5000
  ): void => {
    // Si tenemos instancia del componente programático, usarla
    if (toastInstance.value) {
      toastInstance.value.addToast(message, type, duration);
    } else {
      // Si no, usar la implementación integrada en app.vue
      toast.value.message = message;
      toast.value.type = type;
      toast.value.show = true;
      toast.value.duration = duration;

      // Auto-ocultar después del tiempo especificado
      if (duration > 0) {
        setTimeout(() => {
          hideToast();
        }, duration);
      }
    }
  };

  // Ocultar el toast
  const hideToast = (): void => {
    toast.value.show = false;
  };

  // Para el uso con el componente Toast programático
  const setToastInstance = (instance: any): void => {
    toastInstance.value = instance;
  };

  return {
    toast,
    showToast,
    hideToast,
    setToastInstance,
  };
}
