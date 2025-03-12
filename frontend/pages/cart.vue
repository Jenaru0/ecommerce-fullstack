<!-- frontend/pages/cart.vue -->
<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Carrito de compra</h1>

    <div v-if="items.length === 0" class="text-center py-8">
      <p class="text-xl mb-4">Tu carrito está vacío</p>
      <NuxtLink
        to="/products"
        class="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
      >
        Explorar productos
      </NuxtLink>
    </div>

    <div v-else>
      <div class="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Producto
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Precio
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Cantidad
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Subtotal
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                ></th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in items" :key="item.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-16 w-16 flex-shrink-0">
                      <img
                        :src="item.imageUrl"
                        :alt="item.name"
                        class="h-full w-full object-cover rounded"
                      />
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ item.name }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${{ item.price.toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <button
                      @click="
                        updateQuantity(item.id, Math.max(1, item.quantity - 1))
                      "
                      class="bg-gray-200 px-2 py-1 rounded-l"
                    >
                      -
                    </button>
                    <span class="px-4 py-1 bg-gray-100">{{
                      item.quantity
                    }}</span>
                    <button
                      @click="updateQuantity(item.id, item.quantity + 1)"
                      class="bg-gray-200 px-2 py-1 rounded-r"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${{ (item.price * item.quantity).toFixed(2) }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                >
                  <button
                    @click="removeItem(item.id)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div
        class="flex flex-col md:flex-row md:justify-between md:items-center bg-white shadow-md rounded-lg p-6"
      >
        <div class="mb-4 md:mb-0">
          <button @click="clearCart" class="text-red-600 hover:text-red-900">
            Vaciar carrito
          </button>
        </div>

        <div class="flex flex-col items-end">
          <div class="text-xl font-bold mb-2">
            Total: ${{ cartTotal.toFixed(2) }}
          </div>
          <NuxtLink
            to="/checkout"
            class="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
          >
            Proceder al pago
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useCartStore } from "~/stores/cart";

const cartStore = useCartStore();
const { items, cartTotal } = storeToRefs(cartStore);

const updateQuantity = (id, quantity) => {
  cartStore.updateQuantity(id, quantity);
};

const removeItem = (id) => {
  cartStore.removeItem(id);
};

const clearCart = () => {
  cartStore.clearCart();
};
</script>
