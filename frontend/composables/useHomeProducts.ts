import { ref } from "vue";
import { useApi } from "./useApi";

export function useHomeProducts() {
  const api = useApi();

  // Estados para nuevos productos
  const newArrivals = ref([]);
  const loadingNew = ref(true);
  const errorNew = ref(null);

  // Estados para productos más vendidos
  const topSelling = ref([]);
  const loadingTop = ref(true);
  const errorTop = ref(null);

  // Procesar productos para agregar ratings y porcentajes de descuento
  const processProducts = (products) => {
    return products.map((product) => {
      // Asegurarnos de que price sea un número para cálculos pero se mantenga como string para compatibilidad
      const price =
        typeof product.price === "string"
          ? product.price
          : String(product.price);
      const originalPrice = product.originalPrice
        ? typeof product.originalPrice === "string"
          ? product.originalPrice
          : String(product.originalPrice)
        : null;

      return {
        ...product,
        price,
        originalPrice,
        rating: product.rating || 4.5,
        // No calculamos discount percentage aquí, lo dejamos para el componente
      };
    });
  };

  // Cargar nuevos productos
  const loadNewArrivals = async (limit = 4) => {
    loadingNew.value = true;
    errorNew.value = null;

    try {
      const response = await api.get(
        `/products?category=new-arrivals&limit=${limit}`
      );
      if (response.success) {
        newArrivals.value = processProducts(
          response.data.products || response.data
        );
      } else {
        errorNew.value = response.message || "Error al cargar productos";
      }
    } catch (err) {
      console.error("Error cargando nuevos productos:", err);
      errorNew.value = "Error al cargar los nuevos productos";
    } finally {
      loadingNew.value = false;
    }
  };

  // Cargar productos más vendidos
  const loadTopSelling = async (limit = 4) => {
    loadingTop.value = true;
    errorTop.value = null;

    try {
      const response = await api.get(
        `/products?category=top-selling&limit=${limit}`
      );
      if (response.success) {
        topSelling.value = processProducts(
          response.data.products || response.data
        );
      } else {
        errorTop.value = response.message || "Error al cargar productos";
      }
    } catch (err) {
      console.error("Error cargando productos más vendidos:", err);
      errorTop.value = "Error al cargar los productos más vendidos";
    } finally {
      loadingTop.value = false;
    }
  };

  return {
    newArrivals,
    loadingNew,
    errorNew,
    topSelling,
    loadingTop,
    errorTop,
    loadNewArrivals,
    loadTopSelling,
  };
}
