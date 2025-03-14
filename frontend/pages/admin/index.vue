<template>
  <div class="container mx-auto px-6 md:px-16 lg:px-24 py-12">
    <h1 class="text-2xl font-bold mb-8">Dashboard</h1>

    <DashboardStats :stats="dashboardStats" class="mb-8" />

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="bg-white p-6 rounded-lg shadow">
        <RecentOrders :orders="recentOrders" :loading="loadingOrders" />
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-lg font-medium mb-4">Productos Populares</h2>
        <p class="text-gray-500">Cargando productos...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useApi } from "~/composables/useApi";
import { useAuthStore } from "~/stores/auth";
import DashboardStats from "~/components/admin/DashboardStats.vue";
import RecentOrders from "~/components/admin/RecentOrders.vue";

// Cambiar el layout para esta página
definePageMeta({
  middleware: ["admin"],
  layout: "admin",
});

const router = useRouter();
const api = useApi();
const authStore = useAuthStore();
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

const recentOrders = ref([]);
const loadingOrders = ref(true);

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

const fetchRecentOrders = async () => {
  loadingOrders.value = true;
  try {
    const response = await api.get("/admin/orders", {
      limit: 5,
      sort: "newest",
    });
    if (response.success && response.data.orders) {
      recentOrders.value = response.data.orders;
    }
  } catch (error) {
    console.error("Error fetching recent orders:", error);
  } finally {
    loadingOrders.value = false;
  }
};

onMounted(async () => {
  await authStore.checkAuth();
  if (!authStore.isAdmin) {
    router.push("/");
  } else {
    fetchDashboardStats();
    fetchRecentOrders();
  }
});
</script>
