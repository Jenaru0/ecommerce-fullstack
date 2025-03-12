<template>
  <div class="container mx-auto px-6 md:px-16 lg:px-24 py-16">
    <div class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 class="text-2xl font-bold mb-6 text-center">Crear Cuenta</h1>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700"
            >Nombre</label
          >
          <input
            v-model="name"
            type="text"
            id="name"
            required
            class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3"
          />
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700"
            >Email</label
          >
          <input
            v-model="email"
            type="email"
            id="email"
            required
            class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700"
            >Contraseña</label
          >
          <input
            v-model="password"
            type="password"
            id="password"
            required
            minlength="6"
            class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3"
          />
          <p class="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
        </div>

        <div
          v-if="error"
          class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 text-sm"
        >
          {{ error }}
        </div>

        <button
          type="submit"
          class="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition"
          :disabled="loading"
        >
          <span v-if="loading">Cargando...</span>
          <span v-else>Registrarse</span>
        </button>
      </form>

      <p class="mt-4 text-center text-sm text-gray-600">
        ¿Ya tienes una cuenta?
        <NuxtLink to="/auth/login" class="text-indigo-600 hover:underline">
          Iniciar sesión
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "~/composables/useAuth";

const router = useRouter();
const { register, loading, error } = useAuth();

const name = ref("");
const email = ref("");
const password = ref("");

const handleRegister = async () => {
  const success = await register(name.value, email.value, password.value);
  if (success) {
    router.push("/");
  }
};
</script>
