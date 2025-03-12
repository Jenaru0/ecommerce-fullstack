// src/routes/index.ts - Router central
import { Router } from "express";
import authRoutes from "./auth";
import productRoutes from "./product";
import orderRoutes from "./order";
import userRoutes from "./user";
import docsRoutes from "./docs"; // Importar las rutas de documentación

const router = Router();

// Documentación API
router.use("/docs", docsRoutes);

// Agrupación de rutas por funcionalidad
router.use("/auth", authRoutes); // Rutas de autenticación (login/registro)
router.use("/products", productRoutes); // Rutas de productos
router.use("/orders", orderRoutes); // Rutas de órdenes/pedidos
router.use("/users", userRoutes); // Rutas de usuarios

export default router;
