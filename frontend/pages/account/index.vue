<template>
  <div class="container mx-auto px-6 md:px-16 lg:px-24 py-12">
    <h1 class="text-3xl font-bold mb-8">Mi cuenta</h1>

    <div v-if="loading" class="flex justify-center py-8">
      <div
        class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-black"
      ></div>
    </div>

    <div v-else-if="!isAuthenticated" class="text-center py-10">
      <p class="mb-4">Necesitas iniciar sesión para ver tu perfil</p>
      <NuxtLink to="/auth/login" class="bg-black text-white px-6 py-2 rounded">
        Iniciar sesión
      </NuxtLink>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Sidebar de navegación -->
      <div>
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-4">{{ user?.name }}</h2>
          <p class="text-gray-600 mb-6">{{ user?.email }}</p>

          <nav class="space-y-2">
            <NuxtLink
              to="/account"
              class="block py-2 px-4 rounded bg-gray-100 font-medium"
            >
              Mi perfil
            </NuxtLink>
            <NuxtLink
              to="/account/orders"
              class="block py-2 px-4 rounded hover:bg-gray-100"
            >
              Mis pedidos
            </NuxtLink>
            <NuxtLink
              to="/account/addresses"
              class="block py-2 px-4 rounded hover:bg-gray-100"
            >
              Direcciones
            </NuxtLink>
            <button
              @click="logout"
              class="block w-full text-left py-2 px-4 rounded hover:bg-gray-100 text-red-600"
            >
              Cerrar sesión
            </button>
          </nav>
        </div>
      </div>

      <!-- Contenido principal -->
      <div class="md:col-span-2">
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-4">Información personal</h2>

          <form @submit.prevent="updateProfile" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Nombre</label
              >
              <input
                v-model="profileForm.name"
                type="text"
                class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Email</label
              >
              <input
                v-model="profileForm.email"
                type="email"
                disabled
                class="mt-1 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
              />
              <p class="text-xs text-gray-500 mt-1">
                No puedes cambiar tu email
              </p>
            </div>

            <div>
              <h3 class="text-md font-medium mb-2">Cambiar contraseña</h3>
              <div class="space-y-2">
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Contraseña actual</label
                  >
                  <input
                    v-model="passwordForm.currentPassword"
                    type="password"
                    class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Nueva contraseña</label
                  >
                  <input
                    v-model="passwordForm.newPassword"
                    type="password"
                    class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
              </div>
            </div>

            <div class="flex justify-end">
              <button
                type="submit"
                class="bg-black text-white px-4 py-2 rounded"
              >
                Guardar cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuth } from "~/composables/useAuth";

// Definir middleware para proteger esta ruta
definePageMeta({
  middleware: ["auth"],
});

const { user, isAuthenticated, loading, logout } = useAuth();

const profileForm = ref({
  name: "",
  email: "",
});

const passwordForm = ref({
  currentPassword: "",
  newPassword: "",
});

onMounted(() => {
  if (user.value) {
    profileForm.value.name = user.value.name;
    profileForm.value.email = user.value.email;
  }
});

const updateProfile = async () => {
  // Implementar lógica para actualizar perfil
  console.log("Actualizando perfil:", profileForm.value);
  // También manejar cambio de contraseña si los campos están llenos
};
</script>
