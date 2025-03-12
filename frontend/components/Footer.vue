<!-- frontend/components/Footer.vue -->
<template>
  <section
    class="container mx-auto px-6 md:px-16 lg:px-24 py-16 border-t border-gray-200"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
      <!-- Columna de Marca -->
      <div class="lg:col-span-1">
        <h2 class="text-2xl font-black mb-4">SHOP.CO</h2>
        <p class="text-gray-600 text-sm mb-6">
          Tenemos ropa que se adapta a tu estilo y de la que te sentirás
          orgulloso al usar. Desde moda para mujeres hasta hombres.
        </p>
        <div class="flex space-x-4">
          <a href="#" class="text-gray-600 hover:text-black">
            <TwitterIcon class="w-5 h-5" />
          </a>
          <a href="#" class="text-gray-600 hover:text-black">
            <FacebookIcon class="w-5 h-5" />
          </a>
          <a href="#" class="text-gray-600 hover:text-black">
            <InstagramIcon class="w-5 h-5" />
          </a>
          <a href="#" class="text-gray-600 hover:text-black">
            <GithubIcon class="w-5 h-5" />
          </a>
        </div>
      </div>

      <!-- Columna de Empresa -->
      <div>
        <h3 class="font-bold mb-4">EMPRESA</h3>
        <ul class="space-y-3">
          <li>
            <NuxtLink to="/about" class="text-gray-600 hover:text-black text-sm"
              >Acerca de</NuxtLink
            >
          </li>
          <li>
            <NuxtLink
              to="/features"
              class="text-gray-600 hover:text-black text-sm"
              >Características</NuxtLink
            >
          </li>
          <li>
            <NuxtLink to="/works" class="text-gray-600 hover:text-black text-sm"
              >Trabajos</NuxtLink
            >
          </li>
          <li>
            <NuxtLink
              to="/careers"
              class="text-gray-600 hover:text-black text-sm"
              >Empleo</NuxtLink
            >
          </li>
        </ul>
      </div>

      <!-- Columna de Ayuda -->
      <div>
        <h3 class="font-bold mb-4">AYUDA</h3>
        <ul class="space-y-3">
          <li>
            <NuxtLink
              to="/support"
              class="text-gray-600 hover:text-black text-sm"
              >Atención al Cliente</NuxtLink
            >
          </li>
          <li>
            <NuxtLink
              to="/delivery"
              class="text-gray-600 hover:text-black text-sm"
              >Detalles de Envío</NuxtLink
            >
          </li>
          <li>
            <NuxtLink to="/terms" class="text-gray-600 hover:text-black text-sm"
              >Términos y Condiciones</NuxtLink
            >
          </li>
          <li>
            <NuxtLink
              to="/privacy"
              class="text-gray-600 hover:text-black text-sm"
              >Política de Privacidad</NuxtLink
            >
          </li>
        </ul>
      </div>

      <!-- Columna de Preguntas Frecuentes -->
      <div>
        <h3 class="font-bold mb-4">PREGUNTAS FRECUENTES</h3>
        <ul class="space-y-3">
          <li>
            <NuxtLink
              to="/account/faq"
              class="text-gray-600 hover:text-black text-sm"
              >Cuenta</NuxtLink
            >
          </li>
          <li>
            <NuxtLink
              to="/deliveries"
              class="text-gray-600 hover:text-black text-sm"
              >Gestionar Envíos</NuxtLink
            >
          </li>
          <li>
            <NuxtLink
              to="/orders"
              class="text-gray-600 hover:text-black text-sm"
              >Pedidos</NuxtLink
            >
          </li>
          <li>
            <NuxtLink
              to="/payments"
              class="text-gray-600 hover:text-black text-sm"
              >Pagos</NuxtLink
            >
          </li>
        </ul>
      </div>

      <!-- Columna de Recursos -->
      <div>
        <h3 class="font-bold mb-4">RECURSOS</h3>
        <ul class="space-y-3">
          <li>
            <NuxtLink
              to="/ebooks"
              class="text-gray-600 hover:text-black text-sm"
              >eBooks Gratuitos</NuxtLink
            >
          </li>
          <li>
            <NuxtLink
              to="/tutorials"
              class="text-gray-600 hover:text-black text-sm"
              >Tutoriales</NuxtLink
            >
          </li>
          <li>
            <NuxtLink to="/blog" class="text-gray-600 hover:text-black text-sm"
              >Blog</NuxtLink
            >
          </li>
          <li>
            <NuxtLink
              to="/videos"
              class="text-gray-600 hover:text-black text-sm"
              >Videos</NuxtLink
            >
          </li>
        </ul>
      </div>
    </div>

    <!-- Pie del Footer -->
    <div class="pt-8 border-t border-gray-200">
      <div class="flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-sm text-gray-600">
          Shop.co © 2000-2024, Todos los Derechos Reservados
        </p>
        <div class="flex items-center gap-3">
          <img src="/assets/images/payment/visa.svg" alt="Visa" class="h-8" />
          <img
            src="/assets/images/payment/mastercard.svg"
            alt="Mastercard"
            class="h-8"
          />
          <img
            src="/assets/images/payment/paypal.svg"
            alt="PayPal"
            class="h-8"
          />
          <img
            src="/assets/images/payment/apple-pay.svg"
            alt="Apple Pay"
            class="h-8"
          />
          <img
            src="/assets/images/payment/google-pay.svg"
            alt="Google Pay"
            class="h-8"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Github as GithubIcon,
} from "lucide-vue-next";
</script>
