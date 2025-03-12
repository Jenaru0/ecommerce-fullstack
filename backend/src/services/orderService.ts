import { prismaClient } from "../utils/prismaClient";
import { Prisma } from "@prisma/client";

// Tipado fuerte para los parámetros
export interface OrderItemInput {
  productId: string; // UUID como string
  quantity: number;
}

// Interfaces para estructuras internas
interface OrderItemCreate {
  quantity: number;
  price: number;
  product: {
    connect: { id: string };
  };
}

interface StockUpdate {
  id: string;
  quantity: number;
}

export class OrderService {
  async getOrders() {
    return prismaClient.order.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getOrdersByUser(userId: number) {
    return prismaClient.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getOrderById(id: number, userId?: number) {
    const query: Prisma.OrderWhereInput = { id };

    // Si se proporciona userId, solo devuelve órdenes de ese usuario
    if (userId !== undefined) {
      query.userId = userId;
    }

    return prismaClient.order.findFirst({
      where: query,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async createOrder(userId: number, items: OrderItemInput[]) {
    // Verificar stock y calcular total
    let total = 0;
    const orderItems: OrderItemCreate[] = [];
    const stockUpdates: StockUpdate[] = [];

    // Primero validar todos los productos y stock
    for (const item of items) {
      const product = await prismaClient.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new Error(`Producto con ID ${item.productId} no encontrado`);
      }

      if (product.stock < item.quantity) {
        throw new Error(
          `Stock insuficiente para ${product.name}. Disponible: ${product.stock}`
        );
      }

      const itemTotal = product.price.toNumber() * item.quantity;
      total += itemTotal;

      orderItems.push({
        quantity: item.quantity,
        price: product.price.toNumber(),
        product: {
          connect: { id: item.productId },
        },
      });

      stockUpdates.push({
        id: item.productId,
        quantity: item.quantity,
      });
    }

    // Crear la orden y actualizar stock usando transacción
    return prismaClient.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId,
          total,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      // Actualizar stock de productos en una sola operación
      for (const update of stockUpdates) {
        await tx.product.update({
          where: { id: update.id },
          data: { stock: { decrement: update.quantity } },
        });
      }

      return order;
    });
  }

  async updateOrderStatus(id: number, status: string) {
    return prismaClient.order.update({
      where: { id },
      data: { status },
    });
  }

  async cancelOrder(id: number, userId: number, isAdmin: boolean) {
    // Primero verificar que la orden existe y pertenece al usuario
    const order = isAdmin
      ? await prismaClient.order.findUnique({ where: { id } })
      : await prismaClient.order.findFirst({ where: { id, userId } });

    if (!order) {
      throw new Error(
        "Orden no encontrada o no tienes permisos para cancelarla"
      );
    }

    if (order.status !== "Pendiente") {
      throw new Error("Solo se pueden cancelar órdenes pendientes");
    }

    // Actualizar el estado de la orden
    const updatedOrder = await prismaClient.order.update({
      where: { id },
      data: { status: "Cancelado" },
      include: {
        items: true,
      },
    });

    // Restaurar el stock de los productos
    for (const item of updatedOrder.items) {
      await prismaClient.product.update({
        where: { id: item.productId },
        data: {
          stock: { increment: item.quantity },
        },
      });
    }

    return updatedOrder;
  }
}

// Instancia única para usar en toda la aplicación
export const orderService = new OrderService();
