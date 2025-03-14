<template>
  <div class="bg-gray-50 py-12">
    <div class="container mx-auto px-6 lg:px-16">
      <h1 class="text-3xl font-bold mb-8">Finalizar Compra</h1>

      <BreadCrumb
        :items="[
          { text: 'Inicio', url: '/' },
          { text: 'Carrito', url: '/cart' },
          { text: 'Finalizar Compra' },
        ]"
      />

      <!-- Contenido principal -->
      <div class="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Columna principal -->
        <div class="lg:col-span-2">
          <!-- Información de contacto -->
          <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 class="text-xl font-bold mb-4">Información de contacto</h2>

            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    for="firstName"
                    class="block text-sm font-medium text-gray-700 mb-1"
                    >Nombre</label
                  >
                  <input
                    id="firstName"
                    v-model="formData.firstName"
                    type="text"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label
                    for="lastName"
                    class="block text-sm font-medium text-gray-700 mb-1"
                    >Apellido</label
                  >
                  <input
                    id="lastName"
                    v-model="formData.lastName"
                    type="text"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
                    placeholder="Tu apellido"
                  />
                </div>
              </div>

              <div>
                <label
                  for="email"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Email</label
                >
                <input
                  id="email"
                  v-model="formData.email"
                  type="email"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label
                  for="phone"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Teléfono</label
                >
                <input
                  id="phone"
                  v-model="formData.phone"
                  type="tel"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
                  placeholder="+34 000 000 000"
                />
              </div>
            </div>
          </div>

          <!-- Dirección de envío -->
          <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 class="text-xl font-bold mb-4">Dirección de envío</h2>

            <div class="space-y-4">
              <div>
                <label
                  for="address"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Dirección</label
                >
                <input
                  id="address"
                  v-model="formData.address"
                  type="text"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
                  placeholder="Calle y número"
                />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="md:col-span-1">
                  <label
                    for="postalCode"
                    class="block text-sm font-medium text-gray-700 mb-1"
                    >Código Postal</label
                  >
                  <input
                    id="postalCode"
                    v-model="formData.postalCode"
                    type="text"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
                    placeholder="00000"
                  />
                </div>
                <div class="md:col-span-1">
                  <label
                    for="city"
                    class="block text-sm font-medium text-gray-700 mb-1"
                    >Ciudad</label
                  >
                  <input
                    id="city"
                    v-model="formData.city"
                    type="text"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
                    placeholder="Ciudad"
                  />
                </div>
                <div class="md:col-span-1">
                  <label
                    for="province"
                    class="block text-sm font-medium text-gray-700 mb-1"
                    >Provincia</label
                  >
                  <input
                    id="province"
                    v-model="formData.province"
                    type="text"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
                    placeholder="Provincia"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Método de pago -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-bold mb-4">Método de pago</h2>

            <div class="space-y-4">
              <div
                class="flex items-center justify-between p-4 border border-gray-300 rounded-lg"
              >
                <div class="flex items-center">
                  <input
                    id="card-payment"
                    name="payment-method"
                    type="radio"
                    v-model="formData.paymentMethod"
                    value="card"
                    class="h-5 w-5 text-black focus:ring-black"
                  />
                  <label for="card-payment" class="ml-3 block font-medium">
                    Tarjeta de crédito/débito
                  </label>
                </div>
                <div class="flex space-x-2">
                  <img
                    src="assets/images/payment/visa.svg"
                    alt="Visa"
                    class="h-8"
                  />
                  <img
                    src="assets/images/payment/mastercard.svg"
                    alt="Mastercard"
                    class="h-8"
                  />
                </div>
              </div>

              <!-- Campos de tarjeta condicionales -->
              <div
                v-if="formData.paymentMethod === 'card'"
                class="border border-gray-300 rounded-lg p-4 mt-2"
              >
                <div class="space-y-4">
                  <div>
                    <label
                      for="cardNumber"
                      class="block text-sm font-medium text-gray-700 mb-1"
                      >Número de tarjeta</label
                    >
                    <input
                      id="cardNumber"
                      v-model="formData.cardNumber"
                      type="text"
                      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
                      placeholder="0000 0000 0000 0000"
                    />
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        for="expiryDate"
                        class="block text-sm font-medium text-gray-700 mb-1"
                        >Fecha de expiración</label
                      >
                      <input
                        id="expiryDate"
                        v-model="formData.expiryDate"
                        type="text"
                        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
                        placeholder="MM/AA"
                      />
                    </div>
                    <div>
                      <label
                        for="cvv"
                        class="block text-sm font-medium text-gray-700 mb-1"
                        >CVV</label
                      >
                      <input
                        id="cvv"
                        v-model="formData.cvv"
                        type="text"
                        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Opción PayPal -->
              <div
                class="flex items-center p-4 border border-gray-300 rounded-lg"
              >
                <input
                  id="paypal-payment"
                  name="payment-method"
                  type="radio"
                  v-model="formData.paymentMethod"
                  value="paypal"
                  class="h-5 w-5 text-black focus:ring-black"
                />
                <label for="paypal-payment" class="ml-3 block font-medium">
                  PayPal
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Resumen del pedido -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm p-6 sticky top-6">
            <h2 class="text-xl font-bold mb-4">Resumen del pedido</h2>

            <div class="divide-y">
              <div v-for="item in cartItems" :key="item.id" class="py-3 flex">
                <div class="relative flex-shrink-0">
                  <img
                    :src="item.imageUrl"
                    :alt="item.name"
                    class="w-16 h-16 object-cover rounded"
                  />
                  <span
                    class="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-gray-800 text-white text-xs flex items-center justify-center"
                  >
                    {{ item.quantity }}
                  </span>
                </div>
                <div class="ml-4 flex-1">
                  <p class="font-medium">{{ item.name }}</p>
                  <p v-if="item.variants" class="text-sm text-gray-500">
                    {{ formatVariants(item.variants) }}
                  </p>
                  <p class="font-medium">
                    ${{ formatPrice(item.price * item.quantity) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Resumen de costos -->
            <div class="border-t mt-4 pt-4 space-y-2">
              <div class="flex justify-between">
                <span>Subtotal</span>
                <span>${{ formatPrice(subtotal) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Envío</span>
                <span>{{
                  shipping === 0 ? "Gratis" : `$${formatPrice(shipping)}`
                }}</span>
              </div>
              <div class="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>${{ formatPrice(total) }}</span>
              </div>
            </div>

            <!-- Botón de confirmar pedido -->
            <button
              @click="placeOrder"
              class="w-full bg-black text-white py-3 rounded-lg mt-6 hover:bg-gray-800 transition-colors"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? "Procesando..." : "Confirmar pedido" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "~/stores/cart";
import { useToast } from "~/composables/useToast";
import { useApi } from "~/composables/useApi";
import { useAuth } from "~/composables/useAuth";
import BreadCrumb from "~/components/ui/BreadCrumb.vue";
import { AlertCircleIcon } from "lucide-vue-next";
import { usePaymentFormat } from "~/composables/usePaymentFormat";

// Definir middleware para proteger esta ruta
definePageMeta({
  middleware: ["auth"],
});

const router = useRouter();
const cartStore = useCartStore();
const { showToast } = useToast();
const api = useApi();
const { isAuthenticated, user, checkAuthStatus } = useAuth();
const { formatCardNumber, formatExpiryDate } = usePaymentFormat();

const isSubmitting = ref(false);
// IMPORTANTE: Declarar formData ANTES de usar los watchers
const formData = ref({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  postalCode: "",
  city: "",
  province: "",
  paymentMethod: "card",
  cardNumber: "",
  expiryDate: "",
  cvv: "",
});

// AHORA podemos añadir los watchers después de declarar formData
watch(
  () => formData.value.cardNumber,
  (newValue) => {
    if (newValue) {
      formData.value.cardNumber = formatCardNumber(newValue);
    }
  }
);

watch(
  () => formData.value.expiryDate,
  (newValue) => {
    if (newValue) {
      formData.value.expiryDate = formatExpiryDate(newValue);
    }
  }
);

const cartItems = computed(() => cartStore.items);
const subtotal = computed(() => {
  // Asegurar que se realiza una conversión numérica correcta
  if (!cartItems.value || cartItems.value.length === 0) return 0;

  return cartItems.value.reduce((total, item) => {
    const itemPrice = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    return total + itemPrice * quantity;
  }, 0);
});

const shipping = computed(() => {
  // Gratis para pedidos mayores a $50
  const subtotalValue = subtotal.value || 0;
  return subtotalValue > 50 ? 0 : 5;
});

const total = computed(() => {
  const subtotalValue = subtotal.value || 0;
  const shippingValue = shipping.value || 0;
  return subtotalValue + shippingValue;
});

// ¡IMPORTANTE! Verificar estado de autenticación al montar el componente
onMounted(async () => {
  try {
    // Forzar una verificación del estado de autenticación
    const isLoggedIn = await checkAuthStatus();

    // Si no está autenticado, redirigir a login
    if (!isLoggedIn) {
      router.push("/auth/login?redirect=/checkout");
      return;
    }

    // Si hay un usuario autenticado, prellenar datos del formulario
    if (user.value) {
      const names = user.value.name?.split(" ") || [];
      formData.value.firstName = names[0] || "";
      formData.value.lastName = names.slice(1).join(" ") || "";
      formData.value.email = user.value.email || "";
    }
  } catch (error) {
    console.error("Error verificando autenticación:", error);
  }
});

const formatVariants = (variants) => {
  if (!variants) return "";
  return Object.entries(variants)
    .map(
      ([key, value]) =>
        `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`
    )
    .join(" / ");
};

const formatPrice = (price) => {
  return Number(price).toFixed(2);
};

const placeOrder = async () => {
  // Validación del formulario
  if (!validateForm()) {
    showToast("Por favor complete todos los campos obligatorios", "error");
    return;
  }

  // Validar que los valores numéricos son correctos
  if (isNaN(subtotal.value) || isNaN(total.value) || total.value <= 0) {
    showToast(
      "Error en el cálculo del total. Por favor, actualice la página",
      "error"
    );
    isSubmitting.value = false;
    return;
  }

  // Validar que el método de pago está definido
  if (!formData.value.paymentMethod) {
    showToast("Por favor seleccione un método de pago", "error");
    isSubmitting.value = false;
    return;
  }

  isSubmitting.value = true;

  try {
    const orderData = {
      items: cartItems.value.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        variants: item.variants || null,
      })),
      shippingAddress: {
        firstName: formData.value.firstName,
        lastName: formData.value.lastName,
        address: formData.value.address,
        postalCode: formData.value.postalCode,
        city: formData.value.city,
        province: formData.value.province,
        phone: formData.value.phone,
      },
      // Asegurar que enviamos el valor correcto
      paymentMethod:
        formData.value.paymentMethod === "card" ? "card" : "paypal",
      subtotal: subtotal.value,
      shipping: shipping.value,
      total: total.value,
    };

    const response = await api.post("/orders", orderData);

    if (response.success) {
      // Vaciar el carrito
      cartStore.clearCart();

      // Redirigir a la página de éxito
      router.push(`/checkout/success?orderId=${response.data.id}`);
    } else {
      showToast(response.message || "Error al procesar el pedido", "error");
    }
  } catch (error) {
    console.error("Error al procesar el pedido:", error);
    showToast("Error al procesar el pedido. Inténtalo de nuevo.", "error");
  } finally {
    isSubmitting.value = false;
  }
};

// Función para validar el formulario
const validateForm = () => {
  let isValid = true;
  const errors = [];
  const requiredFields = [
    { field: "firstName", label: "Nombre" },
    { field: "lastName", label: "Apellido" },
    { field: "email", label: "Email" },
    { field: "address", label: "Dirección" },
    { field: "postalCode", label: "Código Postal" },
    { field: "city", label: "Ciudad" },
    { field: "province", label: "Provincia" },
  ];

  for (const { field, label } of requiredFields) {
    if (!formData.value[field]?.trim()) {
      isValid = false;
      errors.push(`El campo ${label} es obligatorio`);
    }
  }

  // Validar formato de email
  if (
    formData.value.email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)
  ) {
    isValid = false;
    errors.push("El formato del email no es válido");
  }

  // Validar campos de tarjeta si se seleccionó ese método
  if (formData.value.paymentMethod === "card") {
    if (!formData.value.cardNumber?.trim()) {
      isValid = false;
      errors.push("El número de tarjeta es obligatorio");
    } else if (formData.value.cardNumber.replace(/\s/g, "").length < 16) {
      isValid = false;
      errors.push("El número de tarjeta debe tener al menos 16 dígitos");
    }

    if (!formData.value.expiryDate?.trim()) {
      isValid = false;
      errors.push("La fecha de expiración es obligatoria");
    }

    if (!formData.value.cvv?.trim()) {
      isValid = false;
      errors.push("El código CVV es obligatorio");
    }
  }

  // Mostrar el primer error si hay alguno
  if (errors.length > 0) {
    showToast(errors[0], "error");
  }

  return isValid;
};
</script>
