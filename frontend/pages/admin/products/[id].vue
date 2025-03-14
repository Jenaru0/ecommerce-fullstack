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
      <p class="mt-4 text-gray-600">Cargando información...</p>
    </div>

    <div v-else class="bg-white shadow rounded-lg p-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Columna izquierda: Imagen y categoría -->
        <div>
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Imagen del producto*
            </label>
            <div
              class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
            >
              <div v-if="product.imageUrl" class="mb-4 text-center">
                <img
                  :src="product.imageUrl"
                  alt="Vista previa"
                  class="max-h-60 mx-auto"
                />
                <button
                  @click="removeImage"
                  class="mt-2 text-sm text-red-600 hover:text-red-900"
                >
                  <TrashIcon class="h-4 w-4 inline" /> Eliminar imagen
                </button>
              </div>
              <div v-else class="space-y-1 text-center">
                <div class="flex text-sm text-gray-600">
                  <label
                    for="file-upload"
                    class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                  >
                    <div class="flex flex-col items-center">
                      <UploadCloudIcon class="h-10 w-10 mb-2 text-gray-400" />
                      <span>Subir imagen</span>
                      <input
                        id="file-upload"
                        ref="fileInput"
                        type="file"
                        @change="handleImageUpload"
                        class="sr-only"
                        accept="image/*"
                      />
                    </div>
                  </label>
                </div>
                <p class="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
              </div>
            </div>
            <p v-if="errors.imageUrl" class="mt-1 text-sm text-red-600">
              {{ errors.imageUrl }}
            </p>
          </div>

          <div class="mt-6">
            <label
              for="category"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Categoría*</label
            >
            <select
              id="category"
              v-model="product.categoryId"
              class="w-full border-gray-300 rounded-md shadow-sm"
              :class="{
                'border-red-300 focus:ring-red-500': errors.categoryId,
              }"
            >
              <option value="">Seleccionar categoría</option>
              <option
                v-for="category in categories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
            <p v-if="errors.categoryId" class="mt-1 text-sm text-red-600">
              {{ errors.categoryId }}
            </p>
            <!-- Texto informativo sobre la importancia de la categoría -->
            <p class="mt-1 text-xs text-gray-500">
              La categoría ayuda a organizar y encontrar productos más
              fácilmente
            </p>
          </div>

          <div class="mt-6">
            <div class="flex items-center h-5">
              <input
                id="isNewArrival"
                v-model="product.isNewArrival"
                type="checkbox"
                class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <label for="isNewArrival" class="ml-2 text-sm text-gray-700">
                Marcar como novedad
              </label>
            </div>
          </div>
        </div>

        <!-- Columna central y derecha: Detalles del producto -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Nombre -->
          <div>
            <label
              for="name"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Nombre del producto*</label
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

          <!-- Descripción -->
          <div>
            <label
              for="description"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Descripción corta*</label
            >
            <textarea
              id="description"
              v-model="product.description"
              rows="2"
              class="w-full border-gray-300 rounded-md shadow-sm"
              :class="{
                'border-red-300 focus:ring-red-500': errors.description,
              }"
            ></textarea>
            <p v-if="errors.description" class="mt-1 text-sm text-red-600">
              {{ errors.description }}
            </p>
          </div>

          <!-- Precio y Precio original -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                for="price"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Precio*</label
              >
              <div class="relative rounded-md shadow-sm">
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <span class="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  id="price"
                  v-model="product.price"
                  type="number"
                  min="0"
                  step="0.01"
                  class="pl-7 w-full border-gray-300 rounded-md shadow-sm"
                  :class="{ 'border-red-300 focus:ring-red-500': errors.price }"
                />
              </div>
              <p v-if="errors.price" class="mt-1 text-sm text-red-600">
                {{ errors.price }}
              </p>
            </div>
            <div>
              <label
                for="originalPrice"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Precio original (antes del descuento)</label
              >
              <div class="relative rounded-md shadow-sm">
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <span class="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  id="originalPrice"
                  v-model="product.originalPrice"
                  type="number"
                  min="0"
                  class="pl-7 w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <p class="mt-1 text-xs text-gray-500">
                Déjalo vacío si no hay descuento
              </p>
            </div>
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
              rows="4"
              class="w-full border-gray-300 rounded-md shadow-sm"
            ></textarea>
          </div>

          <!-- Características -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Características</label
            >
            <div
              v-if="product.features && product.features.length > 0"
              class="space-y-2"
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
                  placeholder="Característica del producto"
                />
                <button
                  @click="removeFeature(index)"
                  class="ml-2 p-1 text-gray-500 hover:text-red-500"
                >
                  <TrashIcon class="h-5 w-5" />
                </button>
              </div>
              <button
                @click="addFeature"
                class="mt-2 text-indigo-600 hover:text-indigo-900 text-sm"
              >
                + Añadir otra característica
              </button>
            </div>
            <button
              v-else
              @click="addFeature"
              class="mt-2 text-indigo-600 hover:text-indigo-900 text-sm"
            >
              + Añadir característica
            </button>
          </div>
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

