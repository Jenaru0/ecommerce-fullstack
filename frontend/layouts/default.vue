<!-- frontend/layouts/default.vue -->
<template>
  <div class="min-h-screen flex flex-col">
    <NotificationBar />
    <Header />

    <main class="flex-grow bg-gray-50">
      <slot />
    </main>

    <Footer />
  </div>
</template>

<script setup>
// Los componentes se importan automáticamente gracias a la configuración de Nuxt
</script>
