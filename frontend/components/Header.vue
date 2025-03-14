<!-- frontend/components/Header.vue -->
<template>
  <header class="bg-white border-b border-gray-200">
    <div class="container mx-auto px-6 md:px-16 lg:px-24 py-4">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <NuxtLink to="/" class="text-2xl font-black">SHOP.CO</NuxtLink>

        <!-- Navegación -->
        <nav class="hidden md:flex space-x-8">
          <NuxtLink to="/products" class="text-gray-600 hover:text-black"
            >Tienda</NuxtLink
          >
          <NuxtLink
            to="/products/category/men"
            class="text-gray-600 hover:text-black"
            >Hombre</NuxtLink
          >
          <NuxtLink
            to="/products/category/women"
            class="text-gray-600 hover:text-black"
            >Mujer</NuxtLink
          >
          <NuxtLink
            to="/products/category/new"
            class="text-gray-600 hover:text-black"
            >Novedades</NuxtLink
          >
        </nav>

        <!-- Búsqueda y acciones -->
        <div class="flex items-center gap-2">
          <div class="relative hidden md:block">
            <input
              type="text"
              placeholder="Buscar productos..."
              class="bg-gray-100 rounded-full py-2 px-4 pr-10 w-64 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
            >
              <SearchIcon class="h-5 w-5" />
            </button>
          </div>

          <!-- Botones de acción - Corrección para hidratación -->
          <div class="flex items-center space-x-1">
            <!-- Solución: usar un renderizado condicional correctamente -->
            <ClientOnly>
              <div v-if="isAuthenticated" class="relative">
                <button
                  @click="showUserMenu = !showUserMenu"
                  class="p-2 rounded-full hover:bg-gray-100 flex items-center"
                  aria-label="Perfil de usuario"
                >
                  <span
                    class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600"
                  >
                    {{ userInitials }}
                  </span>
                  <ChevronDownIcon class="h-4 w-4 ml-1" />
                </button>
                <div
                  v-if="showUserMenu"
                  class="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-lg z-50"
                >
                  <NuxtLink
                    to="/account"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Mi Cuenta
                  </NuxtLink>
                  <NuxtLink
                    to="/account/orders"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Mis Pedidos
                  </NuxtLink>
                  <div v-if="user && user.role === 'admin'">
                    <NuxtLink
                      to="/admin"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Panel Admin
                    </NuxtLink>
                  </div>
                  <button
                    @click="
                      authStore.logout();
                      router.push('/');
                    "
                    class="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </div>
              <div v-else>
                <NuxtLink
                  to="/auth/login"
                  class="p-2"
                  aria-label="Iniciar sesión"
                >
                  <UserIcon class="h-6 w-6" />
                </NuxtLink>
              </div>

              <!-- Fallback para server-side -->
              <template #fallback>
                <div>
                  <NuxtLink
                    to="/auth/login"
                    class="p-2"
                    aria-label="Iniciar sesión"
                  >
                    <UserIcon class="h-6 w-6" />
                  </NuxtLink>
                </div>
              </template>
            </ClientOnly>

            <NuxtLink to="/cart" class="p-2 relative" aria-label="Carrito">
              <ShoppingCartIcon class="h-6 w-6" />
              <span
                v-if="cartCount > 0"
                class="absolute top-0 right-0 rounded-full bg-black text-white text-xs w-5 h-5 flex items-center justify-center"
              >
                {{ cartCount }}
              </span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from "vue";
import { useCartStore } from "~/stores/cart";
import { useAuthStore } from "~/stores/auth";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import {
  Search as SearchIcon,
  User as UserIcon,
  ShoppingCart as ShoppingCartIcon,
  ChevronDown as ChevronDownIcon,
} from "lucide-vue-next";

// Obtener el estado de autenticación desde el store
const authStore = useAuthStore();
const { user, isAuthenticated } = storeToRefs(authStore);
const router = useRouter();

// Obtener la cantidad de items en el carrito
const cartStore = useCartStore();
const cartCount = computed(() => cartStore.itemCount);

// Estado para menú desplegable de usuario
const showUserMenu = ref(false);

// Propiedades calculadas para el usuario
const userInitials = computed(() => {
  if (!user.value || !user.value.name) return "U";
  const names = user.value.name.split(" ");
  if (names.length > 1) {
    return `${names[0][0]}${names[1][0]}`.toUpperCase();
  }
  return names[0][0].toUpperCase();
});
</script>
