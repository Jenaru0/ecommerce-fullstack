<!-- frontend/components/ProductCard.vue -->
<template>
  <div
    class="bg-gray-100 rounded-lg overflow-hidden p-4 transition-all hover:shadow-lg"
  >
    <div class="aspect-w-1 aspect-h-1 mb-4">
      <img
        :src="product.imageUrl || '/assets/images/placeholder-product.png'"
        :alt="product.name"
        class="object-cover w-full h-full"
      />
    </div>
    <h3 class="font-medium mb-1 truncate">{{ product.name }}</h3>

    <div class="flex items-center mb-1">
      <RatingStars :rating="productRating" />
      <span class="text-xs text-gray-500 ml-1"
        >{{ productRating.toFixed(1) }}/5</span
      >
    </div>

    <div class="flex items-center justify-between mt-2">
      <div class="flex items-center">
        <span class="font-semibold mr-2"
          >${{ formatPrice(product.price) }}</span
        >
        <span
          v-if="
            product.originalPrice &&
            Number(product.originalPrice) > Number(product.price)
          "
          class="text-gray-500 line-through text-sm"
        >
          ${{ formatPrice(product.originalPrice) }}
        </span>
        <span
          v-if="discountPercentage"
          class="ml-2 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded"
          >-{{ discountPercentage }}%</span
        >
      </div>

      <button
        @click="addToCart"
        class="p-1.5 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
        aria-label="Añadir al carrito"
      >
        <ShoppingBag class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { ShoppingBag } from "lucide-vue-next";
import { useCartStore } from "~/stores/cart";

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const cartStore = useCartStore();

// Calcular valores derivados de forma segura
const productRating = computed(() => {
  return props.product.rating || 0;
});

const discountPercentage = computed(() => {
  if (
    !props.product.originalPrice ||
    Number(props.product.originalPrice) <= Number(props.product.price)
  ) {
    return null;
  }
  return Math.round(
    ((Number(props.product.originalPrice) - Number(props.product.price)) /
      Number(props.product.originalPrice)) *
      100
  );
});

// Función para formatear precios
const formatPrice = (price) => {
  return Number(price).toFixed(2);
};

const addToCart = () => {
  cartStore.addItem({
    id: props.product.id,
    name: props.product.name,
    price: Number(props.product.price),
    imageUrl: props.product.imageUrl,
    quantity: 1,
    stock: props.product.stock || 10, // Default a 10 si no está definido
  });
};
</script>
