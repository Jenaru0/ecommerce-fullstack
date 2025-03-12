<template>
  <div>
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
      @click="closeCart"
    ></div>

    <div
      class="fixed right-0 top-0 h-full w-full sm:w-96 bg-white z-50 shadow-xl transform transition-transform duration-300"
      :class="isOpen ? 'translate-x-0' : 'translate-x-full'"
    >
      <div class="flex flex-col h-full">
        <!-- Encabezado -->
        <div class="flex items-center justify-between p-4 border-b">
          <h2 class="text-lg font-medium">
            Tu carrito ({{ cartCount }} artículos)
          </h2>
          <button @click="closeCart" class="text-gray-500 hover:text-black">
            <XIcon class="h-6 w-6" />
          </button>
        </div>

        <!-- Contenido del carrito -->
        <div class="flex-1 overflow-y-auto p-4">
          <!-- Carrito vacío -->
          <div
            v-if="!cartItems.length"
            class="flex flex-col items-center justify-center h-full text-center"
          >
            <ShoppingBagIcon class="h-12 w-12 text-gray-300 mb-4" />
            <p class="text-gray-500 mb-6">Tu carrito está vacío</p>
            <button
              @click="exploreProducts"
              class="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800"
            >
              Explorar productos
            </button>
          </div>

          <!-- Lista de productos -->
          <div v-else class="space-y-4">
            <div
              v-for="item in cartItems"
              :key="item.id"
              class="flex border-b pb-4"
            >
              <img
                :src="item.imageUrl"
                :alt="item.name"
                class="w-20 h-20 object-cover rounded mr-4"
              />

              <div class="flex-1">
                <div class="flex justify-between">
                  <h3 class="font-medium">{{ item.name }}</h3>
                  <button
                    @click="removeItem(item.id)"
                    class="text-gray-400 hover:text-red-500"
                  >
                    <TrashIcon class="h-5 w-5" />
                  </button>
                </div>

                <p v-if="item.variants" class="text-sm text-gray-500 mb-2">
                  {{ formatVariants(item.variants) }}
                </p>

                <div class="flex justify-between items-center mt-2">
                  <div class="flex items-center border rounded">
                    <button
                      @click="updateQuantity(item.id, item.quantity - 1)"
                      class="px-2 py-1 text-gray-500"
                      :disabled="item.quantity <= 1"
                    >
                      <MinusIcon class="h-4 w-4" />
                    </button>
                    <span class="px-2">{{ item.quantity }}</span>
                    <button
                      @click="updateQuantity(item.id, item.quantity + 1)"
                      class="px-2 py-1 text-gray-500"
                    >
                      <PlusIcon class="h-4 w-4" />
                    </button>
                  </div>
                  <span class="font-medium"
                    >${{ formatPrice(item.price * item.quantity) }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pie con resumen y botones -->
        <div v-if="cartItems.length" class="border-t p-4 bg-gray-50">
          <div class="flex justify-between mb-4">
            <span>Subtotal:</span>
            <span class="font-bold">${{ formatPrice(subtotal) }}</span>
          </div>

          <div class="space-y-2">
            <button
              @click="goToCheckout"
              class="w-full bg-black text-white py-3 rounded-full hover:bg-gray-800"
            >
              Finalizar compra
            </button>
            <button
              @click="closeCart"
              class="w-full bg-white border border-black text-black py-3 rounded-full hover:bg-gray-100"
            >
              Seguir comprando
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "~/stores/cart";
import {
  XIcon,
  ShoppingBagIcon,
  TrashIcon,
  MinusIcon,
  PlusIcon,
} from "lucide-vue-next";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close"]);
const router = useRouter();
const cartStore = useCartStore();

const cartItems = computed(() => cartStore.items);
const cartCount = computed(() => cartStore.count);
const subtotal = computed(() => cartStore.subtotal);

const closeCart = () => {
  emit("close");
};

const exploreProducts = () => {
  router.push("/products");
  closeCart();
};

const goToCheckout = () => {
  router.push("/checkout");
  closeCart();
};

const updateQuantity = (id, quantity) => {
  if (quantity < 1) return;
  cartStore.updateQuantity(id, quantity);
};

const removeItem = (id) => {
  cartStore.removeItem(id);
};

const formatPrice = (price) => {
  return Number(price).toFixed(2);
};

const formatVariants = (variants) => {
  if (!variants) return "";
  return Object.entries(variants)
    .map(
      ([key, value]) =>
        `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`
    )
    .join(" / ");
};
</script>
