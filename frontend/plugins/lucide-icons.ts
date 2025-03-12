// filepath: c:\Users\jonna\OneDrive\Escritorio\ecommerce-fullstack\frontend\plugins\lucide-icons.ts
import { defineNuxtPlugin } from "#app";
import * as LucideIcons from "lucide-vue-next";

export default defineNuxtPlugin((nuxtApp) => {
  // Registrar iconos comúnmente utilizados
  const commonIcons = {
    CheckCircle: LucideIcons.CheckCircle,
    XCircle: LucideIcons.XCircle,
    AlertCircle: LucideIcons.AlertCircle,
    Info: LucideIcons.Info,
    AlertTriangle: LucideIcons.AlertTriangle,
    ShoppingCart: LucideIcons.ShoppingCart,
    Star: LucideIcons.Star,
    ChevronDown: LucideIcons.ChevronDown,
    ChevronRight: LucideIcons.ChevronRight,
    User: LucideIcons.User,
    Github: LucideIcons.Github,
    Twitter: LucideIcons.Twitter,
    Facebook: LucideIcons.Facebook,
    Instagram: LucideIcons.Instagram,
  };

  // Registrar los iconos como componentes globales
  Object.entries(commonIcons).forEach(([name, component]) => {
    nuxtApp.vueApp.component(name + "Icon", component);
  });

  return {
    provide: {
      // Proporcionar función para acceder a cualquier icono de Lucide
      icon: (name: string) =>
        LucideIcons[name as keyof typeof LucideIcons] || null,
    },
  };
});
