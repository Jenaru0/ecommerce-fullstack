<template>
  <button
    @click="addToCartWithFeedback"
    class="flex-1 bg-black text-white py-3 px-6 rounded-lg font-medium relative overflow-hidden"
    :disabled="disabled || isAdding"
  >
    <span :class="{ 'opacity-0': isAdding }">{{ buttonText }}</span>
    <div
      v-if="isAdding"
      class="absolute inset-0 flex items-center justify-center"
    >
      <svg
        class="animate-spin h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
    <span
      v-if="isAdded"
      class="absolute inset-0 flex items-center justify-center bg-green-600 transition-all"
    >
      <CheckIcon class="h-5 w-5" />
      Añadido
    </span>
  </button>
</template>

<script setup>
import { ref } from "vue";
import { CheckIcon } from "lucide-vue-next";

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  buttonText: {
    type: String,
    default: "Añadir al carrito",
  },
});

const emit = defineEmits(["add-to-cart"]);

const isAdding = ref(false);
const isAdded = ref(false);

const addToCartWithFeedback = async () => {
  isAdding.value = true;

  try {
    emit("add-to-cart");

    // Simular tiempo de procesamiento
    await new Promise((r) => setTimeout(r, 500));

    // Mostrar confirmación
    isAdded.value = true;
    setTimeout(() => {
      isAdded.value = false;
    }, 1500);
  } finally {
    isAdding.value = false;
  }
};
</script>
