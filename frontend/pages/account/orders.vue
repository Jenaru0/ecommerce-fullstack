<template>
  <div class="container mx-auto px-6 md:px-16 lg:px-24 py-12">
    <BreadCrumb
      :items="[{ text: 'Mi cuenta', url: '/account' }, { text: 'Mis pedidos' }]"
    />

    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
      <!-- Sidebar menu -->
      <AccountMenu />

      <!-- Main Content -->
      <div class="md:col-span-3">
        <h1 class="text-2xl font-bold mb-6">Mis pedidos</h1>

        <div v-if="loading" class="flex justify-center py-8">
          <div
            class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-black"
          ></div>
        </div>

        <div
          v-else-if="orders.length === 0"
          class="bg-white shadow rounded-lg p-8 text-center"
        >
          <ShoppingBagIcon class="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p class="text-xl text-gray-600 mb-6">No tienes pedidos realizados</p>
          <NuxtLink
            to="/products"
            class="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
          >
            Explorar productos
          </NuxtLink>
        </div>

        <div v-else class="space-y-6">
          <div
            v-for="order in orders"
            :key="order.id"
            class="bg-white shadow rounded-lg overflow-hidden"
          >
            <div class="p-6 border-b">
              <div class="flex flex-wrap justify-between items-center">
                <div>
                  <h2 class="font-semibold">Pedido #{{ order.id }}</h2>
                  <p class="text-sm text-gray-600">
                    {{ formatDate(order.createdAt) }}
                  </p>
                </div>
                <div class="text-right">
                  <span
                    class="px-3 py-1 rounded-full text-sm font-medium"
                    :class="{
                      'bg-green-100 text-green-800':
                        order.status === 'Entregado',
                      'bg-blue-100 text-blue-800': order.status === 'Enviado',
                      'bg-yellow-100 text-yellow-800':
                        order.status === 'Pendiente',
                      'bg-red-100 text-red-800': order.status === 'Cancelado',
                    }"
                  >
                    {{ order.status }}
                  </span>
                  <p class="mt-1 font-bold">${{ formatPrice(order.total) }}</p>
                </div>
              </div>
            </div>

            <div class="p-6 border-b">
              <h3 class="font-medium mb-4">Productos</h3>
              <div class="divide-y">
                <div
                  v-for="item in order.items"
                  :key="item.id"
                  class="py-3 flex items-center justify-between"
                >
                  <div class="flex items-center">
                    <img
                      :src="
                        item.product?.imageUrl ||
                        '/assets/images/placeholder-product.jpg'
                      "
                      :alt="item.product?.name || 'Producto'"
                      class="w-16 h-16 object-cover rounded mr-4"
                    />
                    <div>
                      <p class="font-medium">
                        {{ item.product?.name || "Producto" }}
                      </p>
                      <p class="text-sm text-gray-600">
                        Cantidad: {{ item.quantity }}
                      </p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p>${{ formatPrice(item.price) }}</p>
                    <p class="text-sm text-gray-600">
                      Total: ${{ formatPrice(item.price * item.quantity) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="p-6 flex justify-between items-center">
              <NuxtLink
                :to="`/account/orders/${order.id}`"
                class="text-indigo-600 hover:underline"
              >
                Ver detalles completos
              </NuxtLink>
              <button
                v-if="order.status === 'Pendiente'"
                @click="cancelOrder(order.id)"
                class="text-red-600 hover:underline"
                :disabled="cancelling === order.id"
              >
                {{
                  cancelling === order.id ? "Cancelando..." : "Cancelar pedido"
                }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useApi } from "~/composables/useApi";
import { ShoppingBag as ShoppingBagIcon } from "lucide-vue-next";
import BreadCrumb from "~/components/ui/BreadCrumb.vue";
import AccountMenu from "~/components/account/AccountMenu.vue";
// Definir middleware para proteger esta ruta
definePageMeta({
  middleware: ["auth"],
});

const api = useApi();
const orders = ref([]);
const loading = ref(true);
const cancelling = ref(null);

onMounted(async () => {
  await loadOrders();
});

const loadOrders = async () => {
  try {
    const response = await api.get("/orders/my");
    if (response.success) {
      orders.value = response.data;
    } else {
      console.error("Error al cargar pedidos:", response.message);
    }
  } catch (err) {
    console.error("Error al cargar pedidos:", err);
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

const cancelOrder = async (orderId) => {
  if (!confirm("¿Estás seguro de que deseas cancelar este pedido?")) return;

  cancelling.value = orderId;
  try {
    const response = await api.put(`/orders/${orderId}/cancel`);
    if (response.success) {
      // Actualizar el estado del pedido en la lista
      const index = orders.value.findIndex((o) => o.id === orderId);
      if (index !== -1) {
        orders.value[index].status = "Cancelado";
      }
    } else {
      alert(response.message || "No se pudo cancelar el pedido");
    }
  } catch (err) {
    console.error("Error al cancelar pedido:", err);
    alert("Error al cancelar el pedido");
  } finally {
    cancelling.value = null;
  }
};
</script>
