<template>
  <div>
    <!-- Loading y error states -->
    <div v-if="loading" class="text-center py-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto"
      ></div>
      <p class="text-xl mt-4">Cargando producto...</p>
    </div>

    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-500 mb-4">
        <AlertCircleIcon class="h-12 w-12 mx-auto" />
      </div>
      <p class="text-red-500">{{ error }}</p>
      <NuxtLink
        to="/products"
        class="inline-block mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        Volver a productos
      </NuxtLink>
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
                :src="image || '/images/placeholder-product.jpg'"
                :alt="`${product.name} miniatura ${index + 1}`"
                class="w-full h-full object-cover"
              />
            </div>
          </div>

          <!-- Imagen principal -->
          <div class="flex-1 bg-gray-100 rounded-md overflow-hidden">
            <img
              :src="
                productImages[selectedImageIndex] ||
                '/images/placeholder-product.jpg'
              "
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
            <RatingStars :rating="product.rating || 0" />
            <span class="ml-2 text-gray-600">
              {{ (product.rating || 0).toFixed(1) }}/5
              <span class="text-sm text-gray-500"
                >({{ product.reviewsCount || 0 }} reseñas)</span
              >
            </span>
          </div>

          <!-- Precio -->
          <div class="flex items-center mb-6">
            <span class="text-3xl font-bold"
              >${{ formatPrice(product.price) }}</span
            >
            <span
              v-if="
                product.originalPrice && product.originalPrice > product.price
              "
              class="ml-3 text-xl text-gray-400 line-through"
            >
              ${{ formatPrice(product.originalPrice) }}
            </span>
            <span
              v-if="discountPercentage"
              class="ml-3 px-2 py-1 bg-red-100 text-red-600 rounded-md text-sm font-medium"
            >
              -{{ discountPercentage }}%
            </span>
          </div>

          <!-- Descripción -->
          <p class="text-gray-600 mb-8">{{ product.description }}</p>

          <!-- Selección de color (si hay variantes) -->
          <div v-if="hasColorVariants" class="mb-8">
            <h3 class="text-lg font-medium mb-3">Selecciona el color</h3>
            <div class="flex space-x-3">
              <button
                v-for="color in colorVariants"
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

          <!-- Selección de talla (si hay variantes) -->
          <div v-if="hasSizeVariants" class="mb-8">
            <h3 class="text-lg font-medium mb-3">Elige la talla</h3>
            <div class="flex flex-wrap gap-3">
              <button
                v-for="size in sizeVariants"
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

          <!-- Categorías -->
          <div class="mt-8 flex items-center text-sm text-gray-500">
            <span class="mr-2">Categoría:</span>
            <NuxtLink
              v-if="product.category"
              :to="`/products/category/${product.category.id}`"
              class="hover:underline text-black"
            >
              {{ product.category.name }}
            </NuxtLink>
            <span v-else>Sin categoría</span>
          </div>
        </div>
      </div>

      <!-- Reseñas y características (opcional) -->
      <div class="mt-16 border-t border-gray-200 pt-10">
        <h2 class="text-2xl font-bold mb-6">Reseñas</h2>

        <div v-if="product.reviews && product.reviews.length > 0">
          <!-- Mostrar reseñas -->
        </div>
        <div v-else class="text-gray-500">
          Este producto aún no tiene reseñas.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useCartStore } from "~/stores/cart";
import { useToast } from "~/composables/useToast";
import { useApi } from "~/composables/useApi";
import {
  Check as CheckIcon,
  Minus as MinusIcon,
  Plus as PlusIcon,
  AlertCircle as AlertCircleIcon,
} from "lucide-vue-next";
import BreadCrumb from "~/components/ui/BreadCrumb.vue";

// Composables
const route = useRoute();
const cartStore = useCartStore();
const { showToast } = useToast();
const api = useApi();

// Estados
const loading = ref(true);
const error = ref(null);
const product = ref(null);
const selectedImageIndex = ref(0);
const selectedColor = ref(null);
const selectedSize = ref(null);
const quantity = ref(1);
const showSizeWarning = ref(false);

