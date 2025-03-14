<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Barra superior con logo y botones de acción -->
    <div class="bg-white shadow-sm">
      <div
        class="container mx-auto px-6 md:px-16 lg:px-24 py-4 flex justify-between items-center"
      >
        <NuxtLink to="/admin" class="text-xl font-bold"
          >Panel Administrativo</NuxtLink
        >
        <div class="flex items-center gap-4">
          <NuxtLink to="/" class="text-gray-600 hover:text-black">
            Ver tienda
          </NuxtLink>
          <div class="relative group">
            <button
              class="flex items-center gap-2 p-2 hover:bg-gray-100 rounded"
            >
              <div
                class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold"
              >
                {{ userInitials }}
              </div>
              <ChevronDownIcon class="h-4 w-4 text-gray-500" />
            </button>

            <div
              class="absolute hidden group-hover:block right-0 bg-white shadow-lg rounded-md p-2 w-48 z-10"
            >
              <div class="text-sm font-medium text-gray-800 mb-2 px-3 py-1">
                {{ userName }}
              </div>
              <NuxtLink
                to="/admin/settings"
                class="block px-3 py-2 hover:bg-gray-100 rounded-md"
              >
                Configuración
              </NuxtLink>
              <button
                @click="logout"
                class="w-full text-left block px-3 py-2 hover:bg-gray-100 rounded-md text-red-600"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenedor principal con menú lateral y contenido -->
    <div class="container mx-auto px-6 md:px-16 lg:px-24 py-8">
      <div class="flex flex-col md:flex-row gap-8">
        <!-- Menú de navegación lateral -->
        <div class="w-full md:w-64">
          <div class="bg-white shadow rounded-lg">
            <nav class="py-2">
              <NuxtLink
                to="/admin"
                class="block px-4 py-3 hover:bg-gray-100"
                :class="
                  route.path === '/admin' ? 'bg-gray-100 font-medium' : ''
                "
              >
                Dashboard
              </NuxtLink>
              <NuxtLink
                to="/admin/products"
                class="block px-4 py-3 hover:bg-gray-100"
                :class="
                  route.path.startsWith('/admin/products')
                    ? 'bg-gray-100 font-medium'
                    : ''
                "
              >
                Productos
              </NuxtLink>
              <NuxtLink
                to="/admin/orders"
                class="block px-4 py-3 hover:bg-gray-100"
                :class="
                  route.path.startsWith('/admin/orders')
                    ? 'bg-gray-100 font-medium'
                    : ''
                "
              >
                Pedidos
              </NuxtLink>
              <NuxtLink
                to="/admin/users"
                class="block px-4 py-3 hover:bg-gray-100"
                :class="
                  route.path.startsWith('/admin/users')
                    ? 'bg-gray-100 font-medium'
                    : ''
                "
              >
                Usuarios
              </NuxtLink>
              <NuxtLink
                to="/admin/settings"
                class="block px-4 py-3 hover:bg-gray-100"
                :class="
                  route.path.startsWith('/admin/settings')
                    ? 'bg-gray-100 font-medium'
                    : ''
                "
              >
                Configuración
              </NuxtLink>
            </nav>
          </div>
        </div>

        <!-- Contenido principal -->
        <div class="flex-1">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "~/stores/auth";
import { ChevronDown as ChevronDownIcon } from "lucide-vue-next";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// Propiedades calculadas para el usuario
const userName = computed(() => {
  if (!authStore.user || !authStore.user.name) return "Admin";
  return authStore.user.name;
});

const userInitials = computed(() => {
  if (!authStore.user || !authStore.user.name) return "A";
  const names = authStore.user.name.split(" ");
  if (names.length > 1) {
    return `${names[0][0]}${names[1][0]}`.toUpperCase();
  }
  return names[0][0].toUpperCase();
});

// Función para cerrar sesión
const logout = () => {
  authStore.logout();
  router.push("/auth/login");
};
</script>
