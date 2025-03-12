<!-- frontend/components/ui/Toast.vue -->
<template>
  <Teleport to="body">
    <!-- Toast integrado (usado por app.vue) -->
    <div
      v-if="props.show"
      class="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-md"
    >
      <div
        class="flex items-center p-4 mb-2 rounded-lg shadow-lg"
        :class="{
          'bg-green-50 text-green-800 border-l-4 border-green-600':
            props.type === 'success',
          'bg-blue-50 text-blue-800 border-l-4 border-blue-600':
            props.type === 'info',
          'bg-yellow-50 text-yellow-800 border-l-4 border-yellow-600':
            props.type === 'warning',
          'bg-red-50 text-red-800 border-l-4 border-red-600':
            props.type === 'error',
        }"
      >
        <div class="inline-flex items-center mr-3">
          <CheckCircleIcon v-if="props.type === 'success'" class="w-5 h-5" />
          <InfoIcon v-else-if="props.type === 'info'" class="w-5 h-5" />
          <AlertTriangleIcon
            v-else-if="props.type === 'warning'"
            class="w-5 h-5"
          />
          <XCircleIcon v-else-if="props.type === 'error'" class="w-5 h-5" />
        </div>
        <div class="flex-grow text-sm font-medium">{{ props.message }}</div>
        <button
          @click="$emit('close')"
          class="ml-4 text-gray-500 hover:text-gray-900"
          aria-label="Cerrar"
        >
          <XIcon class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Toast programático (usado por plugin toast.ts) -->
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-md">
      <TransitionGroup
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform translate-y-2 opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform translate-y-2 opacity-0"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="flex items-center p-4 mb-2 rounded-lg shadow-lg"
          :class="{
            'bg-green-50 text-green-800 border-l-4 border-green-600':
              toast.type === 'success',
            'bg-blue-50 text-blue-800 border-l-4 border-blue-600':
              toast.type === 'info',
            'bg-yellow-50 text-yellow-800 border-l-4 border-yellow-600':
              toast.type === 'warning',
            'bg-red-50 text-red-800 border-l-4 border-red-600':
              toast.type === 'error',
          }"
        >
          <div class="inline-flex items-center mr-3">
            <CheckCircleIcon v-if="toast.type === 'success'" class="w-5 h-5" />
            <InfoIcon v-else-if="toast.type === 'info'" class="w-5 h-5" />
            <AlertTriangleIcon
              v-else-if="toast.type === 'warning'"
              class="w-5 h-5"
            />
            <XCircleIcon v-else-if="toast.type === 'error'" class="w-5 h-5" />
          </div>
          <div class="flex-grow text-sm font-medium">{{ toast.message }}</div>
          <button
            @click="removeToast(toast.id)"
            class="ml-4 text-gray-500 hover:text-gray-900"
            aria-label="Cerrar"
          >
            <XIcon class="w-4 h-4" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from "vue";
import {
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  AlertTriangle as AlertTriangleIcon,
  XCircle as XCircleIcon,
  X as XIcon,
} from "lucide-vue-next";

const props = defineProps({
  show: Boolean,
  message: String,
  type: {
    type: String,
    default: "info",
  },
});

defineEmits(["close"]);

// Para toasts programáticos
const toasts = ref([]);
let toastCounter = 0;

// Añadir una notificación
const addToast = (message, type = "info", duration = 5000) => {
  const id = toastCounter++;
  toasts.value.push({ id, message, type });

  if (duration > 0) {
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }
};

// Eliminar una notificación
const removeToast = (id) => {
  const index = toasts.value.findIndex((toast) => toast.id === id);
  if (index !== -1) {
    toasts.value.splice(index, 1);
  }
};

// Exponer métodos para el composable
defineExpose({
  addToast,
  removeToast,
});
</script>
