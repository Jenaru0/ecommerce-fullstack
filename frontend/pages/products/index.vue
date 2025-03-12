<!-- frontend/pages/products/index.vue -->
<template>
  <div class="container mx-auto px-6 md:px-16 lg:px-24 py-12">
    <h1 class="text-3xl font-bold mb-6">Catálogo de productos</h1>

    <div v-if="loading" class="text-center py-8">
      <p class="text-xl">Cargando productos...</p>
    </div>

    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-500">{{ error }}</p>
    </div>

    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div
          v-for="product in products"
          :key="product.id"
          class="bg-white shadow-md rounded-lg overflow-hidden"
        >
          <img
            :src="product.imageUrl"
            :alt="product.name"
            class="w-full h-48 object-cover"
          />
          <div class="p-4">
            <h3 class="font-bold text-lg mb-2">{{ product.name }}</h3>
            <p class="text-gray-700 mb-2 line-clamp-2">
              {{ product.description }}
            </p>
            <div class="flex justify-between items-center">
              <span class="text-xl font-bold"
                >${{ formatPrice(product.price) }}</span
              >
              <div class="flex space-x-2">
                <NuxtLink
                  :to="`/products/${product.id}`"
                  class="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
                >
                  Ver
                </NuxtLink>
                <button
                  @click="addToCart(product)"
                  class="bg-black text-white px-3 py-1 rounded hover:bg-gray-800"
                >
                  Añadir
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useCartStore } from "~/stores/cart";
import { useApi } from "~/composables/useApi";

const cartStore = useCartStore();
const api = useApi();

const products = ref([]);
const loading = ref(true);
const error = ref(null);

// Función para formatear precios
const formatPrice = (price) => {
  return Number(price).toFixed(2);
};

onMounted(async () => {
  try {
    const response = await api.get("/products");

    if (response.success) {
      products.value = response.data;
    } else {
      error.value = response.message;
    }
  } catch (err) {
    console.error("Error fetching products:", err);
    error.value = "Error al cargar los productos";
  } finally {
    loading.value = false;
  }
});

const addToCart = (product) => {
  cartStore.addItem({
    id: product.id,
    name: product.name,
    price: Number(product.price),
    imageUrl: product.imageUrl,
    quantity: 1,
  });
};
</script>
