import { defineStore } from "pinia";
import { useApi } from "~/composables/useApi";
import { useToast } from "~/composables/useToast";

// Define interfaces para mejor tipado
interface User {
  id: number;
  email: string;
  name?: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
    isAdmin: false,
    loading: false,
    error: null,
  }),

  actions: {
    async login(email: string, password: string): Promise<boolean> {
      this.loading = true;
      this.error = null;

      try {
        const api = useApi();
        const response = await api.post("/auth/login", {
          email,
          password,
        });

        if (response.success) {
          // Guardar token en localStorage
          if (process.client) {
            localStorage.setItem("token", response.data.token);
          }

          // Guardar info del usuario
          this.user = response.data.user;
          this.isAuthenticated = true;
          this.isAdmin = this.user?.role === "admin";

          return true;
        } else {
          this.error = response.message || "Error de autenticación";
          return false;
        }
      } catch (err) {
        console.error("Error en login:", err);
        this.error = "Error al conectar con el servidor";
        return false;
      } finally {
        this.loading = false;
      }
    },

    async register(
      name: string,
      email: string,
      password: string
    ): Promise<boolean> {
      this.loading = true;
      this.error = null;

      try {
        const api = useApi();
        const response = await api.post("/auth/register", {
          name,
          email,
          password,
        });

        if (response.success) {
          // Guardar token en localStorage
          if (process.client) {
            localStorage.setItem("token", response.data.token);
          }

          // Guardar info del usuario
          this.user = response.data.user;
          this.isAuthenticated = true;
          this.isAdmin = this.user?.role === "admin";

          return true;
        } else {
          this.error = response.message || "Error al registrarse";
          return false;
        }
      } catch (err) {
        console.error("Error en registro:", err);
        this.error = "Error al conectar con el servidor";
        return false;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      // Eliminar token del localStorage
      if (process.client) {
        localStorage.removeItem("token");
      }

      // Limpiar estado
      this.user = null;
      this.isAuthenticated = false;
      this.isAdmin = false;
    },

    async checkAuth(): Promise<boolean> {
      // Si ya hay datos de usuario, no verificar de nuevo
      if (this.isAuthenticated && this.user) {
        return true;
      }

      // En el servidor, no podemos usar localStorage
      if (!process.client) {
        return false;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        this.isAuthenticated = false;
        this.user = null;
        this.isAdmin = false;
        return false;
      }

      try {
        const api = useApi();
        const response = await api.get("/auth/profile");

        if (response.success) {
          this.user = response.data;
          this.isAuthenticated = true;
          this.isAdmin = this.user?.role === "admin";
          return true;
        } else {
          // Token inválido o expirado
          if (process.client) {
            localStorage.removeItem("token");
          }
          this.user = null;
          this.isAuthenticated = false;
          this.isAdmin = false;
          return false;
        }
      } catch (err) {
        console.error("Error verificando autenticación:", err);
        return false;
      }
    },
  },
});
