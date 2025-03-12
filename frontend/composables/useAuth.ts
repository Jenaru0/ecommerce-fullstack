import { ref } from "vue";
import { useApi } from "./useApi";
import { useRouter } from "vue-router";

interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
}

export function useAuth() {
  const api = useApi();
  const router = useRouter();

  const user = ref<User | null>(null);
  const isAuthenticated = ref(false);
  const isAdmin = ref(false);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const login = async (email: string, password: string) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.post("/auth/login", { email, password });

      if (response.success) {
        // Guardar token en localStorage
        localStorage.setItem("token", response.data.token);

        // Guardar info del usuario
        user.value = response.data.user;
        isAuthenticated.value = true;
        isAdmin.value = user.value.role === "admin";

        return true;
      } else {
        error.value = response.message || "Error al iniciar sesión";
        return false;
      }
    } catch (err) {
      console.error("Error en login:", err);
      error.value = "Error al conectar con el servidor";
      return false;
    } finally {
      loading.value = false;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      if (response.success) {
        // Guardar token en localStorage
        localStorage.setItem("token", response.data.token);

        // Guardar info del usuario
        user.value = response.data.user;
        isAuthenticated.value = true;
        isAdmin.value = user.value.role === "admin";

        return true;
      } else {
        error.value = response.message || "Error al registrarse";
        return false;
      }
    } catch (err) {
      console.error("Error en registro:", err);
      error.value = "Error al conectar con el servidor";
      return false;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    user.value = null;
    isAuthenticated.value = false;
    isAdmin.value = false;
    router.push("/");
  };

  const checkAuthStatus = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      isAuthenticated.value = false;
      user.value = null;
      return false;
    }

    try {
      // Solicitar info del perfil para validar el token
      const response = await api.get("/auth/profile");

      if (response.success) {
        user.value = response.data;
        isAuthenticated.value = true;
        isAdmin.value = user.value.role === "admin";
        return true;
      } else {
        // Token inválido o expirado
        logout();
        return false;
      }
    } catch (err) {
      console.error("Error verificando autenticación:", err);
      return false;
    }
  };

  return {
    user,
    isAuthenticated,
    isAdmin,
    loading,
    error,
    login,
    register,
    logout,
    checkAuthStatus,
  };
}
