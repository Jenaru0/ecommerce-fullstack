import { useAuth } from "~/composables/useAuth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server) return;

  const { isAuthenticated, checkAuthStatus } = useAuth();

  // Verificar autenticación
  await checkAuthStatus();

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated.value) {
    return navigateTo({
      path: "/auth/login",
      query: { redirect: to.fullPath },
    });
  }
});
