<template>
  <div>
    <!-- Agregar este botón en la parte superior junto al título -->
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold">Gestión de Usuarios</h1>
      <button
        @click="showCreateModal = true"
        class="bg-black text-white px-4 py-2 rounded flex items-center hover:bg-gray-800"
      >
        <PlusIcon class="h-5 w-5 mr-1" />
        Nuevo Usuario
      </button>
    </div>

    <!-- Filtros de búsqueda -->
    <div class="bg-white shadow rounded-lg p-4 mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <label
            for="search"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Buscar
          </label>
          <div class="relative">
            <SearchIcon
              class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
            />
            <input
              id="search"
              v-model="searchQuery"
              type="text"
              placeholder="Buscar por nombre o email..."
              class="pl-10 w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              @input="debouncedSearch"
            />
          </div>
        </div>

        <div class="md:w-48">
          <label for="role" class="block text-sm font-medium text-gray-700 mb-1"
            >Filtrar por rol</label
          >
          <select
            id="role"
            v-model="roleFilter"
            class="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            @change="loadUsers"
          >
            <option value="">Todos los roles</option>
            <option value="admin">Administrador</option>
            <option value="user">Usuario</option>
          </select>
        </div>

        <div class="md:w-48">
          <label for="sort" class="block text-sm font-medium text-gray-700 mb-1"
            >Ordenar por</label
          >
          <select
            id="sort"
            v-model="sortBy"
            class="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            @change="loadUsers"
          >
            <option value="newest">Más recientes</option>
            <option value="oldest">Más antiguos</option>
            <option value="name_asc">Nombre (A-Z)</option>
            <option value="name_desc">Nombre (Z-A)</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Estado de carga -->
    <div v-if="loading" class="py-12 text-center">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto"
      ></div>
      <p class="mt-4 text-gray-600">Cargando usuarios...</p>
    </div>

    <!-- Estado de error -->
    <div v-else-if="error" class="py-12 text-center">
      <AlertCircleIcon class="h-12 w-12 text-red-500 mx-auto mb-4" />
      <p class="text-red-500">{{ error }}</p>
      <button
        @click="loadUsers"
        class="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        Intentar de nuevo
      </button>
    </div>

    <!-- Tabla de usuarios -->
    <div v-else class="bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Usuario
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Email
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Rol
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Fecha registro
            </th>
            <th
              class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Acciones
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in users" :key="user.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div
                  class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center"
                >
                  <UserIcon v-if="!user.avatar" class="h-5 w-5 text-gray-500" />
                  <img
                    v-else
                    :src="user.avatar"
                    alt=""
                    class="h-10 w-10 rounded-full"
                  />
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">
                    {{ user.name }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ user.email }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="
                  user.role === 'admin'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-green-100 text-green-800'
                "
                class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
              >
                {{ user.role === "admin" ? "Administrador" : "Usuario" }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(user.createdAt) }}
            </td>
            <td
              class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
            >
              <button
                @click="editUser(user)"
                class="text-indigo-600 hover:text-indigo-900"
              >
                <EditIcon class="h-5 w-5" />
                <span class="sr-only">Editar</span>
              </button>
            </td>
          </tr>
          <tr v-if="users.length === 0">
            <td colspan="5" class="px-6 py-12 text-center text-gray-500">
              No se encontraron usuarios que coincidan con los criterios de
              búsqueda
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginación -->
    <div
      v-if="!loading && !error && totalPages > 0"
      class="flex justify-between items-center mt-8"
    >
      <button
        @click="previousPage"
        class="flex items-center text-gray-600"
        :disabled="currentPage === 1"
        :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
      >
        <ArrowLeftIcon class="h-4 w-4 mr-1" />
        Anterior
      </button>
      <div class="flex items-center space-x-2">
        <button
          v-for="page in paginationButtons"
          :key="page"
          @click="goToPage(page)"
          :class="[
            'w-8 h-8 rounded-full flex items-center justify-center text-sm',
            page === currentPage
              ? 'bg-black text-white'
              : 'text-gray-600 hover:bg-gray-100',
          ]"
        >
          {{ page }}
        </button>
      </div>
      <button
        @click="nextPage"
        class="flex items-center text-gray-600"
        :disabled="currentPage >= totalPages"
        :class="{ 'opacity-50 cursor-not-allowed': currentPage >= totalPages }"
      >
        Siguiente
        <ArrowRightIcon class="h-4 w-4 ml-1" />
      </button>
    </div>

    <!-- Modal para editar usuario -->
    <teleport to="body">
      <div
        v-if="showEditModal"
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      >
        <div class="bg-white rounded-lg max-w-md w-full p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Editar Usuario</h3>
          <div class="space-y-4">
            <div>
              <label
                for="edit-name"
                class="block text-sm font-medium text-gray-700"
              >
                Nombre
              </label>
              <input
                id="edit-name"
                v-model="editingUser.name"
                type="text"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label
                for="edit-email"
                class="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="edit-email"
                v-model="editingUser.email"
                type="email"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                disabled
              />
            </div>
            <div>
              <label
                for="edit-role"
                class="block text-sm font-medium text-gray-700"
              >
                Rol
              </label>
              <select
                id="edit-role"
                v-model="editingUser.role"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="cliente">Cliente</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button
              @click="showEditModal = false"
              class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded"
            >
              Cancelar
            </button>
            <button
              @click="updateUser"
              class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
              :disabled="isUpdating"
            >
              {{ isUpdating ? "Guardando..." : "Guardar cambios" }}
            </button>
          </div>
        </div>
      </div>
    </teleport>

    <!-- Modal para crear usuario -->
    <teleport to="body">
      <div
        v-if="showCreateModal"
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      >
        <div class="bg-white rounded-lg max-w-md w-full p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Crear Nuevo Usuario
          </h3>
          <div class="space-y-4">
            <div>
              <label
                for="new-name"
                class="block text-sm font-medium text-gray-700"
              >
                Nombre
              </label>
              <input
                id="new-name"
                v-model="newUser.name"
                type="text"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label
                for="new-email"
                class="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="new-email"
                v-model="newUser.email"
                type="email"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label
                for="new-password"
                class="block text-sm font-medium text-gray-700"
              >
                Contraseña
              </label>
              <input
                id="new-password"
                v-model="newUser.password"
                type="password"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label
                for="new-role"
                class="block text-sm font-medium text-gray-700"
              >
                Rol
              </label>
              <select
                id="new-role"
                v-model="newUser.role"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="cliente">Cliente</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button
              @click="showCreateModal = false"
              class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded"
            >
              Cancelar
            </button>
            <button
              @click="createUser"
              class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
              :disabled="isCreating"
            >
              {{ isCreating ? "Creando..." : "Crear Usuario" }}
            </button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useApi } from "~/composables/useApi";
