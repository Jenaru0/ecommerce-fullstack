<template>
  <section class="container mx-auto px-6 md:px-16 lg:px-24 py-16">
    <div class="bg-black py-12 px-6 md:px-16 lg:px-24 rounded-3xl">
      <div class="container mx-auto">
        <div
          class="flex flex-col md:flex-row justify-between items-center gap-8"
        >
          <h2 class="text-white text-3xl md:text-4xl font-black max-w-md">
            MANTENTE AL DÍA CON NUESTRAS ÚLTIMAS OFERTAS
          </h2>
          <div class="w-full md:w-auto flex flex-col sm:flex-row gap-4">
            <div class="relative flex-grow">
              <input
                type="email"
                v-model="email"
                placeholder="Introduce tu correo electrónico"
                class="w-full md:w-[320px] h-12 px-4 rounded-lg text-sm"
              />
            </div>
            <button
              @click="subscribe"
              class="h-12 px-6 bg-white text-black rounded-lg text-sm font-medium whitespace-nowrap hover:bg-gray-100 transition-colors"
            >
              Suscribirse al boletín
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";

const email = ref("");

const subscribe = () => {
  if (!email.value) return;

  // Aquí implementarías la lógica para suscribir al usuario
  console.log(`Suscribiendo al email: ${email.value}`);

  // Reseteamos el campo después de enviar
  email.value = "";
};
</script>
