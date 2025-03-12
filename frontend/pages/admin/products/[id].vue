// filepath:
c:\Users\jonna\OneDrive\Escritorio\ecommerce-fullstack\frontend\pages\admin\products\[id].vue
<template>
  <div class="container mx-auto px-6 md:px-16 lg:px-24 py-12">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold">
        {{ isEdit ? "Editar Producto" : "Nuevo Producto" }}
      </h1>
      <div class="flex space-x-3">
        <NuxtLink
          to="/admin/products"
          class="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
        >
          Cancelar
        </NuxtLink>
        <button
          @click="saveProduct"
          :disabled="saving"
          class="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {{ saving ? "Guardando..." : "Guardar Producto" }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="py-12 text-center">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto"
      ></div>
      <p class="mt-4 text-gray-600">Cargando...</p>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Formulario principal -->
      <div class="lg:col-span-2 space-y-8">
        <!-- Información básica -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-xl font-bold mb-6">Información Básica</h2>

          <div class="space-y-4">
            <!-- Nombre del producto -->
            <div>
              <label
                for="name"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Nombre*</label
              >
              <input
                id="name"
                v-model="product.name"
                type="text"
                class="w-full border-gray-300 rounded-md shadow-sm"
                :class="{ 'border-red-300 focus:ring-red-500': errors.name }"
              />
              <p v-if="errors.name" class="mt-1 text-sm text-red-600">
                {{ errors.name }}
              </p>
            </div>

            <!-- Descripción corta -->
            <div>
              <label
                for="description"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Descripción corta*</label
              >
              <textarea
                id="description"
                v-model="product.description"
                rows="3"
                class="w-full border-gray-300 rounded-md shadow-sm"
                :class="{
                  'border-red-300 focus:ring-red-500': errors.description,
                }"
              ></textarea>
              <p v-if="errors.description" class="mt-1 text-sm text-red-600">
                {{ errors.description }}
              </p>
            </div>

            <!-- Descripción completa -->
            <div>
              <label
                for="fullDescription"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Descripción completa</label
              >
              <textarea
                id="fullDescription"
                v-model="product.fullDescription"
                rows="6"
                class="w-full border-gray-300 rounded-md shadow-sm"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Precios e inventario -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-xl font-bold mb-6">Precios e Inventario</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Precio -->
            <div>
              <label
                for="price"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Precio*</label
              >
              <div class="relative mt-1 rounded-md shadow-sm">
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <span class="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  id="price"
                  v-model="product.price"
                  type="number"
                  step="0.01"
                  min="0"
                  class="pl-7 w-full border-gray-300 rounded-md shadow-sm"
                  :class="{ 'border-red-300 focus:ring-red-500': errors.price }"
                />
              </div>
              <p v-if="errors.price" class="mt-1 text-sm text-red-600">
                {{ errors.price }}
              </p>
            </div>

            <!-- Precio original -->
            <div>
              <label
                for="originalPrice"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Precio original</label
              >
              <div class="relative mt-1 rounded-md shadow-sm">
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <span class="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  id="originalPrice"
                  v-model="product.originalPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  class="pl-7 w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <p class="mt-1 text-xs text-gray-500">
                Déjalo vacío si no hay descuento
              </p>
            </div>

            <!-- Stock -->
            <div>
              <label
                for="stock"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Stock*</label
              >
              <input
                id="stock"
                v-model="product.stock"
                type="number"
                min="0"
                class="w-full border-gray-300 rounded-md shadow-sm"
                :class="{ 'border-red-300 focus:ring-red-500': errors.stock }"
              />
              <p v-if="errors.stock" class="mt-1 text-sm text-red-600">
                {{ errors.stock }}
              </p>
            </div>

            <!-- Es novedad -->
            <div class="flex items-center h-full mt-5">
              <input
                id="isNewArrival"
                v-model="product.isNewArrival"
                type="checkbox"
                class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label
                for="isNewArrival"
                class="ml-2 block text-sm text-gray-700"
              >
                Marcar como novedad
              </label>
            </div>
          </div>
        </div>

        <!-- Categorías -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-xl font-bold mb-6">Categorías</h2>

          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div
              v-for="category in categories"
              :key="category.id"
              class="flex items-start"
            >
              <input
                :id="`category-${category.id}`"
                v-model="selectedCategories"
                :value="category.id"
                type="checkbox"
                class="h-4 w-4 mt-1 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label
                :for="`category-${category.id}`"
                class="ml-2 block text-sm text-gray-700"
              >
                {{ category.name }}
              </label>
            </div>
          </div>
          <p v-if="errors.categories" class="mt-2 text-sm text-red-600">
            {{ errors.categories }}
          </p>
        </div>
      </div>

      <!-- Imágenes y características -->
      <div class="space-y-8">
        <!-- Imagen principal -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-xl font-bold mb-6">Imagen Principal</h2>

          <div v-if="product.imageUrl" class="mb-4">
            <img
              :src="product.imageUrl"
              alt="Imagen principal"
              class="w-full h-48 object-cover rounded"
            />
            <button
              @click="product.imageUrl = ''"
              class="mt-2 text-sm text-red-600 hover:text-red-800"
            >
              Eliminar imagen
            </button>
          </div>

          <div
            v-else
            class="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center"
          >
            <UploadCloudIcon class="h-10 w-10 text-gray-400" />
            <p class="mt-2 text-sm text-gray-500">
              Arrastra y suelta una imagen o
            </p>
            <input
              type="file"
              accept="image/*"
              class="hidden"
              ref="fileInput"
              @change="handleImageUpload"
            />
            <button
              @click="$refs.fileInput.click()"
              class="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Selecciona un archivo
            </button>
          </div>
          <p v-if="errors.imageUrl" class="mt-1 text-sm text-red-600">
            {{ errors.imageUrl }}
          </p>
        </div>

        <!-- Características -->
        <div class="bg-white shadow rounded-lg p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold">Características</h2>
            <button
              @click="addFeature"
              class="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              + Añadir
            </button>
          </div>

          <div
            v-if="product.features && product.features.length > 0"
            class="space-y-3"
          >
            <div
              v-for="(feature, index) in product.features"
              :key="index"
              class="flex items-center"
            >
              <input
                v-model="product.features[index]"
                type="text"
                class="flex-grow border-gray-300 rounded-md shadow-sm"
              />
              <button
                @click="removeFeature(index)"
                class="ml-2 text-red-500 hover:text-red-700"
              >
                <TrashIcon class="h-5 w-5" />
              </button>
            </div>
          </div>
          <p v-else class="text-sm text-gray-500 italic">
            No hay características
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useApi } from "~/composables/useApi";
import { useToast } from "~/composables/useToast";
import {
  UploadCloud as UploadCloudIcon,
  Trash as TrashIcon,
} from "lucide-vue-next";

