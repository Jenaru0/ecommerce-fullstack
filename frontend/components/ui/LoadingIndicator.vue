<template>
  <div v-if="loading" class="flex justify-center items-center py-8">
    <div
      class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"
    ></div>
    <span class="ml-3 text-gray-600">{{ message }}</span>
  </div>
</template>

<script setup>
defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    default: "Cargando...",
  },
});
</script>
