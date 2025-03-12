<template>
  <div>
    <HeroSection />
    <BrandsSection />
    <NewArrivalsSection
      :products="newArrivals"
      :loading="loadingNew"
      :error="errorNew"
    />
    <TopSellingSection
      :products="topSelling"
      :loading="loadingTop"
      :error="errorTop"
    />
    <StylesSection />
    <NewsletterSection />
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useHomeProducts } from "~/composables/useHomeProducts";

// Importar los componentes de secciones
import HeroSection from "~/components/home/HeroSection.vue";
import BrandsSection from "~/components/home/BrandsSection.vue";
import NewArrivalsSection from "~/components/home/NewArrivalsSection.vue";
import TopSellingSection from "~/components/home/TopSellingSection.vue";
import StylesSection from "~/components/home/StylesSection.vue";
import NewsletterSection from "~/components/home/NewsletterSection.vue";

// Usar el composable para manejar los productos
const {
  newArrivals,
  loadingNew,
  errorNew,
  topSelling,
  loadingTop,
  errorTop,
  loadNewArrivals,
  loadTopSelling,
} = useHomeProducts();

// Cargar los datos al montar el componente
onMounted(() => {
  loadNewArrivals();
  loadTopSelling();
});
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap");

body {
  font-family: "Inter", sans-serif;
}

/* Estilos específicos para las marcas */
.font-serif {
  font-family: "Times New Roman", serif;
}
</style>
