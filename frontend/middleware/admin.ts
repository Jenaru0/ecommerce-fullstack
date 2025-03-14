import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  // No ejecutar en el servidor para evitar errores de localStorage
  if (process.server) return;

  const authStore = useAuthStore();

  // Verificar autenticación
  await authStore.checkAuth();

  // Si no es admin, redirigir al login con la URL original como destino de redirección
  if (!authStore.isAdmin) {
    return navigateTo(
      `/auth/login?redirect=${encodeURIComponent(to.fullPath)}`
    );
  }
});
