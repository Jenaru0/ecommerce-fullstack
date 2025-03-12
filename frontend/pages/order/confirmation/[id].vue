// filepath:
c:\Users\jonna\OneDrive\Escritorio\ecommerce-fullstack\frontend\pages\order\confirmation\[id].vue
<template>
  <div class="container mx-auto px-6 md:px-16 lg:px-24 py-12">
    <div v-if="loading" class="flex justify-center py-20">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"
      ></div>
    </div>

    <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
      <div class="flex">
        <div class="flex-shrink-0">
          <AlertCircleIcon class="h-5 w-5 text-red-400" />
        </div>
        <div class="ml-3">
          <p class="text-red-700">{{ error }}</p>
        </div>
      </div>
    </div>

    <div v-else class="max-w-2xl mx-auto">
      <!-- Tarjeta de confirmación -->
      <div class="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
        <div class="bg-green-500 px-6 py-8 text-center">
          <CheckCircleIcon class="h-16 w-16 text-white mx-auto mb-4" />
          <h1 class="text-3xl font-bold text-white mb-2">
            ¡Pedido Confirmado!
          </h1>
          <p class="text-white text-xl">Gracias por tu compra</p>
        </div>

        <div class="p-6">
          <div class="mb-6">
            <p class="text-gray-600">Pedido #{{ order.id }}</p>
            <p class="text-gray-600">
              Realizado el {{ formatDate(order.createdAt) }}
            </p>
          </div>

          <div class="mb-6">
            <h2 class="text-xl font-semibold mb-4">Resumen de tu pedido</h2>
            <div class="border-t border-b py-4">
              <div
                v-for="item in order.items"
                :key="item.id"
                class="flex justify-between py-2"
              >
                <div>
                  <span class="font-medium">{{ item.product.name }}</span>
                  <span class="text-gray-500"> x{{ item.quantity }}</span>
                </div>
                <span>${{ formatPrice(item.price * item.quantity) }}</span>
              </div>
            </div>
          </div>

          <div class="mb-6">
            <div class="flex justify-between mb-2">
              <span class="text-gray-600">Subtotal</span>
              <span>${{ formatPrice(orderSubtotal) }}</span>
            </div>
            <div class="flex justify-between mb-2">
              <span class="text-gray-600">Envío</span>
              <span>$5.00</span>
            </div>
            <div class="flex justify-between pt-2 border-t font-bold">
              <span>Total</span>
              <span>${{ formatPrice(orderSubtotal + 5) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center space-y-4">
        <p>
          Te enviaremos actualizaciones por email cuando tu pedido sea enviado.
        </p>
        <div class="flex justify-center gap-4">
          <NuxtLink
            to="/account/orders"
            class="text-indigo-600 font-medium hover:text-indigo-800"
          >
            Ver mis pedidos
          </NuxtLink>
          <NuxtLink
            to="/products"
            class="text-indigo-600 font-medium hover:text-indigo-800"
          >
            Seguir comprando
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useApi } from "~/composables/useApi";
import { CheckCircle, AlertCircle } from "lucide-vue-next";

// Proteger esta página con middleware de autenticación
definePageMeta({
  middleware: ["auth"],
});

const route = useRoute();
const router = useRouter();
const api = useApi();

const order = ref(null);
const loading = ref(true);
const error = ref(null);

// Calcular subtotal de los productos
const orderSubtotal = computed(() => {
  if (!order.value?.items) return 0;
  return order.value.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
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
</script>
