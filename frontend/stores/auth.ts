// frontend/stores/auth.ts
import { defineStore } from "pinia";

// Define interfaces para mejor tipado
interface User {
  id: number;
  email: string;
  name?: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

interface LoginResponse {
  success: boolean;
  message?: string;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isAdmin: false,
  }),

  actions: {
    async login(email: string, password: string): Promise<LoginResponse> {
      try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        // frontend/stores/auth.ts
        if (data.success) {
          this.user = data.data.user;
          this.token = data.data.token;
          this.isAuthenticated = true;

          if (this.user) {
            this.isAdmin = this.user.role === "admin";
          }

          // Verifica que token no sea null antes de guardarlo
          if (this.token) {
            localStorage.setItem("token", this.token);
          }

          return { success: true };
        } else {
          return { success: false, message: data.message };
        }
      } catch (error) {
        console.error("Error de login:", error);
        return { success: false, message: "Error de conexión" };
      }
    },
  },
});
