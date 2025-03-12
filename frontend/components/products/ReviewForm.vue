<template>
  <div class="bg-white p-6 rounded-lg shadow">
    <h3 class="text-xl font-bold mb-4">Escribe una reseña</h3>

    <form @submit.prevent="submitReview">
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Calificación</label
        >
        <div class="flex space-x-2">
          <button
            v-for="star in 5"
            :key="star"
            type="button"
            @click="form.rating = star"
            class="focus:outline-none"
          >
            <StarIcon
              class="h-6 w-6"
              :class="star <= form.rating ? 'text-yellow-400' : 'text-gray-300'"
            />
          </button>
        </div>
        <p v-if="errors.rating" class="mt-1 text-sm text-red-600">
          {{ errors.rating }}
        </p>
      </div>

      <div class="mb-4">
        <label
          for="comment"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Comentario</label
        >
        <textarea
          id="comment"
          v-model="form.comment"
          rows="4"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
          placeholder="Comparte tu opinión sobre este producto"
        ></textarea>
        <p v-if="errors.comment" class="mt-1 text-sm text-red-600">
          {{ errors.comment }}
        </p>
      </div>

      <div class="flex justify-end space-x-3">
        <button
          type="button"
          @click="$emit('cancel')"
          class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          :disabled="isSubmitting"
        >
          Cancelar
        </button>
        <button
          type="submit"
          class="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting" class="flex items-center">
            <LoaderIcon class="animate-spin -ml-1 mr-2 h-4 w-4" />
            Enviando...
          </span>
          <span v-else>Enviar reseña</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { StarIcon, Loader as LoaderIcon } from "lucide-vue-next";
import { useApi } from "~/composables/useApi";
import { useToast } from "~/composables/useToast";

const props = defineProps({
  productId: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["cancel", "success"]);

const api = useApi();
const { showToast } = useToast();

// Estado del formulario
const form = reactive({
  rating: 0,
  comment: "",
});

// Estado de errores
const errors = reactive({
  rating: "",
  comment: "",
});

const isSubmitting = ref(false);

// Validar el formulario
const validateForm = () => {
  let isValid = true;
  errors.rating = "";
  errors.comment = "";

  if (!form.rating) {
    errors.rating = "Por favor, selecciona una calificación";
    isValid = false;
  }

  if (!form.comment.trim()) {
    errors.comment = "Por favor, escribe un comentario";
    isValid = false;
  } else if (form.comment.trim().length < 5) {
    errors.comment = "El comentario debe tener al menos 5 caracteres";
    isValid = false;
  }

  return isValid;
};

// Enviar reseña
const submitReview = async () => {
  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;

  try {
    const response = await api.post(`/products/${props.productId}/reviews`, {
      rating: form.rating,
      comment: form.comment.trim(),
    });

    if (response.success) {
      showToast("¡Gracias! Tu reseña ha sido publicada.", "success");
      emit("success");
    } else {
      showToast(
        response.message ||
          "No se pudo publicar tu reseña. Por favor, inténtalo de nuevo.",
        "error"
      );
    }
  } catch (err) {
    console.error("Error al enviar reseña:", err);
    showToast(
      "Hubo un problema al enviar tu reseña. Por favor, inténtalo de nuevo.",
      "error"
    );
  } finally {
    isSubmitting.value = false;
  }
};
</script>
