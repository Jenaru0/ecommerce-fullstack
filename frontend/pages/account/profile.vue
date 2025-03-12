<template>
  <div class="container mx-auto px-6 md:px-16 lg:px-24 py-12">
    <h1 class="text-2xl font-bold mb-6">Mi perfil</h1>

    <div v-if="loading" class="flex justify-center py-8">
      <div
        class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-black"
      ></div>
    </div>

    <div v-else class="bg-white shadow rounded-lg p-6">
      <form @submit.prevent="updateProfile" class="space-y-6">
        <!-- Información básica -->
        <div>
          <h2 class="text-lg font-medium mb-4">Información personal</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700"
                >Nombre completo</label
              >
              <input
                id="name"
                v-model="profileForm.name"
                type="text"
                class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3"
                required
              />
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700"
                >Correo electrónico</label
              >
              <input
                id="email"
                v-model="profileForm.email"
                type="email"
                class="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-3"
                disabled
              />
              <p class="text-xs text-gray-500 mt-1">
                No puedes cambiar tu correo electrónico
              </p>
            </div>

            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700"
                >Teléfono</label
              >
              <input
                id="phone"
                v-model="profileForm.phone"
                type="tel"
                class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3"
              />
            </div>
          </div>
        </div>

        <!-- Cambio de contraseña -->
        <div class="border-t pt-6">
          <h2 class="text-lg font-medium mb-4">Cambiar contraseña</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                for="currentPassword"
                class="block text-sm font-medium text-gray-700"
                >Contraseña actual</label
              >
              <input
                id="currentPassword"
                v-model="passwordForm.currentPassword"
                type="password"
                class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3"
              />
            </div>

            <div>
              <label
                for="newPassword"
                class="block text-sm font-medium text-gray-700"
                >Nueva contraseña</label
              >
              <input
                id="newPassword"
                v-model="passwordForm.newPassword"
                type="password"
                class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3"
              />
              <p class="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
            </div>
          </div>
        </div>

        <div
          v-if="error"
          class="bg-red-50 border-l-4 border-red-500 p-4 text-sm text-red-700"
        >
          {{ error }}
        </div>

        <div
          v-if="successMessage"
          class="bg-green-50 border-l-4 border-green-500 p-4 text-sm text-green-700"
        >
          {{ successMessage }}
        </div>

        <div class="flex justify-end">
          <button
            type="submit"
            class="bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors"
            :disabled="updating"
          >
            <span v-if="updating">Guardando...</span>
            <span v-else>Guardar cambios</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useApi } from "~/composables/useApi";
import { useAuth } from "~/composables/useAuth";

// Definir middleware para proteger esta ruta
definePageMeta({
  middleware: ["auth"],
});

const api = useApi();
const { user, checkAuthStatus } = useAuth();

const loading = ref(true);
const updating = ref(false);
const error = ref(null);
const successMessage = ref(null);

const profileForm = ref({
  name: "",
  email: "",
  phone: "",
});

const passwordForm = ref({
  currentPassword: "",
  newPassword: "",
});

onMounted(async () => {
  await checkAuthStatus();
  if (user.value) {
    profileForm.value.name = user.value.name;
    profileForm.value.email = user.value.email;
    profileForm.value.phone = user.value.phone || "";
  }
  loading.value = false;
});

const updateProfile = async () => {
  updating.value = true;
  error.value = null;
  successMessage.value = null;

  try {
    // Preparar datos según lo que se va a actualizar
    const updateData = {
      name: profileForm.value.name,
      phone: profileForm.value.phone,
    };

    // Si hay contraseña, incluirla en la petición
    if (passwordForm.value.currentPassword && passwordForm.value.newPassword) {
      if (passwordForm.value.newPassword.length < 6) {
        error.value = "La nueva contraseña debe tener al menos 6 caracteres";
        updating.value = false;
        return;
      }

      updateData.currentPassword = passwordForm.value.currentPassword;
      updateData.newPassword = passwordForm.value.newPassword;
    }

    const response = await api.put("/auth/profile", updateData);

    if (response.success) {
      successMessage.value = "Perfil actualizado correctamente";
      // Limpiar formulario de contraseña después de actualizar
      passwordForm.value.currentPassword = "";
      passwordForm.value.newPassword = "";
      // Actualizar datos del usuario en la sesión
      await checkAuthStatus();
    } else {
      error.value = response.message || "Error al actualizar el perfil";
    }
  } catch (err) {
    console.error("Error actualizando perfil:", err);
    error.value = "Error al conectar con el servidor";
  } finally {
    updating.value = false;
  }
};
</script>
