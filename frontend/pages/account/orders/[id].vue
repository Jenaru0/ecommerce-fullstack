<template>
  <div class="container mx-auto px-6 md:px-16 lg:px-24 py-12">
    <div class="flex items-center gap-4 mb-6">
      <NuxtLink
        to="/account/orders"
        class="flex items-center text-indigo-600 hover:text-indigo-800"
      >
        <ChevronLeftIcon class="h-5 w-5" />
        <span>Volver a mis pedidos</span>
      </NuxtLink>
    </div>

    <div v-if="loading" class="flex justify-center py-8">
      <div
        class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-black"
      ></div>
    </div>

    <div
      v-else-if="error"
      class="bg-red-100 border-l-4 border-red-500 p-4 mb-6"
    >
      <div class="flex">
        <div class="flex-shrink-0">
          <AlertCircleIcon class="h-5 w-5 text-red-500" />
        </div>
        <div class="ml-3">
          <p class="text-red-700">{{ error }}</p>
        </div>
      </div>
    </div>

    <div v-else-if="order" class="space-y-6">
      <!-- Encabezado del pedido -->
      <div class="bg-white shadow rounded-lg p-6">
        <div
          class="flex flex-wrap justify-between items-center mb-4 border-b pb-4"
        >
          <div>
            <h1 class="text-2xl font-bold">Pedido #{{ order.id }}</h1>
            <p class="text-gray-600">
              Realizado el {{ formatDate(order.createdAt) }}
            </p>
          </div>
          <span
            class="px-3 py-1 rounded-full text-sm font-medium"
            :class="{
              'bg-green-100 text-green-800': order.status === 'Entregado',
              'bg-blue-100 text-blue-800': order.status === 'Enviado',
              'bg-yellow-100 text-yellow-800': order.status === 'Pendiente',
              'bg-red-100 text-red-800': order.status === 'Cancelado',
            }"
          >
            {{ order.status }}
          </span>
        </div>

        <!-- Seguimiento del pedido -->
        <div class="mb-6">
          <h2 class="text-lg font-semibold mb-4">Seguimiento</h2>
          <div class="flex items-center">
            <div class="relative flex items-center justify-center">
              <div
                class="h-12 w-12 rounded-full flex items-center justify-center"
                :class="{
                  'bg-green-100 text-green-600': statusIndex >= 0,
                  'bg-gray-100 text-gray-400': statusIndex < 0,
                }"
              >
                <CheckIcon v-if="statusIndex >= 0" class="h-6 w-6" />
                <ClockIcon v-else class="h-6 w-6" />
              </div>
              <div class="absolute -bottom-8 w-32 text-center text-sm">
                Procesando
              </div>
            </div>
            <div
              class="flex-1 h-1 mx-2"
              :class="statusIndex >= 1 ? 'bg-green-500' : 'bg-gray-200'"
            ></div>
            <div class="relative flex items-center justify-center">
              <div
                class="h-12 w-12 rounded-full flex items-center justify-center"
                :class="{
                  'bg-green-100 text-green-600': statusIndex >= 1,
                  'bg-gray-100 text-gray-400': statusIndex < 1,
                }"
              >
                <TruckIcon v-if="statusIndex >= 1" class="h-6 w-6" />
                <ClockIcon v-else class="h-6 w-6" />
              </div>
              <div class="absolute -bottom-8 w-32 text-center text-sm">
                Enviado
              </div>
            </div>
            <div
              class="flex-1 h-1 mx-2"
              :class="statusIndex >= 2 ? 'bg-green-500' : 'bg-gray-200'"
            ></div>
            <div class="relative flex items-center justify-center">
              <div
                class="h-12 w-12 rounded-full flex items-center justify-center"
                :class="{
                  'bg-green-100 text-green-600': statusIndex >= 2,
                  'bg-gray-100 text-gray-400': statusIndex < 2,
                }"
              >
                <PackageIcon v-if="statusIndex >= 2" class="h-6 w-6" />
                <ClockIcon v-else class="h-6 w-6" />
              </div>
              <div class="absolute -bottom-8 w-32 text-center text-sm">
                Entregado
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Productos del pedido -->
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <div class="p-6 border-b">
          <h2 class="text-lg font-semibold mb-4">Productos</h2>
          <div class="divide-y">
            <div
              v-for="item in order.items"
              :key="item.id"
              class="py-4 flex items-center"
            >
              <img
                :src="
                  item.product?.imageUrl ||
                  '/assets/images/placeholder-product.jpg'
                "
                :alt="item.product?.name || 'Producto'"
                class="w-20 h-20 object-cover rounded mr-6"
              />
              <div class="flex-1">
                <h3 class="font-medium">
                  {{ item.product?.name || "Producto" }}
                </h3>
                <p class="text-sm text-gray-600">
                  Cantidad: {{ item.quantity }}
                </p>
                <p class="text-sm text-gray-600">
                  Precio unitario: ${{ formatPrice(item.price) }}
                </p>
              </div>
              <div class="text-right">
                <p class="font-bold">
                  ${{ formatPrice(item.price * item.quantity) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Resumen de precios -->
        <div class="p-6 bg-gray-50">
          <div class="flex justify-between mb-2">
            <span class="text-gray-600">Subtotal</span>
            <span>${{ formatPrice(orderSubtotal) }}</span>
          </div>
          <div class="flex justify-between mb-2">
            <span class="text-gray-600">Envío</span>
            <span>${{ formatPrice(shippingCost) }}</span>
          </div>
          <div class="flex justify-between font-bold text-lg pt-2 border-t">
            <span>Total</span>
            <span>${{ formatPrice(orderSubtotal + shippingCost) }}</span>
          </div>
        </div>
      </div>

      <!-- Información de envío -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-semibold mb-4">Dirección de envío</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-gray-600">Nombre:</p>
            <p>
              {{ order.shippingDetails?.firstName }}
              {{ order.shippingDetails?.lastName }}
            </p>
          </div>
          <div>
            <p class="text-gray-600">Teléfono:</p>
            <p>{{ order.shippingDetails?.phone || "No especificado" }}</p>
          </div>
          <div class="md:col-span-2">
            <p class="text-gray-600">Dirección:</p>
            <p>{{ order.shippingDetails?.address }}</p>
            <p>
              {{ order.shippingDetails?.city }},
              {{ order.shippingDetails?.state }}
              {{ order.shippingDetails?.zipCode }}
            </p>
          </div>
        </div>
      </div>

      <!-- Acciones -->
      <div v-if="order.status === 'Pendiente'" class="flex justify-end">
        <button
          @click="cancelOrder"
          class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          :disabled="cancelling"
        >
          {{ cancelling ? "Cancelando..." : "Cancelar pedido" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useApi } from "~/composables/useApi";
import {
  ChevronLeft as ChevronLeftIcon,
  AlertCircle as AlertCircleIcon,
  Check as CheckIcon,
  Clock as ClockIcon,
  Truck as TruckIcon,
  Package as PackageIcon,
} from "lucide-vue-next";

// Definir middleware para proteger esta ruta
definePageMeta({
  middleware: ["auth"],
});

const route = useRoute();
const router = useRouter();
const api = useApi();

const order = ref(null);
const loading = ref(true);
const error = ref(null);
const cancelling = ref(false);

// Valores estáticos para ejemplo - normalmente vendrían del backend
const shippingCost = 5.0;

// Calcular subtotal de los productos
const orderSubtotal = computed(() => {
  if (!order.value?.items) return 0;
  return order.value.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
});

// Determinar el índice del estado para el seguimiento visual
const statusIndex = computed(() => {
  if (!order.value) return -1;
  switch (order.value.status) {
    case "Pendiente":
      return 0;
    case "Enviado":
      return 1;
    case "Entregado":
      return 2;
    case "Cancelado":
      return -1;
    default:
      return 0;
  }
});

onMounted(async () => {
  await loadOrder();
});

const loadOrder = async () => {
  loading.value = true;
  error.value = null;

  try {
    const orderId = route.params.id;
    const response = await api.get(`/orders/${orderId}`);

    if (response.success) {
      order.value = response.data;
    } else {
      error.value =
        response.message || "No se pudo cargar la información del pedido";
    }
  } catch (err) {
    console.error("Error al cargar el pedido:", err);
    error.value = "Error al cargar la información del pedido";
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatPrice = (price) => {
  return Number(price).toFixed(2);
};

const cancelOrder = async () => {
  if (!confirm("¿Estás seguro de que deseas cancelar este pedido?")) return;

  cancelling.value = true;
  try {
    const response = await api.put(`/orders/${order.value.id}/cancel`);
    if (response.success) {
      order.value.status = "Cancelado";
      // Opcional: mostrar un mensaje de éxito
    } else {
      error.value = response.message || "No se pudo cancelar el pedido";
    }
  } catch (err) {
    console.error("Error al cancelar el pedido:", err);
    error.value = "Error al cancelar el pedido";
  } finally {
    cancelling.value = false;
  }
};
</script>
