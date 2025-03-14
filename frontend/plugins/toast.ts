// filepath: c:\Users\jonna\OneDrive\Escritorio\ecommerce-fullstack\frontend\plugins\toast.ts
import { createApp, h, ref, onMounted } from "vue";
import Toast from "~/components/ui/Toast.vue"; // Corregido: ui en lugar de UI
import { useToast } from "~/composables/useToast";

export default defineNuxtPlugin(() => {
  // Solo ejecutar en el cliente
  if (process.server) return;

  // Crear una instancia del componente Toast
  const toastApp = createApp({
    setup() {
      // Obtener la referencia al componente Toast
      const toastRef = ref(null);
      const { setToastInstance } = useToast();

      // Cuando el componente esté montado, guardar la referencia
      onMounted(() => {
        if (toastRef.value) {
          setToastInstance(toastRef.value);
        }
      });

      return () => h(Toast, { ref: toastRef });
    },
  });

  // Montar el componente en el DOM
  const toastContainer = document.createElement("div");
  document.body.appendChild(toastContainer);
  toastApp.mount(toastContainer);
});
