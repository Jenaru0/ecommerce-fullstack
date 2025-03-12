// filepath:
c:\Users\jonna\OneDrive\Escritorio\ecommerce-fullstack\frontend\pages\admin\products\index.vue
<template>
  <div class="container mx-auto px-6 md:px-16 lg:px-24 py-12">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold">Gestión de Productos</h1>
      <NuxtLink
        to="/admin/products/new"
        class="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 inline-flex items-center"
      >
        <PlusIcon class="h-5 w-5 mr-2" />
        Nuevo Producto
      </NuxtLink>
    </div>

    <!-- Filtros de búsqueda -->
    <div class="bg-white shadow rounded-lg p-4 mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <label
            for="search"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Buscar</label
          >
          <div class="relative">
            <SearchIcon
              class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
            />
            <input
              id="search"
              v-model="searchQuery"
              type="text"
              placeholder="Buscar productos..."
              class="pl-10 w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              @input="debouncedSearch"
            />
          </div>
        </div>
        <div class="md:w-48">
          <label
            for="category"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Categoría</label
          >
          <select
            id="category"
            v-model="categoryFilter"
            class="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            @change="loadProducts"
          >
            <option value="">Todas</option>
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
        </div>
        <div class="md:w-48">
          <label for="sort" class="block text-sm font-medium text-gray-700 mb-1"
            >Ordenar por</label
          >
          <select
            id="sort"
            v-model="sortBy"
            class="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            @change="loadProducts"
          >
            <option value="newest">Más recientes</option>
            <option value="oldest">Más antiguos</option>
            <option value="name_asc">Nombre (A-Z)</option>
            <option value="name_desc">Nombre (Z-A)</option>
            <option value="price_asc">Precio (menor a mayor)</option>
            <option value="price_desc">Precio (mayor a menor)</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Estado de carga -->
    <div v-if="loading" class="py-12 text-center">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto"
      ></div>
      <p class="mt-4 text-gray-600">Cargando productos...</p>
    </div>

    <!-- Estado de error -->
    <div v-else-if="error" class="py-12 text-center">
      <AlertCircleIcon class="h-12 w-12 text-red-500 mx-auto mb-4" />
      <p class="text-red-500">{{ error }}</p>
      <button
        @click="loadProducts"
        class="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        Intentar de nuevo
      </button>
    </div>

    <!-- Tabla de productos -->
    <div v-else class="bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Producto
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Categoría
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Precio
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Stock
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Estado
            </th>
            <th
              class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Acciones
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="product in products" :key="product.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="h-10 w-10 flex-shrink-0">
                  <img
                    v-if="product.imageUrl"
                    :src="product.imageUrl"
                    class="h-10 w-10 rounded-full object-cover"
                    :alt="product.name"
                  />
                  <div
                    v-else
                    class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500"
                  >
                    <span class="text-xs">N/A</span>
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">
                    {{ product.name }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">
                {{
                  product.categories?.length
                    ? product.categories[0].name
                    : "Sin categoría"
                }}
              </div>
              <div
                v-if="product.categories?.length > 1"
                class="text-xs text-gray-500"
              >
                +{{ product.categories.length - 1 }} más
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              ${{ formatPrice(product.price) }}
              <span
                v-if="product.originalPrice"
                class="text-xs text-gray-400 line-through"
              >
                ${{ formatPrice(product.originalPrice) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="[
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                  product.stock > 10
                    ? 'bg-green-100 text-green-800'
                    : product.stock > 0
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800',
                ]"
              >
                {{ product.stock > 0 ? product.stock : "Agotado" }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="[
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                  product.isNewArrival
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800',
                ]"
              >
                {{ product.isNewArrival ? "Novedad" : "Regular" }}
              </span>
            </td>
            <td
              class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
            >
              <div class="flex justify-end space-x-2">
                <NuxtLink
                  :to="`/admin/products/${product.id}`"
                  class="text-indigo-600 hover:text-indigo-900"
                >
                  <EditIcon class="h-5 w-5" />
                  <span class="sr-only">Editar</span>
                </NuxtLink>
                <button
                  @click="confirmDelete(product)"
                  class="text-red-600 hover:text-red-900"
                >
                  <TrashIcon class="h-5 w-5" />
                  <span class="sr-only">Eliminar</span>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="products.length === 0">
            <td colspan="6" class="px-6 py-12 text-center text-gray-500">
              No se encontraron productos que coincidan con los criterios de
              búsqueda
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginación -->
    <div
      v-if="!loading && !error && totalPages > 0"
      class="flex justify-between items-center mt-8"
    >
      <button
        @click="previousPage"
        class="flex items-center text-gray-600"
        :disabled="currentPage === 1"
        :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
      >
        <ArrowLeftIcon class="h-4 w-4 mr-1" />
        Anterior
      </button>
      <div class="flex items-center space-x-2">
        <button
          v-for="page in paginationRange"
          :key="page"
          @click="goToPage(page)"
          :class="[
            'w-8 h-8 rounded-full flex items-center justify-center text-sm',
            page === currentPage
              ? 'bg-black text-white'
              : 'text-gray-600 hover:bg-gray-100',
          ]"
        >
          {{ page }}
        </button>
      </div>
      <button
        @click="nextPage"
        class="flex items-center text-gray-600"
        :disabled="currentPage >= totalPages"
        :class="{ 'opacity-50 cursor-not-allowed': currentPage >= totalPages }"
      >
        Siguiente
        <ArrowRightIcon class="h-4 w-4 ml-1" />
      </button>
    </div>

    <!-- Modal de confirmación para eliminar -->
    <teleport to="body">
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      >
        <div class="bg-white rounded-lg max-w-md w-full p-6">
          <div class="text-center">
            <AlertTriangleIcon class="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              ¿Eliminar producto?
            </h3>
            <p class="text-sm text-gray-500 mb-6">
              ¿Estás seguro de que quieres eliminar
              <span class="font-medium">{{ productToDelete?.name }}</span
              >? Esta acción no se puede deshacer.
            </p>
            <div class="flex justify-end space-x-3">
              <button
                @click="showDeleteModal = false"
                class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded"
              >
                Cancelar
              </button>
              <button
                @click="deleteProduct"
                class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                :disabled="isDeleting"
              >
                {{ isDeleting ? "Eliminando..." : "Eliminar" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useApi } from "~/composables/useApi";
import { useToast } from "~/composables/useToast";
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Trash as TrashIcon,
  AlertCircle as AlertCircleIcon,
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,
  Plus as PlusIcon,
  AlertTriangle as AlertTriangleIcon,
} from "lucide-vue-next";
import debounce from "lodash.debounce";

// Definir middleware para proteger esta ruta
definePageMeta({
  middleware: ["admin"],
});

// Composables
const api = useApi();
const { showToast } = useToast();

// Estado
const loading = ref(true);
const error = ref<string | null>(null);
const products = ref<any[]>([]);
const categories = ref<any[]>([]);
const showDeleteModal = ref(false);
const productToDelete = ref<any | null>(null);
const isDeleting = ref(false);

// Filtros y paginación
const searchQuery = ref("");
const categoryFilter = ref("");
const sortBy = ref("newest");
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalProducts = ref(0);

// Propiedades calculadas
const totalPages = computed(() => {
  return Math.ceil(totalProducts.value / itemsPerPage.value);
});

const paginationRange = computed(() => {
  // Mostrar máximo 5 páginas en la paginación
  const maxPagesToShow = 5;
  const pages = [];

  if (totalPages.value <= maxPagesToShow) {
    // Si hay pocas páginas, mostrarlas todas
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i);
    }
  } else {
    // Si hay muchas páginas, mostrar algunas alrededor de la página actual
    let startPage = Math.max(
      1,
      currentPage.value - Math.floor(maxPagesToShow / 2)
    );
    let endPage = Math.min(totalPages.value, startPage + maxPagesToShow - 1);

    // Ajustar si llegamos a los límites
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
  }

  return pages;
});