import { useToast } from "~/composables/useToast";
import { useDebounce } from "~/composables/useDebounce";
import {
  Search as SearchIcon,
  Edit as EditIcon,
  AlertCircle as AlertCircleIcon,
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,
  User as UserIcon,
  Plus as PlusIcon,
} from "lucide-vue-next";

const { debounce } = useDebounce();

// Definir layout y middleware para esta ruta
definePageMeta({
  middleware: ["admin"],
  layout: "admin",
});

// Composables
const api = useApi();
const { showToast } = useToast();

// Estado
const loading = ref(true);
const error = ref<string | null>(null);
const users = ref<any[]>([]);
const showEditModal = ref(false);
const editingUser = ref<any>({});
const isUpdating = ref(false);
const showCreateModal = ref(false);
const newUser = ref({
  name: "",
  email: "",
  password: "",
  role: "cliente", // Asegúrate de que coincida con los valores esperados en el backend
});
const isCreating = ref(false);

// Filtros y paginación
const searchQuery = ref("");
const roleFilter = ref("");
const sortBy = ref("newest");
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalUsers = ref(0);

// Propiedades calculadas
const totalPages = computed(() => {
  return Math.ceil(totalUsers.value / itemsPerPage.value);
});

const paginationButtons = computed(() => {
  // Mostrar máximo 5 páginas en la paginación
  const maxPagesToShow = 5;
  const pages = [];

  if (totalPages.value <= maxPagesToShow) {
    // Si hay pocas páginas, mostrarlas todas
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i);
    }
  } else {
    // Si hay muchas páginas, mostrar algunas alrededor de la página actual
    let startPage = Math.max(
      1,
      currentPage.value - Math.floor(maxPagesToShow / 2)
    );
    let endPage = Math.min(totalPages.value, startPage + maxPagesToShow - 1);

    // Ajustar si llegamos a los límites
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
  }

  return pages;
});

