import { ref } from "vue";

export function useApi() {
  const baseUrl = "http://localhost:5000/api";

  const get = async (endpoint: string) => {
    try {
      console.log(`Fetching: ${baseUrl}${endpoint}`);
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Incluir token si está disponible
          ...(localStorage.getItem("authToken")
            ? { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
            : {}),
        },
      });

      // Verificar errores HTTP
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          message:
            errorData.message ||
            `Error ${response.status}: ${response.statusText}`,
          status: response.status,
        };
      }

      const data = await response.json();
      console.log("Response:", data);
      return data;
    } catch (error) {
      console.error(`Error en petición GET a ${endpoint}:`, error);
      return {
        success: false,
        message: "Error en la conexión con el servidor",
      };
    }
  };

  const post = async (endpoint: string, data: any) => {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(localStorage.getItem("authToken")
            ? { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
            : {}),
        },
        body: JSON.stringify(data),
      });

      // Verificar errores HTTP
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          message:
            errorData.message ||
            `Error ${response.status}: ${response.statusText}`,
          status: response.status,
        };
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error(`Error en petición POST a ${endpoint}:`, error);
      return {
        success: false,
        message: "Error en la conexión con el servidor",
      };
    }
  };

  const put = async (endpoint: string, data: any) => {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(localStorage.getItem("authToken")
            ? { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
            : {}),
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error(`Error en PUT ${endpoint}:`, error);
      return { success: false, message: "Error de conexión" };
    }
  };

  const del = async (endpoint: string) => {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(localStorage.getItem("authToken")
            ? { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
            : {}),
        },
      });
      return await response.json();
    } catch (error) {
      console.error(`Error en DELETE ${endpoint}:`, error);
      return { success: false, message: "Error de conexión" };
    }
  };

  return { get, post, put, del };
}
