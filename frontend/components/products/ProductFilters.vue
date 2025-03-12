<template>
  <aside class="w-full md:w-64 flex-shrink-0">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-medium">{{ title }}</h2>
      <button @click="$emit('toggle-mobile')" class="p-2 md:hidden">
        <SlidersIcon class="h-5 w-5" />
      </button>
    </div>

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

          <!-- Subcategorías -->
          <div v-if="category.expanded" class="pl-4 mt-2 space-y-2">
            <button
              v-for="subcategory in category.subcategories"
              :key="subcategory"
              class="block w-full text-left py-1 text-gray-600 hover:text-black"
              @click="selectSubcategory(subcategory)"
            >
              {{ subcategory }}
            </button>
          </div>
        </div>

        <!-- Rango de Precio -->
        <div v-if="showPriceRange" class="border-b pb-4">
          <h3 class="font-medium mb-4">Precio</h3>
          <div class="px-2">
            <div class="relative h-2 bg-gray-200 rounded-full">
              <div
                class="absolute h-full bg-black rounded-full"
                :style="{
                  left: `${
                    ((modelValue.priceRange[0] - minPrice) /
                      (maxPrice - minPrice)) *
                    100
                  }%`,
                  width: `${
                    ((modelValue.priceRange[1] - modelValue.priceRange[0]) /
                      (maxPrice - minPrice)) *
                    100
                  }%`,
                }"
              ></div>
              <div
                class="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-black rounded-full cursor-pointer"
                :style="{
                  left: `${
                    ((modelValue.priceRange[0] - minPrice) /
                      (maxPrice - minPrice)) *
                    100
                  }%`,
                }"
              ></div>
              <div
                class="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-black rounded-full cursor-pointer"
                :style="{
                  left: `${
                    ((modelValue.priceRange[1] - minPrice) /
                      (maxPrice - minPrice)) *
                    100
                  }%`,
                }"
              ></div>
            </div>
            <div class="flex justify-between mt-2 text-sm">
              <span>${{ formatPrice(modelValue.priceRange[0]) }}</span>
              <span>${{ formatPrice(modelValue.priceRange[1]) }}</span>
            </div>
          </div>
        </div>

        <!-- Colores -->
        <div v-if="showColors" class="border-b pb-4">
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
        <div v-if="showSizes" class="border-b pb-4">
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
        <div v-if="showStyles" class="border-b pb-4">
          <h3 class="font-medium mb-4">{{ stylesTitle }}</h3>
          <div class="space-y-2">
            <button
              v-for="style in styles"
              :key="style.name"
              @click="toggleStyleFilter(style)"
              class="flex items-center justify-between w-full py-2 text-left"
            >
              <span>{{ style.name }}</span>
              <CheckIcon v-if="style.selected" class="h-4 w-4 text-black" />
            </button>
          </div>
        </div>

        <button
          @click="applyFilters"
          class="w-full bg-black text-white py-3 rounded-full hover:bg-gray-800 transition-colors mt-4"
        >
          {{ applyButtonLabel }}
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import {
  ChevronRight as ChevronRightIcon,
  Sliders as SlidersIcon,
  Check as CheckIcon,
} from "lucide-vue-next";

// Define interfaces para las estructuras de datos
interface CategoryItem {
  name: string;
  count: number;
  expanded: boolean;
  subcategories: string[];
}

interface ColorItem {
  name: string;
  hex: string;
  selected: boolean;
}

interface SizeItem {
  name: string;
  selected: boolean;
}

interface StyleItem {
  name: string;
  selected: boolean;
}

interface FilterValues {
  selectedCategories: string[];
  selectedSubcategories: string[];
  priceRange: [number, number];
  selectedColors: string[];
  selectedSizes: string[];
  selectedStyles: string[];
}

// Props con tipado fuerte
const props = defineProps({
  modelValue: {
    type: Object as () => FilterValues,
    required: true,
  },
  categories: {
    type: Array as () => CategoryItem[],
    default: () => [],
  },
  colors: {
    type: Array as () => ColorItem[],
    default: () => [],
  },
  sizes: {
    type: Array as () => SizeItem[],
    default: () => [],
  },
  styles: {
    type: Array as () => StyleItem[],
    default: () => [],
  },
  minPrice: {
    type: Number,
    default: 0,
  },
  maxPrice: {
    type: Number,
    default: 1000,
  },
  title: {
    type: String,
    default: "Filtros",
  },
  showMobileFilters: {
    type: Boolean,
    default: false,
  },
  applyButtonLabel: {
    type: String,
    default: "Aplicar Filtros",
  },
  showPriceRange: {
    type: Boolean,
    default: true,
  },
  showColors: {
    type: Boolean,
    default: true,
  },
  showSizes: {
    type: Boolean,
    default: true,
  },
  showStyles: {
    type: Boolean,
    default: true,
  },
  stylesTitle: {
    type: String,
    default: "Estilo",
  },
});

// Emits tipados
const emit = defineEmits<{
  (e: "update:modelValue", value: FilterValues): void;
  (e: "toggle-mobile"): void;
  (e: "apply"): void;
}>();

// Métodos para manejar los filtros
const toggleCategory = (category: CategoryItem): void => {
  category.expanded = !category.expanded;
};

const selectSubcategory = (subcategory: string): void => {
  const newValues = { ...props.modelValue };
  const index = newValues.selectedSubcategories.indexOf(subcategory);

  if (index === -1) {
    newValues.selectedSubcategories.push(subcategory);
  } else {
    newValues.selectedSubcategories.splice(index, 1);
  }

  emit("update:modelValue", newValues);
};

const toggleColorFilter = (color: ColorItem): void => {
  color.selected = !color.selected;

  const newValues = { ...props.modelValue };

  if (color.selected) {
    newValues.selectedColors.push(color.name);
  } else {
    newValues.selectedColors = newValues.selectedColors.filter(
      (c) => c !== color.name
    );
  }

  emit("update:modelValue", newValues);
};

const toggleSizeFilter = (size: SizeItem): void => {
  size.selected = !size.selected;

  const newValues = { ...props.modelValue };

  if (size.selected) {
    newValues.selectedSizes.push(size.name);
  } else {
    newValues.selectedSizes = newValues.selectedSizes.filter(
      (s) => s !== size.name
    );
  }

  emit("update:modelValue", newValues);
};

const toggleStyleFilter = (style: StyleItem): void => {
  style.selected = !style.selected;

  const newValues = { ...props.modelValue };

  if (style.selected) {
    newValues.selectedStyles.push(style.name);
  } else {
    newValues.selectedStyles = newValues.selectedStyles.filter(
      (s) => s !== style.name
    );
  }

  emit("update:modelValue", newValues);
};

const applyFilters = (): void => {
  emit("apply");
};

// Función utilitaria para formatear precios
const formatPrice = (price: number): string => {
  return price.toFixed(2);
};
</script>