// Definir middleware para proteger esta ruta
definePageMeta({
  middleware: ["admin"],
});

// Composables
const route = useRoute();
const router = useRouter();
const api = useApi();
const { showToast } = useToast();
const fileInput = ref<HTMLInputElement | null>(null);

// Estado
const loading = ref(true);
const saving = ref(false);
const errors = ref<Record<string, string>>({});
const categories = ref<any[]>([]);
const selectedCategories = ref<number[]>([]);

// Producto
const product = ref<any>({
  name: "",
  description: "",
  fullDescription: "",
  price: "",
  originalPrice: "",
  stock: 0,
  imageUrl: "",
  features: [],
  isNewArrival: false,
});

// Modos
const isEdit = computed(() => {
  return route.params.id !== "new";
});

// Cargar datos del producto si estamos en modo edición
const loadProduct = async () => {
  if (!isEdit.value) {
    loading.value = false;
    return;
  }

  try {
    const response = await api.get(`/products/${route.params.id}`);

    if (response.success) {
      product.value = {
        ...response.data,
        price: response.data.price.toString(),
        originalPrice: response.data.originalPrice
          ? response.data.originalPrice.toString()
          : "",
      };

      // Marcar las categorías seleccionadas
      selectedCategories.value = response.data.categories
        ? response.data.categories.map((cat: any) => cat.id)
        : [];
    } else {
      showToast("Error al cargar el producto", "error");
      router.push("/admin/products");
    }
  } catch (err) {
    console.error("Error cargando producto:", err);
    showToast("Error al conectar con el servidor", "error");
    router.push("/admin/products");
  } finally {
    loading.value = false;
  }
};

// Cargar categorías
const loadCategories = async () => {
  try {
    const response = await api.get("/categories");
    if (response.success) {
      categories.value = response.data;
    }
  } catch (err) {
    console.error("Error cargando categorías:", err);
    showToast("Error al cargar las categorías", "warning");
  }
};

// Manejo de imágenes
const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files?.length) return;

  const file = target.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    product.value.imageUrl = e.target?.result;
  };

  reader.readAsDataURL(file);
};

// Características
const addFeature = () => {
  if (!product.value.features) {
    product.value.features = [];
  }
  product.value.features.push("");
};

const removeFeature = (index: number) => {
  product.value.features.splice(index, 1);
};

// Validar el formulario
const validateForm = (): boolean => {
  const newErrors: Record<string, string> = {};

  if (!product.value.name.trim()) {
    newErrors.name = "El nombre es obligatorio";
  }

  if (!product.value.description.trim()) {
    newErrors.description = "La descripción corta es obligatoria";
  }

  if (
    !product.value.price ||
    isNaN(Number(product.value.price)) ||
    Number(product.value.price) <= 0
  ) {
    newErrors.price = "El precio debe ser un número positivo";
  }

  if (
    product.value.stock === undefined ||
    isNaN(Number(product.value.stock)) ||
    Number(product.value.stock) < 0
  ) {
    newErrors.stock = "El stock debe ser un número no negativo";
  }

  if (!product.value.imageUrl && isEdit.value) {
    newErrors.imageUrl = "La imagen principal es obligatoria";
  }

  if (selectedCategories.value.length === 0) {
    newErrors.categories = "Selecciona al menos una categoría";
  }

  errors.value = newErrors;
  return Object.keys(newErrors).length === 0;
};

// Guardar producto
const saveProduct = async () => {
  if (!validateForm()) {
    showToast("Por favor corrige los errores en el formulario", "error");
    return;
  }

  saving.value = true;

  try {
    // Preparar datos para enviar
    const productData = {
      ...product.value,
      price: Number(product.value.price),
      originalPrice: product.value.originalPrice
        ? Number(product.value.originalPrice)
        : undefined,
      stock: Number(product.value.stock),
      categoryIds: selectedCategories.value,
    };

    let response;

    if (isEdit.value) {
      response = await api.put(
        `/admin/products/${route.params.id}`,
        productData
      );
    } else {
      response = await api.post("/admin/products", productData);
    }

    if (response.success) {
      showToast(
        isEdit.value
          ? "Producto actualizado correctamente"
          : "Producto creado correctamente",
        "success"
      );
      router.push("/admin/products");
    } else {
      showToast(response.message || "Error al guardar el producto", "error");
    }
  } catch (err) {
    console.error("Error guardando producto:", err);
    showToast("Error al conectar con el servidor", "error");
  } finally {
    saving.value = false;
  }
};

// Inicialización
onMounted(async () => {
  await Promise.all([loadCategories(), loadProduct()]);
});
</script>
