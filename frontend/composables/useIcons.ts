// filepath: c:\Users\jonna\OneDrive\Escritorio\ecommerce-fullstack\frontend\composables\useIcons.ts
/**
 * Composable para proveer acceso centralizado a iconos utilizados en la aplicación
 * Ayuda a evitar importaciones repetitivas en múltiples componentes
 */
import * as LucideIcons from "lucide-vue-next";

export function useIcons() {
  return {
    // Iconos de navegación
    ChevronDown: LucideIcons.ChevronDown,
    ChevronRight: LucideIcons.ChevronRight,
    Search: LucideIcons.Search,
    ShoppingCart: LucideIcons.ShoppingCart,
    User: LucideIcons.User,

    // Iconos para el proceso de compra
    Loader: LucideIcons.Loader,
    AlertCircle: LucideIcons.AlertCircle,
    CheckCircle: LucideIcons.CheckCircle,

    // Iconos para reseñas y calificaciones
    Star: LucideIcons.Star,

    // Iconos sociales
    Facebook: LucideIcons.Facebook,
    Twitter: LucideIcons.Twitter,
    Instagram: LucideIcons.Instagram,
    Github: LucideIcons.Github,

    // Obtener cualquier icono por nombre
    getIcon(name: string): any {
      return LucideIcons[name as keyof typeof LucideIcons] || null;
    },
  };
}
