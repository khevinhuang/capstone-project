import { mockProduct } from '../data/mock';
import { Product, ProductPayload } from '../types';

let productDb: Product[] = [...mockProduct];

function createHttpError(status: number, message: string) {
  const error = new Error(message) as Error & { response: { status: number } };
  error.response = { status };
  return error;
}

export const ProductService = {
  getAllProduct: async () => {
    return [...productDb];
  },

  getDetailProduct: async (id: Product['id']) => {
    const product = productDb.find((item) => item.id === id);
    if (!product) {
      throw createHttpError(404, 'Product not found');
    }
    return product;
  },

  create: async (payload: ProductPayload) => {
    const nextId = productDb.reduce((max, item) => Math.max(max, item.id), 0) + 1;
    const newProduct: Product = {
      id: nextId,
      name: payload.name.trim(),
      category: payload.category.trim(),
      description: payload.description.trim(),
      price: Number(payload.price) || 0,
      stock: Number(payload.stock) || 0,
      createAt: payload.createAt,
      avatar: payload.avatar ?? '',
    };
    productDb = [newProduct, ...productDb];
    return newProduct;
  },

  update: async (id: Product['id'], payload: ProductPayload) => {
    const index = productDb.findIndex((item) => item.id === id);
    if (index === -1) {
      throw createHttpError(404, 'Product not found');
    }

    const updated: Product = {
      ...productDb[index],
      name: payload.name.trim(),
      category: payload.category.trim(),
      description: payload.description.trim(),
      price: Number(payload.price) || 0,
      stock: Number(payload.stock) || 0,
      createAt: payload.createAt,
      avatar: payload.avatar ?? productDb[index].avatar ?? '',
    };
    productDb = productDb.map((item) => (item.id === id ? updated : item));
    return updated;
  },

  delete: async (id: Product['id']) => {
    const exists = productDb.some((item) => item.id === id);
    if (!exists) {
      throw createHttpError(404, 'Product not found');
    }
    productDb = productDb.filter((item) => item.id !== id);
  },
};
