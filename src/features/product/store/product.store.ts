import { create } from 'zustand';
import type { CreateProductInput, Product, UpdateProductInput } from '../types';
import { mockProduct } from '../data/mock';
import { generateProductID } from '../utils/helpers';

type ProductDraft = Partial<
  Pick<CreateProductInput, 'name' | 'price' | 'category' | 'description' | 'stock' | 'createAt'>
>;

interface ProductStoreState {
  products: Array<Product>;
  addDraft: ProductDraft;
  updateDrafts: Record<string, ProductDraft>;
  setProduct: (products: Array<Product>) => void;
  addProduct: (input: CreateProductInput) => Product;
  updateProduct: (id: Product['id'], updates: UpdateProductInput) => void;
  deleteProduct: (id: Product['id']) => void;
  setAddDraft: (draft: ProductDraft) => void;
  clearAddDraft: () => void;
  setUpdateDraft: (id: Product['id'], draft: ProductDraft) => void;
  clearUpdateDraft: (id: Product['id']) => void;
}

export const useProductStore = create<ProductStoreState>((set) => ({
  products: mockProduct,
  addDraft: {},
  updateDrafts: {},
  setProduct: (products) => set({ products }),
  addProduct: (input) => {
    const stockValue = Number(input.stock);
    const priceValue = Number(input.price);
    const newProduct: Product = {
      id: generateProductID(useProductStore.getState().products),
      name: input.name.trim(),
      category: input.category.trim(),
      price: Number.isNaN(priceValue) ? 0 : priceValue,
      description: input.description.trim(),
      stock: Number.isNaN(stockValue) ? 0 : stockValue,
      createAt: input.createAt || new Date().toISOString(),
      avatar: '',
    };
    set((state) => ({ products: [newProduct, ...state.products] }));
    return newProduct;
  },
  updateProduct: (id, updates) =>
    set((state) => ({
      products: state.products.map((product) => {
        if (product.id !== id) return product;
        const stockValue = updates.stock !== undefined ? Number(updates.stock) : product.stock;
        const priceValue = updates.price !== undefined ? Number(updates.price) : product.price;
        return {
          ...product,
          ...updates,
          category: updates.category?.trim() ?? product.category,
          description: updates.description?.trim() ?? product.description,
          price: Number.isNaN(priceValue) ? product.price : priceValue,
          stock: Number.isNaN(stockValue) ? product.stock : stockValue,
          createAt: updates.createAt ?? product.createAt,
        };
      }),
    })),
  deleteProduct: (id) =>
    set((state) => ({ products: state.products.filter((product) => product.id !== id) })),
  setAddDraft: (draft) => set({ addDraft: draft }),
  clearAddDraft: () => set({ addDraft: {} }),
  setUpdateDraft: (id, draft) =>
    set((state) => ({ updateDrafts: { ...state.updateDrafts, [String(id)]: draft } })),
  clearUpdateDraft: (id) =>
    set((state) => {
      const next = { ...state.updateDrafts };
      delete next[String(id)];
      return { updateDrafts: next };
    }),
}));
