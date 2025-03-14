<template>
  <div class="container mx-auto px-6 md:px-16 lg:px-24 py-12">
    <h1 class="text-3xl font-bold mb-6">Catálogo de productos</h1>

    <!-- Filtros básicos -->
    <div class="mb-8 flex flex-col md:flex-row gap-4">
      <div class="w-full md:w-64">
        <label
          for="category"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Categoría</label
        >
        <select
          id="category"
          v-model="categoryFilter"
          class="w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black"
          @change="loadProducts"
        >
          <option value="">Todas las categorías</option>
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
      </div>

      <div class="w-full md:w-64">
        <label for="sort" class="block text-sm font-medium text-gray-700 mb-1"
          >Ordenar por</label
        >
        <select
          id="sort"
          v-model="sortBy"
          class="w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black"
          @change="loadProducts"
        >
          <option value="newest">Más recientes</option>
          <option value="price_asc">Precio: menor a mayor</option>
          <option value="price_desc">Precio: mayor a menor</option>
        </select>
      </div>
    </div>

    <!-- Estado de carga -->
    <div v-if="loading" class="text-center py-8">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto"
      ></div>
      <p class="text-xl mt-4">Cargando productos...</p>
    </div>

    <!-- Estado de error -->
    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-500">{{ error }}</p>
      <button
        @click="loadProducts"
        class="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
      >
        Intentar de nuevo
      </button>
    </div>

    <!-- Productos -->
    <div v-else>
      <!-- Mensaje si no hay productos -->
      <div v-if="products.length === 0" class="text-center py-8">
        <p class="text-xl text-gray-600">No se encontraron productos</p>
      </div>

      <!-- Grid de productos -->
      <div v-else class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div
          v-for="product in products"
          :key="product.id"
          class="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
        >
          <NuxtLink :to="`/products/${product.id}`" class="block">
            <img
              :src="product.imageUrl || '/images/placeholder-product.jpg'"
              :alt="product.name"
              class="w-full h-48 object-cover"
            />
          </NuxtLink>
          <div class="p-4">
            <NuxtLink
              :to="`/products/${product.id}`"
              class="block hover:text-gray-600"
            >
              <h3 class="font-bold text-lg mb-2 line-clamp-1">
                {{ product.name }}
              </h3>
            </NuxtLink>
            <p class="text-gray-700 mb-3 line-clamp-2">
              {{ product.description }}
            </p>

            <!-- Precio y descuento -->
            <div class="flex items-center mb-3">
              <span class="text-xl font-bold"
                >${{ formatPrice(product.price) }}</span
              >
              <span
                v-if="product.originalPrice"
                class="ml-2 text-gray-500 line-through text-sm"
              >
                ${{ formatPrice(product.originalPrice) }}
              </span>
              <span
                v-if="getDiscountPercentage(product)"
                class="ml-2 bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded"
              >
                -{{ getDiscountPercentage(product) }}%
              </span>
            </div>

            <div class="flex justify-between items-center">
              <!-- Disponibilidad -->
              <span
                :class="[
                  'text-sm',
                  product.stock > 0 ? 'text-green-600' : 'text-red-600',
                ]"
              >
                {{
                  product.stock > 0 ? `${product.stock} disponibles` : "Agotado"
                }}
              </span>

              <!-- Botón de compra -->
              <button
                @click="addToCart(product)"
                class="bg-black text-white px-3 py-1.5 rounded hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                :disabled="product.stock <= 0"
              >
                <span v-if="product.stock > 0">Añadir</span>
                <span v-else>Agotado</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Paginación -->
      <div v-if="totalPages > 1" class="flex justify-center mt-8 space-x-2">
        <button
          @click="previousPage"
          class="px-4 py-2 border rounded"
          :disabled="currentPage === 1"
          :class="
            currentPage === 1
              ? 'text-gray-400 border-gray-200'
              : 'text-gray-700 border-gray-300 hover:bg-gray-50'
          "
        >
          Anterior
        </button>

        <button
          v-for="page in displayedPages"
          :key="page"
          @click="goToPage(page)"
          class="px-4 py-2 border rounded"
          :class="
            page === currentPage
              ? 'bg-black text-white border-black'
              : 'text-gray-700 border-gray-300 hover:bg-gray-50'
          "
        >
          {{ page }}
        </button>

        <button
          @click="nextPage"
          class="px-4 py-2 border rounded"
          :disabled="currentPage === totalPages"
          :class="
            currentPage === totalPages
              ? 'text-gray-400 border-gray-200'
              : 'text-gray-700 border-gray-300 hover:bg-gray-50'
          "
        >
          Siguiente
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useCartStore } from "~/stores/cart";
import { useApi } from "~/composables/useApi";
import { useToast } from "~/composables/useToast";

