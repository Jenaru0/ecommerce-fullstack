// src/routes/auth.ts
import { Router } from "express";
import { register, login } from "../controllers/authController";

const router = Router();

router.post("/register", register);
router.post("/login", login); // Se implementará de forma similar para login

export default router;
