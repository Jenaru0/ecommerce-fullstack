import { ref, computed } from "vue";

export function useApi() {
  // Configuración base de la API
  const baseUrl = "http://localhost:5000/api";
  const isLoading = ref(false);
  const error = ref(null);

  // Función para obtener el token de autenticación
  const getAuthToken = () => {
    if (process.client) {
      return localStorage.getItem("token");
    }
    return null;
  };

  // Función de reintento con retroceso exponencial
  const fetchWithRetry = async (
    url: string,
    options: RequestInit,
    maxRetries = 3
  ) => {
    let retries = 0;

    while (retries < maxRetries) {
      try {
        return await fetch(url, options);
      } catch (err) {
        retries++;
        if (retries >= maxRetries) {
          throw err;
        }

        // Esperar tiempo creciente entre reintentos (0.5s, 1s, 2s, ...)
        const delayMs = 500 * Math.pow(2, retries - 1);
        console.log(
          `Reintentando conexión en ${delayMs}ms (intento ${retries} de ${maxRetries})...`
        );
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    throw new Error("Número máximo de reintentos alcanzado");
  };

  // Petición GET con mejor manejo de errores
  const get = async (endpoint: string, query = {}) => {
    isLoading.value = true;
    error.value = null;

    try {
      // Crear headers básicos
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      // Añadir token de autenticación si existe
      const token = getAuthToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // Construir URL con parámetros de consulta
      const queryString = new URLSearchParams(
        query as Record<string, string>
      ).toString();
      const url = `${baseUrl}${endpoint}${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await fetchWithRetry(url, {
        method: "GET",
        headers,
        // Añadir opciones para mejorar la estabilidad de la conexión
        credentials: "include",
        mode: "cors",
        // Agregar timeout para evitar esperas indefinidas
        signal: AbortSignal.timeout(30000), // 30 segundos timeout
      });

      // Si la respuesta no es ok, lanzar error
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (err: any) {
      // Manejo mejorado de errores
      console.error(`Error en petición GET a ${endpoint}:`, err);
      error.value = err.message || "Error de conexión";

      // Formatear respuesta de error
      return {
        success: false,
        message: err.message || "Error de conexión con el servidor",
        error: err,
      };
    } finally {
      isLoading.value = false;
    }
  };

  // Petición POST con mejor manejo de errores
  const post = async (endpoint: string, body = {}) => {
    isLoading.value = true;
    error.value = null;

    try {
      // Crear headers básicos
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      // Añadir token de autenticación si existe
      const token = getAuthToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetchWithRetry(`${baseUrl}${endpoint}`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        credentials: "include",
        mode: "cors",
        signal: AbortSignal.timeout(30000), // 30 segundos timeout
      });

      // Intentar obtener la respuesta JSON
      let data;
      try {
        data = await response.json();
      } catch (err) {
        data = { success: false };
      }

      // Si la respuesta no es ok, manejar el error
      if (!response.ok) {
        throw new Error(data.message || `Error HTTP: ${response.status}`);
      }

      return data;
    } catch (err: any) {
      console.error(`Error en petición POST a ${endpoint}:`, err);
      error.value = err.message || "Error de conexión";

      return {
        success: false,
        message: err.message || "Error de conexión con el servidor",
        error: err,
      };
    } finally {
      isLoading.value = false;
    }
  };

  // Petición PUT con mejor manejo de errores
  const put = async (endpoint: string, body = {}) => {
    isLoading.value = true;
    error.value = null;

    try {
      // Crear headers básicos
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      // Añadir token de autenticación si existe
      const token = getAuthToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetchWithRetry(`${baseUrl}${endpoint}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(body),
        credentials: "include",
        mode: "cors",
        signal: AbortSignal.timeout(30000), // 30 segundos timeout
      });

      // Intentar obtener la respuesta JSON
      let data;
      try {
        data = await response.json();
      } catch (err) {
        data = { success: false };
      }

      // Si la respuesta no es ok, manejar el error
      if (!response.ok) {
        throw new Error(data.message || `Error HTTP: ${response.status}`);
      }

      return data;
    } catch (err: any) {
      console.error(`Error en petición PUT a ${endpoint}:`, err);
      error.value = err.message || "Error de conexión";

      return {
        success: false,
        message: err.message || "Error de conexión con el servidor",
        error: err,
      };
    } finally {
      isLoading.value = false;
    }
  };

  // Petición DELETE con mejor manejo de errores
  const del = async (endpoint: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      // Crear headers básicos
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      // Añadir token de autenticación si existe
      const token = getAuthToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetchWithRetry(`${baseUrl}${endpoint}`, {
        method: "DELETE",
        headers,
        credentials: "include",
        mode: "cors",
        signal: AbortSignal.timeout(30000), // 30 segundos timeout
      });

      // Intentar obtener la respuesta JSON
      let data;
      try {
        data = await response.json();
      } catch (err) {
        data = { success: response.ok };
      }

      // Si la respuesta no es ok, manejar el error
      if (!response.ok) {
        throw new Error(data.message || `Error HTTP: ${response.status}`);
      }

      return data;
    } catch (err: any) {
      console.error(`Error en petición DELETE a ${endpoint}:`, err);
      error.value = err.message || "Error de conexión";

      return {
        success: false,
        message: err.message || "Error de conexión con el servidor",
        error: err,
      };
    } finally {
      isLoading.value = false;
    }
  };

  return {
    get,
    post,
    put,
    delete: del,
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
  };
}
