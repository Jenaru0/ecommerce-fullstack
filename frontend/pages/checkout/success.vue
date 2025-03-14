<template>
  <div class="container mx-auto px-6 md:px-16 lg:px-24 py-12">
    <div class="max-w-2xl mx-auto">
      <div v-if="loading" class="py-12 text-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto"
        ></div>
      </div>

      <div v-else-if="error" class="text-center py-16">
        <AlertCircleIcon class="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 class="text-2xl font-bold mb-4">Ha ocurrido un error</h1>
        <p class="mb-8 text-gray-600">{{ error }}</p>
        <NuxtLink
          to="/"
          class="bg-black text-white px-6 py-3 rounded hover:bg-gray-800"
        >
          Volver al inicio
        </NuxtLink>
      </div>

      <div v-else class="text-center py-12">
        <div
          class="bg-green-100 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-6"
        >
          <CheckIcon class="h-12 w-12 text-green-600" />
        </div>

        <h1 class="text-3xl font-bold mb-4">¡Pedido confirmado!</h1>
        <p class="text-lg text-gray-600 mb-8">
          Tu pedido #{{ orderId }} ha sido procesado con éxito.
        </p>

        <div class="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 class="text-xl font-bold mb-4">Resumen del pedido</h2>

          <div v-if="order" class="text-left">
            <!-- Detalles del pedido -->
            <div class="border-b pb-4 mb-4">
              <div class="flex justify-between mb-2">
                <span class="text-gray-600">Fecha:</span>
                <span>{{ formatDate(order.createdAt) }}</span>
              </div>
              <div class="flex justify-between mb-2">
                <span class="text-gray-600">Estado:</span>
                <span class="font-medium">{{ order.status }}</span>
              </div>
              <div class="flex justify-between mb-2">
                <span class="text-gray-600">Método de pago:</span>
                <span>{{
                  order.paymentMethod === "card"
                    ? "Tarjeta de crédito"
                    : "Tarjeta de crédito"
                }}</span>
              </div>
            </div>

            <!-- Productos -->
            <div class="mb-4">
              <h3 class="font-medium mb-3">Productos</h3>
              <div
                v-for="item in order.items"
                :key="item.id"
                class="flex justify-between py-2 border-b"
              >
                <div class="flex">
                  <span>{{ item.product.name }} × {{ item.quantity }}</span>
                </div>
                <span>${{ formatPrice(item.price * item.quantity) }}</span>
              </div>
            </div>

            <!-- Totales -->
            <div class="space-y-2 pt-2">
              <div class="flex justify-between">
                <span class="text-gray-600">Subtotal</span>
                <span>${{ formatPrice(orderSubtotal) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Envío</span>
                <span>${{ formatPrice(order.shipping || 0) }}</span>
              </div>
              <div class="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>${{ formatPrice(order.total) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <p class="text-gray-600">
            Te enviaremos un email con la confirmación del pedido y
            actualizaciones sobre el estado de entrega.
          </p>

          <div class="flex justify-center space-x-4">
            <NuxtLink
              to="/"
              class="border border-black text-black px-6 py-2 rounded hover:bg-gray-100"
            >
              Volver al inicio
            </NuxtLink>
            <NuxtLink
              to="/account/orders"
              class="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
            >
              Ver mis pedidos
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useApi } from "~/composables/useApi";
import { AlertCircleIcon, CheckIcon } from "lucide-vue-next";
import BreadCrumb from "~/components/ui/BreadCrumb.vue";

// Proteger esta página con middleware de autenticación
definePageMeta({
  middleware: ["auth"],
});

const route = useRoute();
const api = useApi();

// Estados
const loading = ref(true);
const error = ref(null);
const order = ref(null);
const orderId = ref(route.query.orderId);

// Calcular subtotal de los productos
const orderSubtotal = computed(() => {
  if (!order.value?.items) return 0;
  return order.value.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
});

onMounted(async () => {
  if (!orderId.value) {
    error.value = "ID de pedido no encontrado";
    loading.value = false;
    return;
  }

  try {
    const response = await api.get(`/orders/${orderId.value}`);

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
});

// Funciones de utilidad
const formatPrice = (price) => {
  return Number(price).toFixed(2);
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
</script>
