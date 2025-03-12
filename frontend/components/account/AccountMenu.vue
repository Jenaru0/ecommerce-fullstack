<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-lg font-medium mb-6">Mi cuenta</h2>
    <nav>
      <ul class="space-y-1">
        <li v-for="item in menuItems" :key="item.path">
          <NuxtLink
            :to="item.path"
            class="flex items-center py-2 px-3 rounded-lg transition"
            :class="[
              currentPath === item.path
                ? 'bg-gray-100 text-black font-medium'
                : 'text-gray-600 hover:bg-gray-50 hover:text-black',
            ]"
          >
            <component :is="item.icon" class="h-5 w-5 mr-2" />
            {{ item.label }}
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import {
  User as UserIcon,
  ShoppingBag as ShoppingBagIcon,
  Heart as HeartIcon,
  CreditCard as CreditCardIcon,
  LogOut as LogOutIcon,
  MapPin as MapPinIcon,
} from "lucide-vue-next";

const route = useRoute();

const currentPath = computed(() => route.path);

const menuItems = [
  { label: "Información personal", path: "/account", icon: UserIcon },
  { label: "Mis pedidos", path: "/account/orders", icon: ShoppingBagIcon },
  { label: "Lista de deseos", path: "/account/wishlist", icon: HeartIcon },
  { label: "Direcciones", path: "/account/addresses", icon: MapPinIcon },
  {
    label: "Métodos de pago",
    path: "/account/payment-methods",
    icon: CreditCardIcon,
  },
  { label: "Cerrar sesión", path: "/auth/logout", icon: LogOutIcon },
];
</script>
