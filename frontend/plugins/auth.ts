import { defineNuxtPlugin } from "#app";
import { useAuthStore } from "~/stores/auth";

export default defineNuxtPlugin(async (nuxtApp) => {
  // Solo verificar autenticación en el lado del cliente
  if (process.client) {
    const authStore = useAuthStore();

    try {
      // Al iniciar, verificar estado de autenticación
      await authStore.checkAuth();
    } catch (error) {
      console.error("Error verificando autenticación:", error);
    }
  }
});
