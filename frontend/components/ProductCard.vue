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
      <RatingStars :rating="product.rating" />
      <span class="text-xs text-gray-500 ml-1"
        >{{ product.rating.toFixed(1) }}/5</span
      >
    </div>

    <div class="flex items-center justify-between mt-2">
      <div class="flex items-center">
        <span class="font-semibold mr-2">${{ product.price.toFixed(2) }}</span>
        <span
          v-if="product.originalPrice && product.originalPrice > product.price"
          class="text-gray-500 line-through text-sm"
        >
          ${{ product.originalPrice.toFixed(2) }}
        </span>
        <span
          v-if="product.discountPercentage"
          class="ml-2 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded"
          >-{{ product.discountPercentage }}%</span
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
import { ShoppingBag } from "lucide-vue-next";
import { useCartStore } from "~/stores/cart";

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const cartStore = useCartStore();

const addToCart = () => {
  cartStore.addItem({
    id: props.product.id,
    name: props.product.name,
    price: props.product.price,
    imageUrl: props.product.imageUrl,
    quantity: 1,
  });
};
</script>
