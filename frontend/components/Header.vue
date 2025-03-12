<!-- frontend/components/Header.vue -->
<template>
  <header class="py-5 px-6 md:px-16 lg:px-24 border-b border-gray-100">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-10">
        <div class="logo">
          <NuxtLink to="/" class="text-2xl font-black tracking-tighter"
            >SHOP.CO</NuxtLink
          >
        </div>
        <nav class="hidden md:flex items-center space-x-6">
          <div class="relative group">
            <NuxtLink to="/products" class="font-medium flex items-center">
              Tienda
              <ChevronDownIcon class="w-4 h-4 ml-1" />
            </NuxtLink>
            <!-- Menú desplegable -->
            <div
              class="absolute hidden group-hover:block bg-white shadow-lg rounded-md p-4 w-48 z-10"
            >
              <NuxtLink
                to="/products/men"
                class="block py-2 hover:text-indigo-600"
                >Hombres</NuxtLink
              >
              <NuxtLink
                to="/products/women"
                class="block py-2 hover:text-indigo-600"
                >Mujeres</NuxtLink
              >
              <NuxtLink
                to="/products/accessories"
                class="block py-2 hover:text-indigo-600"
                >Accesorios</NuxtLink
              >
            </div>
          </div>
          <NuxtLink to="/sale" class="font-medium">En Oferta</NuxtLink>
          <NuxtLink to="/new" class="font-medium">Novedades</NuxtLink>
          <NuxtLink to="/brands" class="font-medium">Marcas</NuxtLink>
        </nav>
      </div>

      <div class="flex items-center gap-4">
        <div class="relative flex-grow max-w-md">
          <div
            class="absolute inset-y-0 left-3 flex items-center pointer-events-none"
          >
            <SearchIcon class="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar productos..."
            class="w-full bg-gray-100 rounded-full py-2 pl-10 pr-4 focus:outline-none"
          />
        </div>
        <NuxtLink to="/cart" class="relative p-2" aria-label="Carrito">
          <ShoppingCartIcon class="w-6 h-6" />
          <span
            v-if="cartCount > 0"
            class="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
          >
            {{ cartCount }}
          </span>
        </NuxtLink>
        <NuxtLink
          :to="isAuthenticated ? '/account' : '/auth/login'"
          class="p-2"
          aria-label="Cuenta"
        >
          <UserIcon class="w-6 h-6" />
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useAuthStore } from "~/stores/auth";
import { useCartStore } from "~/stores/cart";
import {
  ChevronDown as ChevronDownIcon,
  Search as SearchIcon,
  ShoppingCart as ShoppingCartIcon,
  User as UserIcon,
} from "lucide-vue-next";

const authStore = useAuthStore();
const cartStore = useCartStore();

const { isAuthenticated } = storeToRefs(authStore);
const { cartCount } = storeToRefs(cartStore);
</script>
