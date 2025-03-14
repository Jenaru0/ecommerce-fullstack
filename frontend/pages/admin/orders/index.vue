<template>
  <div class="container mx-auto px-6 md:px-16 lg:px-24 py-12">
    <h1 class="text-2xl font-bold mb-8">Gestión de Pedidos</h1>

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
              placeholder="Buscar por ID o cliente..."
              class="pl-10 w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              @input="debouncedSearch"
            />
          </div>
        </div>
        <div class="md:w-48">
          <label
            for="status"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Estado
          </label>
          <select
            id="status"
            v-model="statusFilter"
            class="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            @change="loadOrders"
          >
            <option value="">Todos</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Enviado">Enviado</option>
            <option value="Entregado">Entregado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>
        <div class="md:w-48">
          <label
            for="date"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Fecha
          </label>
          <select
            id="date"
            v-model="dateFilter"
            class="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            @change="loadOrders"
          >
            <option value="">Todas</option>
            <option value="today">Hoy</option>
            <option value="week">Esta semana</option>
            <option value="month">Este mes</option>
            <option value="year">Este año</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Estado de carga -->
    <div v-if="loading" class="py-12 text-center">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto"
      ></div>
      <p class="mt-4 text-gray-600">Cargando pedidos...</p>
    </div>

    <!-- Estado de error -->
    <div v-else-if="error" class="py-12 text-center">
      <AlertCircleIcon class="h-12 w-12 text-red-500 mx-auto mb-4" />
      <p class="text-red-500">{{ error }}</p>
      <button
        @click="loadOrders"
        class="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        Intentar de nuevo
      </button>
    </div>

    <!-- Tabla de pedidos -->
    <div v-else class="bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              ID
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Cliente
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Fecha
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Total
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Estado
            </th>
            <th
              class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Acciones
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="order in orders" :key="order.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">
                #{{ order.id }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">
                {{ order.user.name }}
              </div>
              <div class="text-sm text-gray-500">{{ order.user.email }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">
                {{ formatDate(order.createdAt) }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              ${{ formatPrice(order.total) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="[
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                  order.status === 'Entregado'
                    ? 'bg-green-100 text-green-800'
                    : order.status === 'Enviado'
                    ? 'bg-blue-100 text-blue-800'
                    : order.status === 'Pendiente'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800',
                ]"
              >
                {{ order.status }}
              </span>
            </td>
            <td
              class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
            >
              <div class="flex justify-end space-x-2">
                <NuxtLink
                  :to="`/admin/orders/${order.id}`"
                  class="text-indigo-600 hover:text-indigo-900"
                >
                  <EyeIcon class="h-5 w-5" />
                  <span class="sr-only">Ver</span>
                </NuxtLink>
                <button
                  v-if="
                    order.status !== 'Entregado' && order.status !== 'Cancelado'
                  "
                  @click="openUpdateStatusModal(order)"
                  class="text-yellow-600 hover:text-yellow-900"
                >
                  <EditIcon class="h-5 w-5" />
                  <span class="sr-only">Cambiar Estado</span>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="orders.length === 0">
            <td colspan="6" class="px-6 py-12 text-center text-gray-500">
              No se encontraron pedidos que coincidan con los criterios de
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
          v-for="page in paginationRange"
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

    <!-- Modal de actualización de estado -->
    <teleport to="body">
      <div
        v-if="showStatusModal"
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      >
        <div class="bg-white rounded-lg max-w-md w-full p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Actualizar Estado del Pedido
          </h3>
          <div class="mb-4">
            <label
              for="status-select"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Nuevo estado
            </label>
            <select
              id="status-select"
              v-model="newStatus"
              class="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="Pendiente">Pendiente</option>
              <option value="Enviado">Enviado</option>
              <option value="Entregado">Entregado</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
          <div class="flex justify-end space-x-3">
            <button
              @click="showStatusModal = false"
              class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded"
            >
              Cancelar
            </button>
            <button
              @click="updateOrderStatus"
              class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
              :disabled="isUpdating"
            >
              {{ isUpdating ? "Actualizando..." : "Actualizar" }}
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
  Eye as EyeIcon,
  AlertCircle as AlertCircleIcon,
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,
} from "lucide-vue-next";

const { debounce } = useDebounce();

// Definir middleware y layout para proteger esta ruta
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
const orders = ref<any[]>([]);
const showStatusModal = ref(false);
const selectedOrder = ref<any | null>(null);
const isUpdating = ref(false);
const newStatus = ref("");

// Filtros y paginación
const searchQuery = ref("");
const statusFilter = ref("");
const dateFilter = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalOrders = ref(0);

// Propiedades calculadas
const totalPages = computed(() => {
  return Math.ceil(totalOrders.value / itemsPerPage.value);
});

const paginationRange = computed(() => {
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
  loadOrders();
}, 300);

const loadOrders = async () => {
  loading.value = true;
  error.value = null;

  try {
    // Construir parámetros de consulta
    const queryParams = new URLSearchParams();
    queryParams.append("page", currentPage.value.toString());
    queryParams.append("limit", itemsPerPage.value.toString());

    if (searchQuery.value) {
      queryParams.append("search", searchQuery.value);
    }

    if (statusFilter.value) {
      queryParams.append("status", statusFilter.value);
    }

    if (dateFilter.value) {
      queryParams.append("dateFilter", dateFilter.value);
    }

    const response = await api.get(`/admin/orders?${queryParams.toString()}`);

    if (response.success) {
      orders.value = response.data.orders;
      totalOrders.value = response.data.total;
    } else {
      error.value = response.message || "Error al cargar los pedidos";
    }
  } catch (err) {
    console.error("Error cargando pedidos:", err);
    error.value = "Error al conectar con el servidor";
  } finally {
    loading.value = false;
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    loadOrders();
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    loadOrders();
  }
};

const goToPage = (page: number) => {
  currentPage.value = page;
  loadOrders();
};

const openUpdateStatusModal = (order: any) => {
  selectedOrder.value = order;
  newStatus.value = order.status;
  showStatusModal.value = true;
};

const updateOrderStatus = async () => {
  if (!selectedOrder.value) return;

  isUpdating.value = true;

  try {
    const response = await api.put(
      `/admin/orders/${selectedOrder.value.id}/status`,
      { status: newStatus.value }
    );

    if (response.success) {
      showToast("Estado del pedido actualizado correctamente", "success");

      // Actualizar el estado del pedido en la lista sin necesidad de recargar
      const index = orders.value.findIndex(
        (o) => o.id === selectedOrder.value?.id
      );
      if (index !== -1) {
        orders.value[index].status = newStatus.value;
      }

      showStatusModal.value = false;
    } else {
      showToast(
        response.message || "Error al actualizar el estado del pedido",
        "error"
      );
    }
  } catch (err) {
    console.error("Error actualizando estado del pedido:", err);
    showToast("Error al conectar con el servidor", "error");
  } finally {
    isUpdating.value = false;
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const formatPrice = (price: number): string => {
  return Number(price).toFixed(2);
};

// Cargar datos al montar el componente
onMounted(() => {
  loadOrders();
});

// Observar cambios en los filtros para actualizar la paginación
watch([statusFilter, dateFilter], () => {
  currentPage.value = 1;
  loadOrders();
});
</script>
