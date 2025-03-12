// filepath:
c:\Users\jonna\OneDrive\Escritorio\ecommerce-fullstack\frontend\pages\products\category\[name].vue
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Breadcrumb -->
    <BreadCrumb :items="breadcrumbItems" />

    <main class="container mx-auto px-6 md:px-16 lg:px-24 pb-8">
      <div class="flex flex-col md:flex-row gap-8">
        <!-- Filtros Sidebar -->
        <aside class="w-full md:w-64 flex-shrink-0">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-medium">Filtros</h2>
            <button @click="toggleMobileFilters" class="p-2 md:hidden">
              <SlidersIcon class="h-5 w-5" />
            </button>
          </div>

          <!-- Filtros para móvil -->
          <div
            :class="[
              'md:block transition-all duration-300 overflow-hidden',
              showMobileFilters ? 'max-h-screen' : 'max-h-0 md:max-h-screen',
            ]"
          >
            <!-- Categorías -->
            <div class="space-y-4">
              <div
                v-for="category in categories"
                :key="category.name"
                class="border-b pb-4"
              >
                <button
                  class="flex items-center justify-between w-full py-2 text-left"
                  @click="toggleCategory(category)"
                >
                  <span>{{ category.name }} ({{ category.count }})</span>
                  <ChevronRightIcon
                    class="h-4 w-4 transition-transform"
                    :class="{ 'rotate-90': category.expanded }"
                  />
                </button>

                <!-- Subcategorías (mostrar si está expandida) -->
                <div v-if="category.expanded" class="pl-4 mt-2 space-y-2">
                  <button
                    v-for="subcategory in category.subcategories"
                    :key="subcategory"
                    class="block w-full text-left py-1 text-gray-600 hover:text-black"
                  >
                    {{ subcategory }}
                  </button>
                </div>
              </div>

              <!-- Rango de Precio -->
              <div class="border-b pb-4">
                <h3 class="font-medium mb-4">Precio</h3>
                <div class="px-2">
                  <div class="relative h-2 bg-gray-200 rounded-full">
                    <div
                      class="absolute h-full w-1/2 bg-black rounded-full"
                    ></div>
                    <div
                      class="absolute left-1/2 top-1/2 -translate-y-1/2 w-4 h-4 bg-black rounded-full"
                    ></div>
                  </div>
                  <div class="flex justify-between mt-2 text-sm">
                    <span>{{ formatPrice(priceRange[0]) }}</span>
                    <span>{{ formatPrice(priceRange[1]) }}</span>
                  </div>
                </div>
              </div>

              <!-- Colores -->
              <div class="border-b pb-4">
                <h3 class="font-medium mb-4">Colores</h3>
                <div class="grid grid-cols-5 gap-2">
                  <button
                    v-for="color in colors"
                    :key="color.name"
                    @click="toggleColorFilter(color)"
                    :class="[
                      'w-8 h-8 rounded-full border-2',
                      color.selected ? 'border-black' : 'border-transparent',
                    ]"
                    :style="{ backgroundColor: color.hex }"
                    :aria-label="`Filtrar por color ${color.name}`"
                  ></button>
                </div>
              </div>

              <!-- Tallas -->
              <div class="border-b pb-4">
                <h3 class="font-medium mb-4">Talla</h3>
                <div class="grid grid-cols-2 gap-2">
                  <button
                    v-for="size in sizes"
                    :key="size.name"
                    @click="toggleSizeFilter(size)"
                    :class="[
                      'px-4 py-2 rounded-full text-sm',
                      size.selected ? 'bg-black text-white' : 'bg-gray-100',
                    ]"
                  >
                    {{ size.name }}
                  </button>
                </div>
              </div>

              <!-- Estilo de Vestimenta -->
              <div class="border-b pb-4">
                <h3 class="font-medium mb-4">Estilo</h3>
                <div class="space-y-2">
                  <button
                    v-for="style in dressStyles"
                    :key="style.name"
                    @click="toggleStyleFilter(style)"
                    class="flex items-center justify-between w-full py-2 text-left"
                  >
                    <span>{{ style.name }}</span>
                    <CheckIcon
                      v-if="style.selected"
                      class="h-4 w-4 text-black"
                    />
                  </button>
                </div>
              </div>

              <button
                @click="applyFilters"
                class="w-full bg-black text-white py-3 rounded-full hover:bg-gray-800 transition-colors mt-4"
              >
                Aplicar Filtros
              </button>
            </div>
          </div>
        </aside>

        <!-- Grid de Productos -->
        <div class="flex-1">
          <div
            class="flex flex-col md:flex-row justify-between items-center mb-6"
          >
            <p class="text-gray-600 mb-2 md:mb-0">
              Mostrando {{ (currentPage - 1) * itemsPerPage + 1 }}-{{
                Math.min(currentPage * itemsPerPage, totalProducts)
              }}
              de {{ totalProducts }} Productos
            </p>
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-600">Ordenar por:</span>
              <select
                v-model="sortOption"
                @change="sortProducts"
                class="border-none bg-transparent font-medium"
              >
                <option value="popularity">Más Populares</option>
                <option value="newest">Más Recientes</option>
                <option value="price_asc">Precio: De Menor a Mayor</option>
                <option value="price_desc">Precio: De Mayor a Menor</option>
              </select>
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

          <!-- Products Grid -->
          <div
            v-else
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <div
              v-for="product in filteredProducts"
              :key="product.id"
              class="group"
            >
              <NuxtLink :to="`/products/${product.id}`">
                <div
                  class="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4"
                >
                  <img
                    :src="product.imageUrl"
                    :alt="product.name"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div
                    v-if="product.discountPercentage"
                    class="absolute top-2 right-2 bg-red-100 text-red-600 text-xs px-2 py-1 rounded"
                  >
                    -{{ product.discountPercentage }}%
                  </div>
                </div>
              </NuxtLink>

              <h3 class="font-medium mb-2">{{ product.name }}</h3>
              <div class="flex items-center mb-2">
                <RatingStars :rating="product.rating" />
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span class="font-medium"
                    >${{ formatPrice(product.price) }}</span
                  >
                  <span
                    v-if="product.originalPrice"
                    class="text-gray-400 line-through"
                  >
                    ${{ formatPrice(product.originalPrice) }}
                  </span>
                </div>
                <button
                  @click="addToCart(product)"
                  class="p-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                  aria-label="Añadir al carrito"
                >
                  <ShoppingCartIcon class="h-4 w-4" />
                </button>
              </div>
            </div>
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
              :class="{
                'opacity-50 cursor-not-allowed': currentPage >= totalPages,
              }"
            >
              Siguiente
              <ArrowRightIcon class="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCartStore } from "~/stores/cart";
