import { useAuth } from "~/composables/useAuth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server) return;

  const { isAdmin, checkAuthStatus } = useAuth();

  // Verificar autenticación
  await checkAuthStatus();

  // Si no es admin, redirigir al inicio
  if (!isAdmin.value) {
    return navigateTo("/");
  }
});
