<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <div class="bg-white p-6 rounded-lg shadow">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Total de Productos</p>
          <p class="text-2xl font-semibold">{{ stats.products }}</p>
        </div>
        <div
          class="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center"
        >
          <PackageIcon class="w-6 h-6 text-indigo-600" />
        </div>
      </div>
      <div class="mt-4 flex items-center">
        <span
          :class="stats.productsChange >= 0 ? 'text-green-500' : 'text-red-500'"
        >
          <span v-if="stats.productsChange > 0">+</span
          >{{ stats.productsChange }}%
        </span>
        <span class="text-gray-500 text-sm ml-2">vs. mes anterior</span>
      </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Ventas</p>
          <p class="text-2xl font-semibold">${{ stats.sales.toFixed(2) }}</p>
        </div>
        <div
          class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center"
        >
          <DollarSignIcon class="w-6 h-6 text-green-600" />
        </div>
      </div>
      <div class="mt-4 flex items-center">
        <span
          :class="stats.salesChange >= 0 ? 'text-green-500' : 'text-red-500'"
        >
          <span v-if="stats.salesChange > 0">+</span>{{ stats.salesChange }}%
        </span>
        <span class="text-gray-500 text-sm ml-2">vs. mes anterior</span>
      </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Pedidos</p>
          <p class="text-2xl font-semibold">{{ stats.orders }}</p>
        </div>
        <div
          class="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center"
        >
          <ShoppingBagIcon class="w-6 h-6 text-yellow-600" />
        </div>
      </div>
      <div class="mt-4 flex items-center">
        <span
          :class="stats.ordersChange >= 0 ? 'text-green-500' : 'text-red-500'"
        >
          <span v-if="stats.ordersChange > 0">+</span>{{ stats.ordersChange }}%
        </span>
        <span class="text-gray-500 text-sm ml-2">vs. mes anterior</span>
      </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Usuarios</p>
          <p class="text-2xl font-semibold">{{ stats.users }}</p>
        </div>
        <div
          class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center"
        >
          <UsersIcon class="w-6 h-6 text-blue-600" />
        </div>
      </div>
      <div class="mt-4 flex items-center">
        <span
          :class="stats.usersChange >= 0 ? 'text-green-500' : 'text-red-500'"
        >
          <span v-if="stats.usersChange > 0">+</span>{{ stats.usersChange }}%
        </span>
        <span class="text-gray-500 text-sm ml-2">vs. mes anterior</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  Package as PackageIcon,
  DollarSign as DollarSignIcon,
  ShoppingBag as ShoppingBagIcon,
  Users as UsersIcon,
} from "lucide-vue-next";

// Propiedades para recibir las estadísticas desde el componente padre
const props = defineProps({
  stats: {
    type: Object,
    default: () => ({
      products: 0,
      productsChange: 0,
      sales: 0,
      salesChange: 0,
      orders: 0,
      ordersChange: 0,
      users: 0,
      usersChange: 0,
    }),
  },
});
</script>