import { useApi } from "~/composables/useApi";
import { useToast } from "~/composables/useToast";
import {
  ChevronRight as ChevronRightIcon,
  Sliders as SlidersIcon,
  Check as CheckIcon,
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,
  AlertCircle as AlertCircleIcon,
  ShoppingCart as ShoppingCartIcon,
} from "lucide-vue-next";
import BreadCrumb from "~/components/ui/BreadCrumb.vue";

const route = useRoute();
const router = useRouter();
const api = useApi();
const cartStore = useCartStore();
const { showToast } = useToast();

// Estado de la página
const loading = ref(true);
const error = ref<string | null>(null);
const showMobileFilters = ref(false);
const products = ref<any[]>([]);
const filteredProducts = ref<any[]>([]);
const totalProducts = ref(0);
const currentPage = ref(1);
const itemsPerPage = ref(9);
const sortOption = ref("popularity");
const categoryName = computed(() => {
  return (
    route.params.name?.toString().charAt(0).toUpperCase() +
      route.params.name?.toString().slice(1) || "Todos"
  );
});

// Filtros
const priceRange = ref([0, 1000]);
const selectedCategories = ref<string[]>([]);
const selectedColors = ref<string[]>([]);
const selectedSizes = ref<string[]>([]);
const selectedStyles = ref<string[]>([]);

// Datos para los filtros (opciones disponibles)
const categories = ref([
  {
    name: "Camisetas",
    count: 120,
    expanded: false,
    subcategories: ["Manga corta", "Manga larga", "Polos", "Tirantes"],
  },
  {
    name: "Pantalones",
    count: 89,
    expanded: false,
    subcategories: ["Vaqueros", "Chinos", "Deportivos", "Cortos"],
  },
  {
    name: "Camisas",
    count: 156,
    expanded: false,
    subcategories: ["Casual", "Formal", "Manga corta", "Lino"],
  },
  {
    name: "Sudaderas",
    count: 78,
    expanded: false,
    subcategories: ["Con capucha", "Sin capucha", "Deportivas"],
  },
  {
    name: "Chaquetas",
    count: 145,
    expanded: false,
    subcategories: ["Vaqueras", "Cuero", "Abrigos", "Cortavientos"],
  },
]);

