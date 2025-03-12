<template>
  <div class="container mx-auto px-6 md:px-16 lg:px-24 py-12">
    <h1 class="text-3xl font-bold mb-8">Finalizar Compra</h1>

    <div
      v-if="!isAuthenticated"
      class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8"
    >
      <div class="flex">
        <div class="flex-shrink-0">
          <AlertCircleIcon class="h-5 w-5 text-yellow-400" />
        </div>
        <div class="ml-3">
          <p class="text-sm text-yellow-700">
            Necesitas iniciar sesión para completar la compra.
            <NuxtLink
              to="/auth/login?redirect=/checkout"
              class="font-medium underline hover:text-yellow-800"
            >
              Iniciar sesión
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>

    <div v-else-if="items.length === 0" class="text-center py-16">
      <div class="mb-6 text-gray-500">
        <ShoppingCartIcon class="w-16 h-16 mx-auto mb-4" />
        <h2 class="text-2xl font-semibold mb-2">Tu carrito está vacío</h2>
        <p>Parece que aún no has añadido ningún producto a tu carrito.</p>
      </div>
      <NuxtLink
        to="/products"
        class="inline-block bg-black text-white py-3 px-6 rounded hover:bg-gray-800"
      >
        Ver productos
      </NuxtLink>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Información de envío y detalles del pedido -->
      <div class="lg:col-span-2 space-y-8">
        <!-- Productos en el carrito -->
        <div class="bg-white shadow-md rounded-lg p-6">
          <h2 class="text-xl font-bold mb-4">Productos en tu carrito</h2>
          <div class="divide-y">
            <div v-for="item in items" :key="item.id" class="py-4 flex gap-4">
              <div class="w-20 h-20 bg-gray-100 rounded">
                <img
                  :src="item.imageUrl"
                  :alt="item.name"
                  class="w-full h-full object-cover rounded"
                />
              </div>
              <div class="flex-1">
                <h3 class="font-medium">{{ item.name }}</h3>
                <p class="text-gray-500">Cantidad: {{ item.quantity }}</p>
                <p>${{ formatPrice(item.price) }} c/u</p>
              </div>
              <div class="text-right">
                <p class="font-bold">
                  ${{ formatPrice(item.price * item.quantity) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Formulario de dirección -->
        <div class="bg-white shadow-md rounded-lg p-6">
          <h2 class="text-xl font-bold mb-4">Dirección de envío</h2>
          <form @submit.prevent="processOrder" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  for="firstName"
                  class="block text-sm font-medium text-gray-700"
                >
                  Nombre
                </label>
                <input
                  v-model="shippingDetails.firstName"
                  type="text"
                  id="firstName"
                  :class="{
                    'border-red-300 focus:ring-red-500 focus:border-red-500':
                      formErrors.firstName,
                  }"
                  class="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3"
                />
                <p
                  v-if="formErrors.firstName"
                  class="mt-1 text-sm text-red-600"
                >
                  {{ formErrors.firstName }}
                </p>
              </div>

              <div>
                <label
                  for="lastName"
                  class="block text-sm font-medium text-gray-700"
                >
                  Apellido
                </label>
                <input
                  v-model="shippingDetails.lastName"
                  type="text"
                  id="lastName"
                  :class="{
                    'border-red-300 focus:ring-red-500 focus:border-red-500':
                      formErrors.lastName,
                  }"
                  class="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3"
                />
                <p v-if="formErrors.lastName" class="mt-1 text-sm text-red-600">
                  {{ formErrors.lastName }}
                </p>
              </div>

              <div class="md:col-span-2">
                <label
                  for="address"
                  class="block text-sm font-medium text-gray-700"
                >
                  Dirección
                </label>
                <input
                  v-model="shippingDetails.address"
                  type="text"
                  id="address"
                  :class="{
                    'border-red-300 focus:ring-red-500 focus:border-red-500':
                      formErrors.address,
                  }"
                  class="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3"
                />
                <p v-if="formErrors.address" class="mt-1 text-sm text-red-600">
                  {{ formErrors.address }}
                </p>
              </div>

              <div>
                <label
                  for="city"
                  class="block text-sm font-medium text-gray-700"
                >
                  Ciudad
                </label>
                <input
                  v-model="shippingDetails.city"
                  type="text"
                  id="city"
                  :class="{
                    'border-red-300 focus:ring-red-500 focus:border-red-500':
                      formErrors.city,
                  }"
                  class="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3"
                />
                <p v-if="formErrors.city" class="mt-1 text-sm text-red-600">
                  {{ formErrors.city }}
                </p>
              </div>

              <div>
                <label
                  for="zipCode"
                  class="block text-sm font-medium text-gray-700"
                >
                  Código postal
                </label>
                <input
                  v-model="shippingDetails.zipCode"
                  type="text"
                  id="zipCode"
                  :class="{
                    'border-red-300 focus:ring-red-500 focus:border-red-500':
                      formErrors.zipCode,
                  }"
                  class="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3"
                />
                <p v-if="formErrors.zipCode" class="mt-1 text-sm text-red-600">
                  {{ formErrors.zipCode }}
                </p>
              </div>

              <div>
                <label
                  for="phone"
                  class="block text-sm font-medium text-gray-700"
                >
                  Teléfono
                </label>
                <input
                  v-model="shippingDetails.phone"
                  type="tel"
                  id="phone"
                  :class="{
                    'border-red-300 focus:ring-red-500 focus:border-red-500':
                      formErrors.phone,
                  }"
                  class="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3"
                />
                <p v-if="formErrors.phone" class="mt-1 text-sm text-red-600">
                  {{ formErrors.phone }}
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- Resumen de pago -->
      <div>
        <div class="bg-white shadow-md rounded-lg p-6 sticky top-8">
          <h2 class="text-xl font-bold mb-4">Resumen</h2>

          <div class="space-y-2 mb-6">
            <div class="flex justify-between">
              <span class="text-gray-600">Subtotal</span>
              <span>${{ formatPrice(cartTotal) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Envío</span>
              <span>$5.00</span>
            </div>
            <div class="flex justify-between border-t pt-2 font-bold">
              <span>Total</span>
              <span>${{ formatPrice(cartTotal + 5) }}</span>
            </div>
          </div>

          <button
            @click="processOrder"
            :disabled="isProcessing"
            class="w-full py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <div v-if="isProcessing" class="flex justify-center items-center">
              <span class="animate-spin mr-2">
                <LoaderIcon class="h-5 w-5" />
              </span>
              Procesando...
            </div>
            <span v-else>Completar compra</span>
          </button>

          <p v-if="error" class="mt-4 text-sm text-red-600">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useCartStore } from "~/stores/cart";
import { useAuth } from "~/composables/useAuth";
import { useApi } from "~/composables/useApi";
import { useToast } from "~/composables/useToast";
import {
  AlertCircle,
  Loader as LoaderIcon,
  ShoppingCart as ShoppingCartIcon,
} from "lucide-vue-next";

// Middleware para asegurar que el usuario esté autenticado
definePageMeta({
  middleware: ["auth"],
});

const router = useRouter();
const cartStore = useCartStore();
const { items, cartTotal } = storeToRefs(cartStore);
const { isAuthenticated, user } = useAuth();
const api = useApi();
const { showToast } = useToast();

const isProcessing = ref(false);
const error = ref<string | null>(null);

// Datos de envío con valores iniciales del usuario si está disponible
const shippingDetails = ref({
  firstName: user?.value?.name?.split(" ")[0] || "",
  lastName: user?.value?.name?.split(" ").slice(1).join(" ") || "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  phone: user?.value?.phone || "",
});

// Estado para errores de formulario
const formErrors = ref<Record<string, string>>({});

// Validar el formulario
const validateForm = (): boolean => {
  const errors: Record<string, string> = {};

  // Validar campos obligatorios
  if (!shippingDetails.value.firstName.trim()) {
    errors.firstName = "El nombre es obligatorio";
  }

  if (!shippingDetails.value.lastName.trim()) {
    errors.lastName = "El apellido es obligatorio";
  }

  if (!shippingDetails.value.address.trim()) {
    errors.address = "La dirección es obligatoria";
  }

  if (!shippingDetails.value.city.trim()) {
    errors.city = "La ciudad es obligatoria";
  }

  if (!shippingDetails.value.zipCode.trim()) {
    errors.zipCode = "El código postal es obligatorio";
  } else if (!/^\d{5}(-\d{4})?$/.test(shippingDetails.value.zipCode)) {
    errors.zipCode = "El código postal debe tener formato válido (ej: 12345)";
  }

  if (
    shippingDetails.value.phone &&
    !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(
      shippingDetails.value.phone
    )
  ) {
    errors.phone = "El teléfono debe tener un formato válido";
  }

  formErrors.value = errors;
  return Object.keys(errors).length === 0;
};

const formatPrice = (price: number): string => {
  return price.toFixed(2);
};

const processOrder = async () => {
  if (!isAuthenticated.value) {
    router.push("/auth/login?redirect=/checkout");
    return;
  }

  if (items.value.length === 0) {
    showToast("Tu carrito está vacío", "error");
    return;
  }

  // Validar formulario
  if (!validateForm()) {
    showToast(
      "Por favor completa todos los campos obligatorios correctamente",
      "warning"
    );
    return;
  }

  isProcessing.value = true;
  error.value = null;

  try {
    const response = await api.post("/orders", {
      items: items.value.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
      shippingDetails: shippingDetails.value,
    });

    if (response.success) {
      cartStore.clearCart();
      showToast("¡Pedido realizado con éxito!", "success");
      router.push(`/order/confirmation/${response.data.id}`);
    } else {
      error.value = response.message || "Error al procesar el pedido";
      showToast(error.value, "error");
    }
  } catch (err) {
    console.error("Error procesando pedido:", err);
    error.value = "Error al conectar con el servidor";
    showToast(
      "Error al procesar el pedido. Inténtalo de nuevo más tarde.",
      "error"
    );
  } finally {
    isProcessing.value = false;
  }
};
</script>
