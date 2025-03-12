// filepath: c:\Users\jonna\OneDrive\Escritorio\ecommerce-fullstack\backend\prisma\seed.ts
import { PrismaClient, Prisma } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando seed...");

  // Crear usuario admin
  console.log("Creando usuario admin...");
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      password: await bcrypt.hash("admin123", 12),
      name: "Administrador",
      role: "admin",
    },
  });

  // Crear usuario cliente de prueba
  console.log("Creando usuario cliente...");
  await prisma.user.upsert({
    where: { email: "cliente@example.com" },
    update: {},
    create: {
      email: "cliente@example.com",
      password: await bcrypt.hash("cliente123", 12),
      name: "Cliente Prueba",
      role: "cliente",
    },
  });

  // Crear categorías
  console.log("Creando categorías...");
  const categoriesData = [
    { name: "Ropa", description: "Prendas de vestir para todas las ocasiones" },
    {
      name: "Calzado",
      description: "Todo tipo de calzado para hombre y mujer",
    },
    { name: "Accesorios", description: "Complementos para tus looks" },
  ];

  const categories = [];
  for (const categoryData of categoriesData) {
    const category = await prisma.category.upsert({
      where: { name: categoryData.name },
      update: {},
      create: categoryData,
    });
    categories.push(category);
  }

  // Limpiar productos y relaciones existentes para evitar duplicados
  console.log("Limpiando datos existentes...");
  await prisma.review.deleteMany({});
  await prisma.categoryOnProduct.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});

  // Crear productos de ejemplo con datos completos según el esquema
  console.log("Creando productos...");
  const products = [
    {
      name: "Camiseta básica negra",
      description: "Camiseta de algodón 100% en color negro con corte clásico",
      fullDescription:
        "Esta camiseta básica negra está confeccionada con algodón orgánico de alta calidad. Perfecta para cualquier ocasión, su diseño minimalista y versátil la convierte en una pieza esencial para tu armario.",
      price: new Prisma.Decimal(19.99),
      imageUrl:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      additionalImages: [
        "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      ],
      stock: 50,
      category: "Ropa",
      rating: 4.5,
      reviewsCount: 120, // Corregido de reviewCount a reviewsCount
      features: ["Algodón 100%", "Lavable a máquina", "Ajuste regular"],
      specifications: {
        material: "Algodón orgánico",
        cuidado: "Lavado a máquina en frío",
        origen: "Importado",
      },
      isNewArrival: true,
    },
    {
      name: "Jeans slim fit",
      description: "Jeans azul oscuro con corte slim y cintura media",
      fullDescription:
        "Estos jeans slim fit están diseñados para ofrecer comodidad y estilo. Confeccionados con denim de alta calidad con un toque de elasticidad para mayor comodidad durante todo el día.",
      price: new Prisma.Decimal(49.99),
      originalPrice: new Prisma.Decimal(69.99),
      imageUrl:
        "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      additionalImages: [],
      stock: 30,
      category: "Ropa",
      rating: 4.2,
      reviewsCount: 85,
      features: ["98% algodón, 2% elastano", "Cintura media", "Corte slim"],
      isNewArrival: false,
    },
    {
      name: "Zapatillas deportivas",
      description: "Zapatillas ligeras para running con suela amortiguadora",
      fullDescription:
        "Estas zapatillas deportivas están diseñadas para ofrecer el máximo rendimiento y comodidad. Su suela de EVA proporciona una excelente amortiguación, mientras que el upper de malla transpirable mantiene tus pies frescos incluso durante los entrenamientos más intensos.",
      price: new Prisma.Decimal(89.99),
      originalPrice: new Prisma.Decimal(109.99),
      imageUrl:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      additionalImages: [
        "https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      ],
      stock: 25,
      category: "Calzado",
      rating: 4.7,
      reviewsCount: 215,
      features: ["Malla transpirable", "Suela de goma", "Plantilla acolchada"],
      isNewArrival: true,
    },
    {
      name: "Chaqueta vaquera",
      description: "Chaqueta vaquera clásica con botones metálicos",
      fullDescription:
        "Una chaqueta vaquera atemporal con un ajuste relajado. Perfecta para cualquier estación, esta chaqueta es un básico del armario que nunca pasa de moda.",
      price: new Prisma.Decimal(79.99),
      imageUrl:
        "https://images.unsplash.com/photo-1601333144130-8cbb312386b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      additionalImages: [],
      stock: 15,
      category: "Ropa",
      rating: 4.4,
      reviewsCount: 78,
      features: ["100% algodón", "Botones metálicos", "Bolsillos frontales"],
      isNewArrival: false,
    },
    {
      name: "Reloj minimalista",
      description: "Reloj de pulsera con diseño minimalista y correa de cuero",
      fullDescription:
        "Este elegante reloj minimalista combina funcionalidad y estilo con su esfera limpia y correa de cuero genuino. Perfecto para uso diario o como complemento para ocasiones especiales.",
      price: new Prisma.Decimal(129.99),
      originalPrice: new Prisma.Decimal(149.99),
      imageUrl:
        "https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      additionalImages: [],
      stock: 10,
      category: "Accesorios",
      rating: 4.8,
      reviewsCount: 92,
      features: [
        "Correa de cuero genuino",
        "Resistente al agua",
        "Movimiento de cuarzo",
      ],
      specifications: {
        material: "Acero inoxidable y cuero",
        resistenciaAgua: "3 ATM",
        garantía: "2 años",
      },
      isNewArrival: true,
    },
  ];

  // Insertar productos y asociarlos con categorías
  for (const productData of products) {
    const { category: categoryName, ...data } = productData;

    console.log(`Creando producto: ${data.name}`);
    const product = await prisma.product.create({
      data: {
        ...data,
        faqs: {
          "¿Cómo debo cuidar este producto?":
            "Sigue las instrucciones de la etiqueta para un cuidado óptimo.",
          "¿Cuál es la política de devolución?":
            "Aceptamos devoluciones dentro de los 30 días posteriores a la compra.",
        },
        // Añadir campos faltantes que tienen valores por defecto
        variants:
          productData.category === "Ropa"
            ? {
                colors: ["Negro", "Azul", "Blanco"],
                sizes: ["S", "M", "L", "XL"],
              }
            : Prisma.JsonNull, // Usar Prisma.JsonNull en lugar de null
      },
    });

    if (categoryName) {
      const category = await prisma.category.findUnique({
        where: { name: categoryName },
      });

      if (category) {
        await prisma.categoryOnProduct.create({
          data: {
            productId: product.id,
            categoryId: category.id,
          },
        });
      }
    }
  }

  // Crear algunas reseñas para los productos
  console.log("Creando reseñas...");
  const users = await prisma.user.findMany();
  const allProducts = await prisma.product.findMany();

  for (const product of allProducts) {
    // Crear entre 2 y 5 reseñas por producto
    const reviewsCount = Math.floor(Math.random() * 4) + 2;

    for (let i = 0; i < reviewsCount; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const rating = Math.floor(Math.random() * 3) + 3; // Ratings entre 3-5

      await prisma.review.create({
        data: {
          rating,
          comment: `Esta es una reseña de ejemplo para ${
            product.name
          }. La calidad es ${rating >= 4 ? "excelente" : "buena"}.`,
          userId: user.id,
          productId: product.id,
        },
      });
    }
  }

  console.log("✅ Base de datos poblada con éxito");
}

main()
  .catch((e) => {
    console.error("Error durante el seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
