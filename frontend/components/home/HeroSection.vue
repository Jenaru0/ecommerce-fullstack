<template>
  <section class="container mx-auto px-6 md:px-16 lg:px-24 py-12">
    <div class="flex flex-col lg:flex-row items-center">
      <!-- Contenido izquierdo -->
      <div class="lg:w-1/2 lg:pr-12 mb-10 lg:mb-0 relative">
        <div class="absolute -right-10 top-0 hidden lg:block">
          <div class="w-12 h-12 transform rotate-45">
            <div class="w-full h-full bg-black"></div>
          </div>
        </div>

        <h2
          class="text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tighter mb-6"
        >
          ENCUENTRA ROPA<br />
          QUE SE AJUSTE<br />
          A TU ESTILO
        </h2>

        <p class="text-gray-600 mb-8 max-w-lg">
          Explora nuestra diversa gama de prendas meticulosamente elaboradas,
          diseñadas para resaltar tu individualidad y adaptarse a tu sentido del
          estilo.
        </p>

        <button
          class="bg-black text-white font-medium py-3 px-8 rounded-full hover:bg-gray-900 transition"
        >
          Comprar Ahora
        </button>

        <div class="absolute -left-10 bottom-20 hidden lg:block">
          <div class="w-10 h-10 transform rotate-45">
            <div class="w-full h-full bg-black"></div>
          </div>
        </div>

        <!-- Estadísticas -->
        <div class="flex flex-col md:flex-row gap-8 md:gap-16 mt-16">
          <div>
            <h3 class="text-4xl font-bold">200+</h3>
            <p class="text-gray-600">Marcas Internacionales</p>
          </div>
          <div>
            <h3 class="text-4xl font-bold">2,000+</h3>
            <p class="text-gray-600">Productos de Alta Calidad</p>
          </div>
          <div>
            <h3 class="text-4xl font-bold">30,000+</h3>
            <p class="text-gray-600">Clientes Satisfechos</p>
          </div>
        </div>
      </div>

      <!-- Imagen derecha -->
      <div class="lg:w-1/2 relative">
        <img
          src="/assets/images/hero-models.png"
          alt="Modelos con ropa elegante"
          class="w-full h-auto object-cover"
        />
      </div>
    </div>
  </section>
</template>
