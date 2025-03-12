<!-- frontend/pages/products/[id].vue -->
<template>
  <div>
    <!-- Loading y error states -->
    <div v-if="loading" class="text-center py-8">
      <p class="text-xl">Cargando producto...</p>
    </div>

    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-500">{{ error }}</p>
    </div>

    <div
      v-else-if="product"
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <!-- Breadcrumbs -->
      <BreadCrumb :items="breadcrumbItems" />

      <!-- Sección principal del producto -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Sección de imágenes del producto -->
        <div class="flex">
          <!-- Miniaturas -->
          <div class="hidden md:flex flex-col space-y-4 mr-4">
            <div
              v-for="(image, index) in productImages"
              :key="index"
              class="w-20 h-20 border rounded-md overflow-hidden cursor-pointer"
              :class="{
                'border-gray-800': selectedImageIndex === index,
                'border-gray-200': selectedImageIndex !== index,
              }"
              @click="selectedImageIndex = index"
            >
              <img
                :src="image"
                :alt="`${product.name} miniatura ${index + 1}`"
                class="w-full h-full object-cover"
              />
            </div>
          </div>

          <!-- Imagen principal -->
          <div class="flex-1 bg-gray-100 rounded-md overflow-hidden">
            <img
              :src="productImages[selectedImageIndex]"
              :alt="product.name"
              class="w-full h-full object-contain"
            />
          </div>
        </div>

        <!-- Detalles del producto -->
        <div>
          <h1 class="text-3xl font-bold tracking-tight mb-4">
            {{ product.name }}
          </h1>

          <!-- Calificación -->
          <div class="flex items-center mb-4">
            <RatingStars :rating="product.rating" />
            <span class="ml-2 text-gray-600"
              >{{ product.rating.toFixed(1) }}/5</span
            >
          </div>

          <!-- Precio -->
          <div class="flex items-center mb-6">
            <span class="text-3xl font-bold"
              >${{ formatPrice(product.price) }}</span
            >
            <span
              v-if="product.originalPrice"
              class="ml-3 text-xl text-gray-400 line-through"
            >
              ${{ formatPrice(product.originalPrice) }}
            </span>
            <span
              v-if="product.discountPercentage"
              class="ml-3 px-2 py-1 bg-red-100 text-red-600 rounded-md text-sm font-medium"
            >
              -{{ product.discountPercentage }}%
            </span>
          </div>

          <!-- Descripción -->
          <p class="text-gray-600 mb-8">{{ product.description }}</p>

          <!-- Selección de color -->
          <div v-if="product.variants && product.variants.colors" class="mb-8">
            <h3 class="text-lg font-medium mb-3">Selecciona el color</h3>
            <div class="flex space-x-3">
              <button
                v-for="color in product.variants.colors"
                :key="color.code"
                class="w-10 h-10 rounded-full focus:outline-none border-2"
                :class="[
                  selectedColor === color.code
                    ? 'border-gray-600 ring-2 ring-offset-2 ring-gray-800'
                    : 'border-white',
                ]"
                :style="{ backgroundColor: color.hex }"
                @click="selectedColor = color.code"
              >
                <CheckIcon
                  v-if="selectedColor === color.code"
                  class="h-6 w-6 mx-auto text-white"
                />
              </button>
            </div>
          </div>

          <!-- Selección de talla -->
          <div v-if="product.variants && product.variants.sizes" class="mb-8">
            <h3 class="text-lg font-medium mb-3">Elige la talla</h3>
            <div class="flex flex-wrap gap-3">
              <button
                v-for="size in product.variants.sizes"
                :key="size.code"
                class="px-6 py-2 rounded-full focus:outline-none"
                :class="{
                  'bg-black text-white': selectedSize === size.code,
                  'bg-gray-100 text-gray-800 hover:bg-gray-200':
                    selectedSize !== size.code,
                  'opacity-50 cursor-not-allowed': !size.available,
                }"
                :disabled="!size.available"
                @click="selectedSize = size.code"
              >
                {{ size.name }}
              </button>
            </div>
            <p
              v-if="needsSize && !isSizeSelected && showSizeWarning"
              class="text-red-500 text-sm mt-2"
            >
              Por favor selecciona una talla
            </p>
          </div>

          <!-- Información de stock -->
          <div class="mb-6">
            <p v-if="product.stock > 10" class="text-green-600 font-medium">
              Disponible: {{ product.stock }} unidades
            </p>
            <p
              v-else-if="product.stock > 0"
              class="text-orange-600 font-medium"
            >
              ¡Solo quedan {{ product.stock }} unidades!
            </p>
            <p v-else class="text-red-600 font-medium">Agotado</p>
          </div>

          <!-- Divisor -->
          <div class="border-t border-gray-200 my-8"></div>

          <!-- Cantidad y Añadir al carrito -->
          <div class="flex items-center">
            <div
              class="flex items-center h-12 border border-gray-300 rounded-full overflow-hidden mr-4"
            >
              <button
                class="w-12 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100"
                @click="updateQuantity(Math.max(1, quantity - 1))"
                :disabled="quantity <= 1"
              >
                <MinusIcon class="h-5 w-5" />
              </button>
              <input
                type="text"
                v-model="quantity"
                class="w-12 h-full text-center focus:outline-none"
              />
              <button
                class="w-12 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100"
                @click="updateQuantity(Math.min(product.stock, quantity + 1))"
                :disabled="quantity >= product.stock"
              >
                <PlusIcon class="h-5 w-5" />
              </button>
            </div>

            <button
              class="flex-1 h-12 bg-black text-white rounded-full hover:bg-gray-900 focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed"
              :disabled="product.stock <= 0 || (!isSizeSelected && needsSize)"
              @click="handleAddToCart"
            >
              Añadir al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useCartStore } from "~/stores/cart";
