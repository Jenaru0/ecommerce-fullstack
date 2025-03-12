<template>
  <section class="container mx-auto px-6 md:px-16 lg:px-24 py-16">
    <h2 class="text-3xl font-black text-center mb-10">MÁS VENDIDOS</h2>

    <div v-if="loading" class="flex justify-center items-center py-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"
      ></div>
    </div>

    <div v-else-if="error" class="text-center text-red-500 py-8">
      {{ error }}
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
    </div>

    <div class="text-center mt-8">
      <NuxtLink
        to="/products?category=top-selling"
        class="text-sm font-medium inline-block hover:underline"
        >Ver Todos</NuxtLink
      >
    </div>
  </section>
</template>

<script setup>
defineProps({
  products: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: null,
  },
});
</script>
