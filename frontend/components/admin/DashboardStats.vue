<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-indigo-500">
      <div class="flex items-center">
        <div class="p-3 bg-indigo-100 rounded-full">
          <ShoppingBagIcon class="h-6 w-6 text-indigo-600" />
        </div>
        <div class="ml-4">
          <h3 class="text-sm font-medium text-gray-500">Total Productos</h3>
          <div class="flex items-baseline">
            <p class="text-2xl font-semibold text-gray-900">
              {{ stats.products }}
            </p>
            <p
              class="ml-2 text-sm text-green-600"
              v-if="stats.productsChange > 0"
            >
              +{{ stats.productsChange }}%
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
      <div class="flex items-center">
        <div class="p-3 bg-green-100 rounded-full">
          <ShoppingCartIcon class="h-6 w-6 text-green-600" />
        </div>
        <div class="ml-4">
          <h3 class="text-sm font-medium text-gray-500">Ventas</h3>
          <div class="flex items-baseline">
            <p class="text-2xl font-semibold text-gray-900">
              ${{ stats.sales }}
            </p>
            <p class="ml-2 text-sm text-green-600" v-if="stats.salesChange > 0">
              +{{ stats.salesChange }}%
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
      <div class="flex items-center">
        <div class="p-3 bg-yellow-100 rounded-full">
          <PackageIcon class="h-6 w-6 text-yellow-600" />
        </div>
        <div class="ml-4">
          <h3 class="text-sm font-medium text-gray-500">Órdenes</h3>
          <div class="flex items-baseline">
            <p class="text-2xl font-semibold text-gray-900">
              {{ stats.orders }}
            </p>
            <p
              class="ml-2 text-sm text-green-600"
              v-if="stats.ordersChange > 0"
            >
              +{{ stats.ordersChange }}%
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
      <div class="flex items-center">
        <div class="p-3 bg-red-100 rounded-full">
          <UsersIcon class="h-6 w-6 text-red-600" />
        </div>
        <div class="ml-4">
          <h3 class="text-sm font-medium text-gray-500">Usuarios</h3>
          <div class="flex items-baseline">
            <p class="text-2xl font-semibold text-gray-900">
              {{ stats.users }}
            </p>
            <p class="ml-2 text-sm text-green-600" v-if="stats.usersChange > 0">
              +{{ stats.usersChange }}%
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ShoppingBag as ShoppingBagIcon,
  ShoppingCart as ShoppingCartIcon,
  Package as PackageIcon,
  Users as UsersIcon,
} from "lucide-vue-next";

defineProps({
  stats: {
    type: Object,
    required: true,
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