// Definir middleware y layout para proteger esta ruta
definePageMeta({
  middleware: ["admin"],
  layout: "admin",
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
  categoryId: "",
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
      // Asegurar que todas las propiedades del producto se formatean correctamente
      product.value = {
        ...response.data,
        price: response.data.price.toString(),
        originalPrice: response.data.originalPrice
          ? response.data.originalPrice.toString()
          : "",
        // Asegurar que categoryId sea un número (si existe) para el select
        categoryId:
          response.data.categoryId !== null &&
          response.data.categoryId !== undefined
            ? Number(response.data.categoryId)
            : "",
        // Inicializar features como array vacío si no existe
        features: response.data.features || [],
        // Asegurar que isNewArrival sea booleano
        isNewArrival: Boolean(response.data.isNewArrival),
      };

      console.log("Producto cargado:", product.value); // Para depuración
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
      console.log("Categorías cargadas:", categories.value); // Para depuración
    } else {
      console.error("Error en respuesta de categorías:", response);
      showToast("Error al cargar las categorías", "warning");
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

const removeImage = () => {
  product.value.imageUrl = "";
  if (fileInput.value) {
    fileInput.value.value = "";
  }
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

  if (!product.value.imageUrl) {
    newErrors.imageUrl = "La imagen principal es obligatoria";
  }

  // Agregar validación para la categoría
  if (!product.value.categoryId) {
    newErrors.categoryId = "Selecciona una categoría";
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
    // Normalizar categoryId correctamente
    let categoryIdValue;

    if (
      product.value.categoryId === "" ||
      product.value.categoryId === undefined ||
      product.value.categoryId === null
    ) {
      categoryIdValue = null;
    } else {
      // Intentar convertir a número
      const numId = Number(product.value.categoryId);

      // Verificar que sea un número válido
      if (isNaN(numId)) {
        showToast("El ID de categoría debe ser un número válido", "error");
        saving.value = false;
        return;
      }

      categoryIdValue = numId;
    }

    console.log(
      "categoryId antes de guardar:",
      categoryIdValue,
      typeof categoryIdValue
    );

    // Crear objeto de producto alineado con el schema actual
    const productData = {
      name: product.value.name,
      description: product.value.description,
      price: Number(product.value.price),
      stock: Number(product.value.stock),
      imageUrl: product.value.imageUrl,
      categoryId: categoryIdValue,
      // Ya NO incluimos: features, isNewArrival, fullDescription
    };

    console.log(
      "Objeto completo a enviar:",
      JSON.stringify(productData, null, 2)
    );

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
        isEdit.value ? "Producto actualizado" : "Producto creado",
        "success"
      );
      router.push("/admin/products");
    } else {
      showToast(response.message || "Error al guardar el producto", "error");
    }
  } catch (error) {
    console.error("Error al guardar producto:", error);
    showToast(
      "Error: " +
        (error instanceof Error ? error.message : "Error desconocido"),
      "error"
    );
  } finally {
    saving.value = false;
  }
};

// Inicialización
onMounted(async () => {
  await Promise.all([loadCategories(), loadProduct()]);
});
</script>
