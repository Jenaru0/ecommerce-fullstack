// src/dto/product.dto.ts
export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  stock: number;
}
