import { ref, readonly } from "vue";
import { useRouter } from "vue-router";
import { useApi } from "./useApi";

// Estado global para la autenticación
const user = ref(null);
const isAuthenticated = ref(false);
const isAdmin = ref(false);
const loading = ref(false);
const error = ref(null);

// Interfaces para tipado
interface LoginResponse {
  success: boolean;
  message?: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export function useAuth() {
  const router = useRouter();
  const api = useApi();

  /**
   * Inicia sesión del usuario
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise<boolean>} true si el login fue exitoso
   */
  const login = async (email: string, password: string): Promise<boolean> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      if (response.success) {
        // Guardar token en localStorage (solo en navegador)
        if (process.client) {
          localStorage.setItem("token", response.data.token);
        }

        // Guardar info del usuario
        user.value = response.data.user;
        isAuthenticated.value = true;
        isAdmin.value = user.value?.role === "admin";

        return true;
      } else {
        error.value = response.message || "Error de autenticación";
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

  /**
   * Registra un nuevo usuario
   */
  const register = async (data: RegisterData): Promise<boolean> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.post("/auth/register", data);

      if (response.success) {
        // Guardar token en localStorage (solo en navegador)
        if (process.client) {
          localStorage.setItem("token", response.data.token);
        }

        // Guardar info del usuario
        user.value = response.data.user;
        isAuthenticated.value = true;
        isAdmin.value = user.value?.role === "admin";

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

  /**
   * Cierra la sesión del usuario
   */
  const logout = () => {
    if (process.client) {
      localStorage.removeItem("token");
    }
    user.value = null;
    isAuthenticated.value = false;
    isAdmin.value = false;
    router.push("/");
  };

  /**
   * Verifica el estado de autenticación actual
   * @returns {Promise<boolean>} true si el usuario está autenticado
   */
  const checkAuthStatus = async () => {
    // Si ya hay datos de usuario, no es necesario volver a verificar
    if (isAuthenticated.value && user.value) {
      return true;
    }

    // En el servidor, no podemos usar localStorage
    if (!process.client) {
      return false;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      isAuthenticated.value = false;
      user.value = null;
      isAdmin.value = false;
      return false;
    }

    try {
      const response = await api.get("/auth/profile");

      if (response.success) {
        user.value = response.data;
        isAuthenticated.value = true;
        isAdmin.value = user.value?.role === "admin";
        return true;
      } else {
        // Token inválido o expirado
        localStorage.removeItem("token");
        user.value = null;
        isAuthenticated.value = false;
        isAdmin.value = false;
        return false;
      }
    } catch (err) {
      console.error("Error verificando autenticación:", err);
      return false;
    }
  };

  return {
    user: readonly(user),
    isAuthenticated: readonly(isAuthenticated),
    isAdmin: readonly(isAdmin),
    loading: readonly(loading),
    error: readonly(error),
    login,
    register,
    logout,
    checkAuthStatus,
  };
}
