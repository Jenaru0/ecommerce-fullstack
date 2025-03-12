// backend/src/services/productService.ts
import { prismaClient } from "../utils/prismaClient";
import { Decimal } from "@prisma/client/runtime/library";

export class ProductService {
  async getAll(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;

    return await prismaClient.product.findMany({
      take: limit,
      skip,
      orderBy: { createdAt: "desc" },
    });
  }

  async getNewArrivals(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;

    return await prismaClient.product.findMany({
      // Usar createdAt para determinar nuevos productos en lugar de isNewArrival
      orderBy: { createdAt: "desc" },
      take: limit,
      skip,
    });
  }

  async getTopSelling(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;

    // Obtener IDs de productos más vendidos
    const products = await prismaClient.orderItem.groupBy({
      by: ["productId"],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: limit,
      skip,
    });

    // Extraer los IDs en orden
    const productIds = products.map((p) => p.productId);

    // Si no hay productos, devolver array vacío
    if (!productIds.length) return [];

    // Obtener los productos completos
    const fullProducts = await prismaClient.product.findMany({
      where: {
        id: { in: productIds },
      },
    });

    // Ordenar manualmente según el orden de productIds
    return fullProducts.sort((a, b) => {
      return productIds.indexOf(a.id) - productIds.indexOf(b.id);
    });
  }

  async getById(id: string) {
    try {
      const product = await prismaClient.product.findUnique({
        where: { id },
        include: {
          reviews: {
            include: {
              user: {
                select: {
                  name: true,
                },
              },
            },
            take: 5, // Limitar a 5 reseñas iniciales
          },
          categories: {
            include: {
              category: true,
            },
          },
        },
      });

      if (product) {
        // Transformar datos para frontend
        const categories = product.categories.map((cp) => cp.category);

        return {
          ...product,
          categories,
          reviewsCount: await prismaClient.review.count({
            where: { productId: id },
          }),
        };
      }

      return null;
    } catch (error) {
      console.error("Error en getById:", error);
      throw error;
    }
  }

  async getProductReviews(productId: string, sort: string = "newest") {
    try {
      let orderBy: any = { createdAt: "desc" }; // Predeterminado: más recientes

      if (sort === "rating_desc") {
        orderBy = { rating: "desc" };
      } else if (sort === "rating_asc") {
        orderBy = { rating: "asc" };
      }

      return await prismaClient.review.findMany({
        where: { productId },
        orderBy,
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      });
    } catch (error) {
      console.error("Error en getProductReviews:", error);
      throw error;
    }
  }

  async createReview(data: {
    rating: number;
    comment: string;
    userId: number;
    productId: string;
  }) {
    const { rating, comment, userId, productId } = data;

    return await prismaClient.$transaction(async (tx) => {
      // Crear la reseña
      const review = await tx.review.create({
        data: {
          rating,
          comment,
          userId,
          productId,
        },
      });

      // Actualizar la calificación promedio y contar del producto
      const reviews = await tx.review.findMany({
        where: { productId },
      });

      const avgRating =
        reviews.reduce((sum, review) => sum + review.rating, 0) /
        reviews.length;

      await tx.product.update({
        where: { id: productId },
        data: {
          rating: avgRating,
          reviewsCount: reviews.length,
        },
      });

      return review;
    });
  }

  async create(data: {
    name: string;
    description?: string; // Cambiar a opcional
    price: number;
    imageUrl?: string; // Cambiar a opcional
    stock: number;
  }) {
    // Asegúrate de tener valores por defecto para campos opcionales
    const productData = {
      name: data.name,
      description: data.description || "", // Valor por defecto vacío
      price: new Decimal(data.price), // Convertir a Decimal
      imageUrl: data.imageUrl || "", // Valor por defecto vacío
      stock: data.stock,
    };

    return prismaClient.product.create({
      data: productData,
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      description?: string;
      price?: number;
      imageUrl?: string;
      stock?: number;
    }
  ) {
    const updateData: any = { ...data };

    // Convertir price a Decimal si está presente
    if (data.price !== undefined) {
      updateData.price = new Decimal(data.price);
    }

    return prismaClient.product.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string) {
    // Cambiar de number a string
    return prismaClient.product.delete({
      where: { id },
    });
  }
}
