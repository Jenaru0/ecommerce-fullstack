<template>
  <nav
    aria-label="Breadcrumb"
    class="container mx-auto px-6 md:px-16 lg:px-24 py-4"
  >
    <ol class="flex items-center text-sm text-gray-500">
      <li>
        <NuxtLink to="/" class="hover:text-gray-700">Inicio</NuxtLink>
      </li>
      <li v-for="(item, index) in items" :key="index" class="flex items-center">
        <ChevronRightIcon class="h-4 w-4 mx-1" />
        <NuxtLink
          v-if="item.url && index < items.length - 1"
          :to="item.url"
          class="hover:text-gray-700"
        >
          {{ item.text }}
        </NuxtLink>
        <span v-else class="text-gray-900">{{ item.text }}</span>
      </li>
    </ol>
  </nav>
</template>

<script setup>
import { ChevronRightIcon } from "lucide-vue-next";

defineProps({
  items: {
    type: Array,
    required: true,
    // Cada item debe tener: { text: string, url?: string }
  },
});
</script>
