<template>
  <div class="container mx-auto px-6 md:px-16 lg:px-24 py-12">
    <h1 class="text-3xl font-bold mb-8">Panel de Administración</h1>

    <DashboardStats :stats="dashboardStats" />

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink
        to="/admin/products"
        class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
      >
        <div class="flex flex-col items-center">
          <PackageIcon class="w-12 h-12 mb-4 text-indigo-600" />
          <h2 class="text-xl font-bold">Productos</h2>
          <p class="text-gray-500 text-center mt-2">
            Gestionar catálogo de productos
          </p>
        </div>
      </NuxtLink>

      <NuxtLink
        to="/admin/orders"
        class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
      >
        <div class="flex flex-col items-center">
          <ShoppingBagIcon class="w-12 h-12 mb-4 text-indigo-600" />
          <h2 class="text-xl font-bold">Pedidos</h2>
          <p class="text-gray-500 text-center mt-2">Ver y gestionar pedidos</p>
        </div>
      </NuxtLink>

      <NuxtLink
        to="/admin/users"
        class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
      >
        <div class="flex flex-col items-center">
          <UsersIcon class="w-12 h-12 mb-4 text-indigo-600" />
          <h2 class="text-xl font-bold">Usuarios</h2>
          <p class="text-gray-500 text-center mt-2">
            Administrar cuentas de usuarios
          </p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useApi } from "~/composables/useApi";
import { useAuth } from "~/composables/useAuth";
import {
  Package as PackageIcon,
  ShoppingBag as ShoppingBagIcon,
  Users as UsersIcon,
} from "lucide-vue-next";

// Aplicar middleware de administrador para esta ruta
definePageMeta({
  middleware: ["admin"],
});

const router = useRouter();
const api = useApi();
const { isAdmin, checkAuthStatus } = useAuth();
const dashboardStats = ref({
  products: 0,
  productsChange: 0,
  sales: 0,
  salesChange: 0,
  orders: 0,
  ordersChange: 0,
  users: 0,
  usersChange: 0,
});

const fetchDashboardStats = async () => {
  try {
    const response = await api.get("/admin/dashboard/stats");
    if (response.success) {
      dashboardStats.value = response.data;
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
  }
};

onMounted(async () => {
  await checkAuthStatus();
  if (!isAdmin.value) {
    router.push("/");
  } else {
    fetchDashboardStats();
  }
});
</script>
