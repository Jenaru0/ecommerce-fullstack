import { ref } from "vue";
import { useApi } from "~/composables/useApi";

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
    return products.map((product) => ({
      ...product,
      rating: product.rating || 4.5,
      discountPercentage: product.originalPrice
        ? Math.round(
            ((product.originalPrice - product.price) / product.originalPrice) *
              100
          )
        : null,
    }));
  };

  // Cargar nuevos productos
  const loadNewArrivals = async (limit = 4) => {
    loadingNew.value = true;
    try {
      const response = await api.get(
        `/products?category=new-arrivals&limit=${limit}`
      );
      if (response.success) {
        newArrivals.value = processProducts(response.data);
      } else {
        errorNew.value = response.message;
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
    try {
      const response = await api.get(
        `/products?category=top-selling&limit=${limit}`
      );
      if (response.success) {
        topSelling.value = processProducts(response.data);
      } else {
        errorTop.value = response.message;
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