// Métodos
const debouncedSearch = debounce(() => {
  currentPage.value = 1;
  loadProducts();
}, 300);

const loadProducts = async () => {
  loading.value = true;
  error.value = null;

  try {
    // Construir parámetros de consulta
    const queryParams = new URLSearchParams();
    queryParams.append("page", currentPage.value.toString());
    queryParams.append("limit", itemsPerPage.value.toString());

    if (searchQuery.value) {
      queryParams.append("search", searchQuery.value);
    }

    if (categoryFilter.value) {
      queryParams.append("categoryId", categoryFilter.value);
    }

    if (sortBy.value) {
      queryParams.append("sort", sortBy.value);
    }

    const response = await api.get(`/admin/products?${queryParams.toString()}`);

    if (response.success) {
      products.value = response.data.products;
      totalProducts.value = response.data.total;
    } else {
      error.value = response.message || "Error al cargar los productos";
    }
  } catch (err) {
    console.error("Error cargando productos:", err);
    error.value = "Error al conectar con el servidor";
  } finally {
    loading.value = false;
  }
};

const loadCategories = async () => {
  try {
    const response = await api.get("/categories");
    if (response.success) {
      categories.value = response.data;
    }
  } catch (error) {
    console.error("Error al cargar categorías:", error);
  }
};

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

const goToPage = (page: number) => {
  currentPage.value = page;
  loadProducts();
};

const confirmDelete = (product: any) => {
  productToDelete.value = product;
  showDeleteModal.value = true;
};

const deleteProduct = async () => {
  if (!productToDelete.value) return;

  isDeleting.value = true;

  try {
    const response = await api.delete(
      `/admin/products/${productToDelete.value.id}`
    );

    if (response.success) {
      showToast("Producto eliminado correctamente", "success");
      loadProducts(); // Recargar productos
    } else {
      showToast(response.message || "Error al eliminar el producto", "error");
    }
  } catch (err) {
    console.error("Error eliminando producto:", err);
    showToast("Error al conectar con el servidor", "error");
  } finally {
    isDeleting.value = false;
    showDeleteModal.value = false;
    productToDelete.value = null;
  }
};

const formatPrice = (price: number): string => {
  return Number(price).toFixed(2);
};

// Cargar datos al montar el componente
onMounted(async () => {
  await Promise.all([loadProducts(), loadCategories()]);
});

// Observar cambios en los filtros para actualizar la paginación
watch([sortBy, categoryFilter], () => {
  currentPage.value = 1;
  loadProducts();
});
</script>
