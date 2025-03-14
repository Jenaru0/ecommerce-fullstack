<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold">Gestión de Categorías</h1>
      <button
        @click="openAddModal()"
        class="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 inline-flex items-center"
      >
        <PlusIcon class="h-5 w-5 mr-2" />
        Nueva Categoría
      </button>
    </div>

    <!-- Estado de carga -->
    <div v-if="loading" class="py-12 text-center">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto"
      ></div>
      <p class="mt-4 text-gray-600">Cargando categorías...</p>
    </div>

    <!-- Estado de error -->
    <div v-else-if="error" class="py-12 text-center">
      <AlertCircleIcon class="h-12 w-12 text-red-500 mx-auto mb-4" />
      <p class="text-red-500">{{ error }}</p>
      <button
        @click="loadCategories"
        class="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        Intentar de nuevo
      </button>
    </div>

    <!-- Lista de categorías -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="category in categories"
        :key="category.id"
        class="bg-white shadow rounded-lg p-6"
      >
        <div class="flex justify-between items-start">
          <div>
            <h2 class="text-lg font-semibold">{{ category.name }}</h2>
            <p class="text-sm text-gray-500 mt-1">
              {{ category.productCount }} productos
            </p>
          </div>
          <div class="flex space-x-2">
            <button
              @click="editCategory(category)"
              class="text-indigo-600 hover:text-indigo-900"
            >
              <EditIcon class="h-5 w-5" />
            </button>
            <button
              @click="confirmDeleteCategory(category)"
              class="text-red-600 hover:text-red-900"
            >
              <TrashIcon class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para añadir/editar categoría -->
    <teleport to="body">
      <div
        v-if="showCategoryModal"
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      >
        <div class="bg-white rounded-lg max-w-md w-full p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ isEditing ? "Editar Categoría" : "Nueva Categoría" }}
          </h3>
          <div class="space-y-4">
            <div>
              <label
                for="category-name"
                class="block text-sm font-medium text-gray-700"
              >
                Nombre
              </label>
              <input
                id="category-name"
                v-model="categoryForm.name"
                type="text"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              <p v-if="formError" class="mt-1 text-sm text-red-600">
                {{ formError }}
              </p>
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button
              @click="showCategoryModal = false"
              class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded"
            >
              Cancelar
            </button>
            <button
              @click="saveCategory"
              class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? "Guardando..." : "Guardar" }}
            </button>
          </div>
        </div>
      </div>
    </teleport>

    <!-- Modal de confirmación para eliminar -->
    <teleport to="body">
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      >
        <div class="bg-white rounded-lg max-w-md w-full p-6">
          <div class="text-center">
            <AlertTriangleIcon class="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              ¿Eliminar categoría?
            </h3>
            <p class="text-sm text-gray-500 mb-6">
              ¿Estás seguro de que quieres eliminar
              <span class="font-medium">{{ categoryToDelete?.name }}</span
              >? Esta acción no se puede deshacer.
            </p>
            <div class="flex justify-end space-x-3">
              <button
                @click="showDeleteModal = false"
                class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded"
              >
                Cancelar
              </button>
              <button
                @click="deleteCategory"
                class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                :disabled="isDeleting"
              >
                {{ isDeleting ? "Eliminando..." : "Eliminar" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useApi } from "~/composables/useApi";
import { useAuth } from "~/composables/useAuth";
import {
  AlertCircle as AlertCircleIcon,
  AlertTriangle as AlertTriangleIcon,
  Edit as EditIcon,
  Plus as PlusIcon,
  Trash as TrashIcon,
} from "lucide-vue-next";
import { useToast } from "~/composables/useToast";

// Definir middleware para proteger esta ruta
definePageMeta({
  middleware: ["admin"],
  layout: "admin",
});

// Composables
const router = useRouter();
const api = useApi();
const { showToast } = useToast();
const { isAdmin, checkAuthStatus } = useAuth();

// Estado
const loading = ref(true);
const error = ref<string | null>(null);
const categories = ref<any[]>([]);
const showCategoryModal = ref(false);
const showDeleteModal = ref(false);
const isEditing = ref(false);
const isSubmitting = ref(false);
const isDeleting = ref(false);
const formError = ref("");
const categoryForm = ref({ id: "", name: "" });
const categoryToDelete = ref<any | null>(null);

// Cargar categorías
const loadCategories = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await api.get("/admin/categories");
    if (response.success) {
      categories.value = response.data;
    } else {
      error.value = response.message || "Error al cargar las categorías";
    }
  } catch (err) {
    console.error("Error cargando categorías:", err);
    error.value = "Error al conectar con el servidor";
  } finally {
    loading.value = false;
  }
};

// Abrir modal para añadir
const openAddModal = () => {
  isEditing.value = false;
  categoryForm.value = { id: "", name: "" };
  formError.value = "";
  showCategoryModal.value = true;
};

// Abrir modal para editar
const editCategory = (category: any) => {
  isEditing.value = true;
  categoryForm.value = { id: category.id, name: category.name };
  formError.value = "";
  showCategoryModal.value = true;
};

// Confirmar eliminación
const confirmDeleteCategory = (category: any) => {
  categoryToDelete.value = category;
  showDeleteModal.value = true;
};

// Guardar categoría (crear o actualizar)
const saveCategory = async () => {
  if (!categoryForm.value.name.trim()) {
    formError.value = "El nombre de la categoría es obligatorio";
    return;
  }

  isSubmitting.value = true;
  formError.value = "";

  try {
    let response;
    if (isEditing.value) {
      response = await api.put(`/admin/categories/${categoryForm.value.id}`, {
        name: categoryForm.value.name,
      });
    } else {
      response = await api.post("/admin/categories", {
        name: categoryForm.value.name,
      });
    }

    if (response.success) {
      showToast(
        isEditing.value
          ? "Categoría actualizada correctamente"
          : "Categoría creada correctamente",
        "success"
      );
      showCategoryModal.value = false;
      loadCategories();
    } else {
      formError.value = response.message || "Error al guardar la categoría";
    }
  } catch (err) {
    console.error("Error guardando categoría:", err);
    formError.value = "Error al conectar con el servidor";
  } finally {
    isSubmitting.value = false;
  }
};

// Eliminar categoría
const deleteCategory = async () => {
  if (!categoryToDelete.value) return;

  isDeleting.value = true;

  try {
    const response = await api.delete(
      `/admin/categories/${categoryToDelete.value.id}`
    );

    if (response.success) {
      showToast("Categoría eliminada correctamente", "success");
      showDeleteModal.value = false;
      loadCategories();
    } else {
      showToast(response.message || "Error al eliminar la categoría", "error");
    }
  } catch (err) {
    console.error("Error eliminando categoría:", err);
    showToast("Error al conectar con el servidor", "error");
  } finally {
    isDeleting.value = false;
    showDeleteModal.value = false;
  }
};

// Verificar permiso de administrador antes de cargar los datos
onMounted(async () => {
  const isLoggedInAsAdmin = await checkAuthStatus();
  if (isLoggedInAsAdmin && isAdmin.value) {
    loadCategories();
  } else {
    router.push("/auth/login?redirect=/admin");
  }
});
</script>
