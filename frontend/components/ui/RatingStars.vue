<!-- frontend/components/ui/RatingStars.vue -->
<template>
  <div class="flex">
    <div v-for="i in 5" :key="i" class="text-yellow-400">
      <StarIcon
        class="h-5 w-5"
        :class="{
          'text-yellow-400': i <= Math.floor(rating),
          'text-gray-300': i > Math.ceil(rating),
          'text-gradient': isPartial(i),
        }"
      />
    </div>
  </div>
</template>

<script setup>
import { Star as StarIcon } from "lucide-vue-next";

const props = defineProps({
  rating: {
    type: Number,
    default: 0,
  },
});

// Determina si una estrella debe mostrarse parcialmente llena
const isPartial = (position) => {
  return position === Math.ceil(props.rating) && props.rating % 1 !== 0;
};
</script>

<style scoped>
.text-gradient {
  background: linear-gradient(to right, #fbbf24 50%, #d1d5db 50%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}
</style>
