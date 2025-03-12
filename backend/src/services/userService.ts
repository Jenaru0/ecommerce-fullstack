// src/services/userService.ts
import { prismaClient } from "../utils/prismaClient";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export class UserService {
  async findByEmail(email: string) {
    return prismaClient.user.findUnique({ where: { email } });
  }

  async create(userData: { email: string; password: string; name?: string }) {
    const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);

    return prismaClient.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
  }
}

// Singleton para usar en toda la app
export const userService = new UserService();