import { useToast } from "~/composables/useToast";
import {
  Check as CheckIcon,
  Minus as MinusIcon,
  Plus as PlusIcon,
} from "lucide-vue-next";
import BreadCrumb from "~/components/ui/BreadCrumb.vue";

// Obtener estado global
const cartStore = useCartStore();
const { showToast } = useToast();

// Estado del producto (en una aplicación real se cargaría desde la API)
const loading = ref(false);
const error = ref(null);
const product = ref({
  id: "1",
  name: "CAMISETA GRÁFICA ONE LIFE",
  description:
    "Esta camiseta gráfica es perfecta para cualquier ocasión. Fabricada con un tejido suave y transpirable, ofrece comodidad y estilo superior.",
  price: 260,
  originalPrice: 300,
  discountPercentage: 13,
  rating: 4.5,
  stock: 50,
  imageUrl:
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2017.jpg-71Vz5FlulXlhHULPRZRWP4ByG67pjY.jpeg",
  additionalImages: [
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2017.jpg-71Vz5FlulXlhHULPRZRWP4ByG67pjY.jpeg",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2017.jpg-71Vz5FlulXlhHULPRZRWP4ByG67pjY.jpeg",
  ],
  variants: {
    colors: [
      { name: "Oliva", code: "olive", hex: "#5D5D3D" },
      { name: "Verde Oscuro", code: "darkgreen", hex: "#1F3937" },
      { name: "Azul Marino", code: "navy", hex: "#1E2A4A" },
    ],
    sizes: [
      { name: "S", code: "small", available: true },
      { name: "M", code: "medium", available: true },
      { name: "L", code: "large", available: true },
      { name: "XL", code: "xlarge", available: true },
    ],
  },
  categories: [
    { name: "Hombres", id: 1 },
    { name: "Camisetas", id: 2 },
  ],
});

// Estado UI
const selectedImageIndex = ref(0);
const selectedColor = ref(product.value.variants?.colors?.[0]?.code || null);
const selectedSize = ref("large"); // Seleccionada por defecto
const quantity = ref(1);
const showSizeWarning = ref(false);

// Propiedades computadas
const productImages = computed(() => {
  if (!product.value) return [];
  return [product.value.imageUrl, ...(product.value.additionalImages || [])];
});

const needsSize = computed(() => {
  return (
    product.value &&
    product.value.variants &&
    product.value.variants.sizes &&
    product.value.variants.sizes.length > 0
  );
});

const isSizeSelected = computed(() => {
  return !needsSize.value || !!selectedSize.value;
});

// Breadcrumb items
const breadcrumbItems = computed(() => {
  return [
    { text: "Inicio", url: "/" },
    { text: "Tienda", url: "/products" },
    { text: "Hombres", url: "/products/category/hombres" },
    { text: "Camisetas" },
  ];
});

// Observar cambios en el color para actualizar imágenes (si tuviéramos imágenes por color)
watch(selectedColor, () => {
  selectedImageIndex.value = 0;
});

// Métodos
const updateQuantity = (newQuantity) => {
  quantity.value = newQuantity;
};

const handleAddToCart = () => {
  if (needsSize.value && !selectedSize.value) {
    showSizeWarning.value = true;
    return;
  }

  const variantInfo = {};

  if (selectedColor.value) {
    variantInfo.color = selectedColor.value;
  }

  if (selectedSize.value) {
    variantInfo.size = selectedSize.value;
  }

  cartStore.addItem({
    id: product.value.id,
    name: product.value.name,
    price: Number(product.value.price),
    imageUrl: productImages.value[0],
    quantity: quantity.value,
    variants: Object.keys(variantInfo).length ? variantInfo : undefined,
  });

  showToast("Producto añadido al carrito", "success");
};

// Funciones de utilidad
const formatPrice = (price) => {
  return Number(price).toFixed(2);
};
</script>
