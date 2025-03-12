<template>
  <section class="container mx-auto px-6 md:px-16 lg:px-24 py-16">
    <h2 class="text-3xl font-black text-center mb-10">EXPLORA POR ESTILO</h2>

    <div class="bg-gray-100 py-16 rounded-3xl">
      <div class="container mx-auto px-6 md:px-16 lg:px-24">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Primera fila - Tarjetas de igual ancho -->
          <NuxtLink
            to="/products?style=casual"
            class="relative bg-white rounded-2xl overflow-hidden group hover:shadow-lg transition-all duration-300"
          >
            <img
              src="/assets/images/styles/casual.jpg"
              alt="Ropa de estilo casual"
              class="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div class="absolute inset-0 p-8 flex items-start">
              <h3 class="text-3xl font-bold text-black">Casual</h3>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/products?style=formal"
            class="relative bg-white rounded-2xl overflow-hidden group hover:shadow-lg transition-all duration-300"
          >
            <img
              src="/assets/images/styles/formal.jpg"
              alt="Ropa de estilo formal"
              class="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div class="absolute inset-0 p-8 flex items-start">
              <h3 class="text-3xl font-bold text-black">Formal</h3>
            </div>
          </NuxtLink>

          <!-- Segunda fila -->
          <NuxtLink
            to="/products?style=fiesta"
            class="relative bg-white rounded-2xl overflow-hidden group hover:shadow-lg transition-all duration-300"
          >
            <img
              src="/assets/images/styles/fiesta.jpg"
              alt="Ropa de fiesta"
              class="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div class="absolute inset-0 p-8 flex items-start">
              <h3 class="text-3xl font-bold text-black">Fiesta</h3>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/products?style=deportiva"
            class="relative bg-white rounded-2xl overflow-hidden group hover:shadow-lg transition-all duration-300"
          >
            <img
              src="/assets/images/styles/deportiva.jpg"
              alt="Ropa deportiva"
              class="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div class="absolute inset-0 p-8 flex items-start">
              <h3 class="text-3xl font-bold text-black">Deportiva</h3>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
