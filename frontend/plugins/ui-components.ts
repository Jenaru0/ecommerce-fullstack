// filepath: c:\Users\jonna\OneDrive\Escritorio\ecommerce-fullstack\frontend\plugins\ui-components.ts
import { defineNuxtPlugin } from "#app";
import RatingStarsComponent from "~/components/ui/RatingStars.vue";

export default defineNuxtPlugin((nuxtApp) => {
  // Registrar componentes UI de forma global
  nuxtApp.vueApp.component("RatingStars", RatingStarsComponent);

  // Es importante devolver un objeto para que el plugin no se considere vacío
  return {
    provide: {
      // Puedes proporcionar utilidades relacionadas con UI si es necesario
    },
  };
});
