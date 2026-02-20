export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  stock: number;
  createAt: string;
  avatar: string;
}

export interface ProductPayload {
  name: string;
  price: number;
  category: string;
  stock: number;
  description: string;
  createAt: string;
  avatar?: string;
}

export interface ProductFilters {
  searchQuery?: string;
}

import { z } from 'zod';

export const createProductInputSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  price: z.string().min(1),
  description: z.string().min(1).max(100),
  category: z.string().min(1).max(50),
  stock: z.string().min(1),
  createAt: z.string().min(1),
});

export type CreateProductInput = z.infer<typeof createProductInputSchema>;

export type UpdateProductInput = Partial<CreateProductInput>;
