import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server) return;

  const authStore = useAuthStore();

  // Verificar autenticación
  await authStore.checkAuth();

  // Si no está autenticado, redirigir a login
  if (!authStore.isAuthenticated) {
    return navigateTo({
      path: "/auth/login",
      query: { redirect: to.fullPath },
    });
  }
});