const colors = ref([
  { name: "Verde", hex: "#22c55e", selected: false },
  { name: "Rojo", hex: "#ef4444", selected: false },
  { name: "Amarillo", hex: "#eab308", selected: false },
  { name: "Naranja", hex: "#f97316", selected: false },
  { name: "Azul", hex: "#3b82f6", selected: false },
  { name: "Morado", hex: "#a855f7", selected: false },
  { name: "Rosa", hex: "#ec4899", selected: false },
  { name: "Blanco", hex: "#ffffff", selected: false },
  { name: "Negro", hex: "#000000", selected: false },
]);

const sizes = ref([
  { name: "XXS", selected: false },
  { name: "XS", selected: false },
  { name: "S", selected: false },
  { name: "M", selected: false },
  { name: "L", selected: false },
  { name: "XL", selected: false },
  { name: "XXL", selected: false },
  { name: "3XL", selected: false },
  { name: "4XL", selected: false },
]);

const dressStyles = ref([
  { name: "Casual", selected: false },
  { name: "Formal", selected: false },
  { name: "Fiesta", selected: false },
  { name: "Deportivo", selected: false },
]);

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

// Funciones
const toggleMobileFilters = () => {
  showMobileFilters.value = !showMobileFilters.value;
};

const toggleCategory = (category: any) => {
  category.expanded = !category.expanded;
};

const toggleColorFilter = (color: any) => {
  color.selected = !color.selected;

  if (color.selected) {
    selectedColors.value.push(color.name);
  } else {
    selectedColors.value = selectedColors.value.filter((c) => c !== color.name);
  }
};

const toggleSizeFilter = (size: any) => {
  size.selected = !size.selected;

  if (size.selected) {
    selectedSizes.value.push(size.name);
  } else {
    selectedSizes.value = selectedSizes.value.filter((s) => s !== size.name);
  }
};

const toggleStyleFilter = (style: any) => {
  style.selected = !style.selected;

  if (style.selected) {
    selectedStyles.value.push(style.name);
  } else {
    selectedStyles.value = selectedStyles.value.filter((s) => s !== style.name);
  }
};

const applyFilters = () => {
  currentPage.value = 1;
  loadProducts();
};

const sortProducts = () => {
  currentPage.value = 1;
  loadProducts();
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

const formatPrice = (price: number): string => {
  return price.toFixed(2);
};

const addToCart = (product: any) => {
  cartStore.addItem({
    id: product.id,
    name: product.name,
    price: Number(product.price),
    imageUrl: product.imageUrl,
    quantity: 1,
  });

  showToast("Producto añadido al carrito", "success");
};

const loadProducts = async () => {
  loading.value = true;
  error.value = null;

  try {
    // Construir parámetros de consulta para la API
    const queryParams = new URLSearchParams();
    queryParams.append("page", currentPage.value.toString());
    queryParams.append("limit", itemsPerPage.value.toString());
    queryParams.append("sort", sortOption.value);

    if (route.params.name && route.params.name !== "todos") {
      queryParams.append("category", route.params.name.toString());
    }

    if (selectedColors.value.length > 0) {
      queryParams.append("colors", selectedColors.value.join(","));
    }

    if (selectedSizes.value.length > 0) {
      queryParams.append("sizes", selectedSizes.value.join(","));
    }

    if (selectedStyles.value.length > 0) {
      queryParams.append("styles", selectedStyles.value.join(","));
    }

    if (priceRange.value[0] > 0 || priceRange.value[1] < 1000) {
      queryParams.append("minPrice", priceRange.value[0].toString());
      queryParams.append("maxPrice", priceRange.value[1].toString());
    }

    const response = await api.get(`/products?${queryParams.toString()}`);

    if (response.success) {
      // Procesar productos para añadir información como porcentaje de descuento
      products.value = response.data.products.map((product: any) => ({
        ...product,
        discountPercentage: product.originalPrice
          ? Math.round(
              ((product.originalPrice - product.price) /
                product.originalPrice) *
                100
            )
          : null,
      }));

      filteredProducts.value = [...products.value];
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

// Breadcrumb items
const breadcrumbItems = computed(() => {
  return [{ text: "Tienda", url: "/products" }, { text: categoryName.value }];
});

// Cargar productos cuando cambia la categoría
watch(
  () => route.params.name,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      currentPage.value = 1;
      loadProducts();
    }
  }
);

// Cargar productos iniciales
onMounted(() => {
  loadProducts();
});
</script>
