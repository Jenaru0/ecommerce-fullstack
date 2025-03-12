// filepath:
c:\Users\jonna\OneDrive\Escritorio\ecommerce-fullstack\frontend\pages\[...slug].vue
<template>
  <div class="container mx-auto px-6 md:px-16 lg:px-24 py-20 text-center">
    <div class="mb-8">
      <div class="text-6xl font-bold text-gray-300 mb-4">404</div>
      <h1 class="text-3xl font-bold mb-4">Página no encontrada</h1>
      <p class="text-gray-600 mb-8">
        Lo sentimos, la página que estás buscando no existe o ha sido movida.
      </p>
    </div>

    <div class="flex justify-center gap-4 flex-wrap">
      <NuxtLink
        to="/"
        class="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
      >
        Ir al inicio
      </NuxtLink>
      <NuxtLink
        to="/products"
        class="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300"
      >
        Ver productos
      </NuxtLink>
    </div>

    <div class="mt-12">
      <h2 class="text-xl font-semibold mb-4">
        ¿Buscabas alguno de estos enlaces?
      </h2>
      <div class="flex flex-col md:flex-row gap-6 justify-center">
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="font-medium">Categorías populares</h3>
          <ul class="mt-2 space-y-1">
            <li>
              <NuxtLink
                to="/products?category=Ropa"
                class="text-indigo-600 hover:underline"
              >
                Ropa
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/products?category=Calzado"
                class="text-indigo-600 hover:underline"
              >
                Calzado
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/products?category=Accesorios"
                class="text-indigo-600 hover:underline"
              >
                Accesorios
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="font-medium">Accesos rápidos</h3>
          <ul class="mt-2 space-y-1">
            <li>
              <NuxtLink to="/cart" class="text-indigo-600 hover:underline">
                Mi carrito
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/account" class="text-indigo-600 hover:underline">
                Mi cuenta
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/account/orders"
                class="text-indigo-600 hover:underline"
              >
                Mis pedidos
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Esta página captura todas las rutas no definidas con [...slug]
</script>