// Métodos
const debouncedSearch = debounce(() => {
  currentPage.value = 1;
  loadUsers();
}, 300);

const loadUsers = async () => {
  loading.value = true;
  error.value = null;

  try {
    // Construir parámetros de consulta
    const queryParams = new URLSearchParams();
    queryParams.append("page", currentPage.value.toString());
    queryParams.append("limit", itemsPerPage.value.toString());
    queryParams.append("sort", sortBy.value);

    if (searchQuery.value) {
      queryParams.append("search", searchQuery.value);
    }

    if (roleFilter.value) {
      queryParams.append("role", roleFilter.value);
    }

    // Realizar la petición
    const response = await api.get(`/admin/users?${queryParams.toString()}`);

    if (response.success) {
      users.value = response.data.users;
      totalUsers.value = response.data.total;
    } else {
      error.value = response.message || "Error al cargar los usuarios";
    }
  } catch (err) {
    console.error("Error cargando usuarios:", err);
    error.value = "Error al conectar con el servidor";
  } finally {
    loading.value = false;
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    loadUsers();
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    loadUsers();
  }
};

const goToPage = (page: number) => {
  currentPage.value = page;
  loadUsers();
};

const editUser = (user: any) => {
  editingUser.value = { ...user };
  showEditModal.value = true;
};

const updateUser = async () => {
  isUpdating.value = true;

  try {
    const response = await api.put(`/admin/users/${editingUser.value.id}`, {
      name: editingUser.value.name,
      email: editingUser.value.email,
      role: editingUser.value.role,
    });

    if (response.success) {
      showToast("Usuario actualizado correctamente", "success");

      // Actualizar el usuario en la lista
      const index = users.value.findIndex((u) => u.id === editingUser.value.id);
      if (index !== -1) {
        users.value[index] = { ...users.value[index], ...editingUser.value };
      }

      showEditModal.value = false;
    } else {
      showToast(response.message || "Error al actualizar usuario", "error");
    }
  } catch (err) {
    console.error("Error actualizando usuario:", err);
    showToast("Error al conectar con el servidor", "error");
  } finally {
    isUpdating.value = false;
  }
};

const createUser = async () => {
  // Validación básica
  if (!newUser.value.email || !newUser.value.password) {
    showToast("Email y contraseña son obligatorios", "error");
    return;
  }

  isCreating.value = true;

  try {
    const response = await api.post("/admin/users", {
      name: newUser.value.name,
      email: newUser.value.email,
      password: newUser.value.password,
      role: newUser.value.role,
    });

    if (response.success) {
      showToast("Usuario creado correctamente", "success");
      showCreateModal.value = false;

      // Reiniciar formulario
      newUser.value = {
        name: "",
        email: "",
        password: "",
        role: "cliente",
      };

      // Recargar lista de usuarios
      loadUsers();
    } else {
      showToast(response.message || "Error al crear usuario", "error");
    }
  } catch (err) {
    console.error("Error creando usuario:", err);
    showToast("Error de conexión", "error");
  } finally {
    isCreating.value = false;
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

// Cargar datos al montar el componente
onMounted(() => {
  loadUsers();
});

// Observar cambios en los filtros para actualizar la paginación
watch([roleFilter, sortBy], () => {
  currentPage.value = 1;
  loadUsers();
});
</script>