// Cargar producto desde la API
onMounted(async () => {
  await loadProduct();
});

const loadProduct = async () => {
  loading.value = true;
  error.value = null;

  try {
    const productId = route.params.id;
    const response = await api.get(`/products/${productId}`);

    if (response.success) {
      product.value = response.data;

      // Inicializar selecciones
      if (hasColorVariants.value && colorVariants.value.length > 0) {
        selectedColor.value = colorVariants.value[0].code;
      }

      if (hasSizeVariants.value && sizeVariants.value.length > 0) {
        selectedSize.value = sizeVariants.value[0].code;
      }
    } else {
      error.value = response.message || "No se pudo cargar el producto";
    }
  } catch (err) {
    console.error("Error al cargar el producto:", err);
    error.value = "Error al cargar la información del producto";
  } finally {
    loading.value = false;
  }
};

// Propiedades computadas
const productImages = computed(() => {
  if (!product.value) return [];

  // Si hay imágenes adicionales, incluirlas; de lo contrario solo la imagen principal
  if (
    product.value.additionalImages &&
    Array.isArray(product.value.additionalImages)
  ) {
    return [product.value.imageUrl, ...product.value.additionalImages];
  }

  return [product.value.imageUrl];
});

// Variantes de color (si existen)
const hasColorVariants = computed(() => {
  return (
    product.value?.variants?.colors &&
    Array.isArray(product.value.variants.colors) &&
    product.value.variants.colors.length > 0
  );
});

const colorVariants = computed(() => {
  if (!hasColorVariants.value) return [];
  return product.value.variants.colors;
});

// Variantes de talla (si existen)
const hasSizeVariants = computed(() => {
  return (
    product.value?.variants?.sizes &&
    Array.isArray(product.value.variants.sizes) &&
    product.value.variants.sizes.length > 0
  );
});

const sizeVariants = computed(() => {
  if (!hasSizeVariants.value) return [];
  return product.value.variants.sizes;
});

// Calcular descuento si hay precio original
const discountPercentage = computed(() => {
  if (!product.value) return null;

  const { price, originalPrice } = product.value;

  if (originalPrice && originalPrice > price) {
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  }

  return null;
});

// Verificar si se requiere seleccionar talla
const needsSize = computed(() => hasSizeVariants.value);

const isSizeSelected = computed(() => {
  return !needsSize.value || !!selectedSize.value;
});

// Generar breadcrumb dinámicamente
const breadcrumbItems = computed(() => {
  const items = [
    { text: "Inicio", url: "/" },
    { text: "Productos", url: "/products" },
  ];

  // Añadir categoría si existe
  if (product.value?.category) {
    items.push({
      text: product.value.category.name,
      url: `/products/category/${product.value.category.name.toLowerCase()}`,
    });
  }

  // Añadir nombre del producto
  if (product.value) {
    items.push({ text: product.value.name });
  }

  return items;
});

// Observar cambios en el color para actualizar imágenes
watch(selectedColor, () => {
  // Reiniciar al índice 0 cuando cambia el color
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
    // Obtener el nombre del color seleccionado
    const colorObj = colorVariants.value.find(
      (c) => c.code === selectedColor.value
    );
    if (colorObj) {
      variantInfo.color = colorObj.name;
    }
  }

  if (selectedSize.value) {
    // Obtener el nombre de la talla seleccionada
    const sizeObj = sizeVariants.value.find(
      (s) => s.code === selectedSize.value
    );
    if (sizeObj) {
      variantInfo.size = sizeObj.name;
    }
  }

  cartStore.addItem({
    id: product.value.id,
    name: product.value.name,
    price: Number(product.value.price),
    imageUrl: productImages.value[0],
    quantity: quantity.value,
    stock: product.value.stock,
    variants: Object.keys(variantInfo).length ? variantInfo : undefined,
  });

  showToast("Producto añadido al carrito", "success");
};

// Funciones de utilidad
const formatPrice = (price) => {
  return Number(price).toFixed(2);
};
</script>