const cartStore = useCartStore();
const api = useApi();
const { showToast } = useToast();

// Estado de la página
const products = ref([]);
const categories = ref([]);
const loading = ref(true);
const error = ref(null);

// Filtros y paginación
const categoryFilter = ref("");
const sortBy = ref("newest");
const currentPage = ref(1);
const itemsPerPage = ref(12);
const totalProducts = ref(0);

// Calcular número total de páginas
const totalPages = computed(() => {
  return Math.ceil(totalProducts.value / itemsPerPage.value);
});

// Determinar qué páginas mostrar en la paginación
const displayedPages = computed(() => {
  const pages = [];
  const maxVisiblePages = 5;

  if (totalPages.value <= maxVisiblePages) {
    // Si hay pocas páginas, mostrarlas todas
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i);
    }
  } else {
    // Si hay muchas páginas, mostrar un subconjunto centrado en la página actual
    let startPage = Math.max(
      1,
      currentPage.value - Math.floor(maxVisiblePages / 2)
    );
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages.value) {
      endPage = totalPages.value;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
  }

  return pages;
});

// Cargar productos con filtros y paginación
const loadProducts = async () => {
  loading.value = true;
  error.value = null;

  try {
    // Construir parámetros de la consulta
    const queryParams = new URLSearchParams();
    queryParams.append("page", currentPage.value.toString());
    queryParams.append("limit", itemsPerPage.value.toString());

    if (categoryFilter.value) {
      queryParams.append("categoryId", categoryFilter.value);
    }

    if (sortBy.value) {
      queryParams.append("sort", sortBy.value);
    }

    const response = await api.get(`/products?${queryParams.toString()}`);

    if (response.success) {
      products.value = response.data.products || [];
      totalProducts.value = response.data.total || 0;
    } else {
      error.value = response.message || "Error al cargar los productos";
    }
  } catch (err) {
    console.error("Error fetching products:", err);
    error.value = "Error al conectar con el servidor";
  } finally {
    loading.value = false;
  }
};

// Cargar categorías para el filtro
const loadCategories = async () => {
  try {
    const response = await api.get("/categories");
    if (response.success) {
      categories.value = response.data;
    }
  } catch (err) {
    console.error("Error fetching categories:", err);
    // No mostrar error para no interrumpir la experiencia del usuario
  }
};

// Navegación de páginas
const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    loadProducts();
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    loadProducts();
  }
};

const goToPage = (page) => {
  currentPage.value = page;
  loadProducts();
};

// Calcular porcentaje de descuento
const getDiscountPercentage = (product) => {
  if (!product.originalPrice || product.originalPrice <= product.price)
    return null;
  return Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );
};

// Función para formatear precios
const formatPrice = (price) => {
  return Number(price).toFixed(2);
};

// Añadir producto al carrito
const addToCart = (product) => {
  if (product.stock <= 0) {
    showToast("Producto agotado", "error");
    return;
  }

  cartStore.addItem({
    id: product.id,
    name: product.name,
    price: Number(product.price),
    imageUrl: product.imageUrl,
    quantity: 1,
    stock: product.stock, // Para validación de cantidad máxima
  });

  showToast("Producto añadido al carrito", "success");
};

// Observar cambios en los filtros para resetear la paginación
watch([categoryFilter, sortBy], () => {
  currentPage.value = 1;
  loadProducts();
});

// Cargar datos iniciales
onMounted(async () => {
  await Promise.all([loadProducts(), loadCategories()]);
});
</script>
