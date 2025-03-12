<!-- frontend/components/NotificationBar.vue -->
<template>
  <div
    v-if="showNotification"
    class="bg-black text-white py-2 px-4 flex justify-center items-center relative"
  >
    <p class="text-sm font-normal">
      Regístrate y obtén 20% de descuento en tu primer pedido.
      <NuxtLink to="/auth/register" class="font-semibold cursor-pointer">
        Regístrate ahora
      </NuxtLink>
    </p>
    <button
      @click="closeNotification"
      class="absolute right-4 text-white"
      aria-label="Cerrar notificación"
    >
      <XIcon class="w-5 h-5" />
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { X as XIcon } from "lucide-vue-next";

const showNotification = ref(true);

const closeNotification = () => {
  showNotification.value = false;
};
</script>
