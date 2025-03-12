<template>
  <div class="container mx-auto px-6 md:px-16 lg:px-24 py-16">
    <div class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 class="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h1>

      <form @submit.prevent="handleLogin" class="space-y-4">
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
            class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3"
          />
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
          <span v-else>Iniciar Sesión</span>
        </button>
      </form>

      <p class="mt-4 text-center text-sm text-gray-600">
        ¿No tienes una cuenta?
        <NuxtLink to="/auth/register" class="text-indigo-600 hover:underline">
          Regístrate aquí
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuth } from "~/composables/useAuth";

const router = useRouter();
const route = useRoute();
const { login, loading, error } = useAuth();

const email = ref("");
const password = ref("");

// Intentar redireccionar al usuario a la página que intentaba visitar
const redirectPath = route.query.redirect || "/";

const handleLogin = async () => {
  const success = await login(email.value, password.value);
  if (success) {
    router.push(redirectPath);
  }
};
</script>
