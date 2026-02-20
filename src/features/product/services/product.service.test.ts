import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ProductPayload } from '../types';

async function loadModules() {
  vi.resetModules();
  const [{ ProductService }, { mockProduct }] = await Promise.all([
    import('./product.service'),
    import('../data/mock'),
  ]);
  return { ProductService, mockProduct };
}

const basePayload: ProductPayload = {
  name: '  New Product  ',
  category: '  Kitchen  ',
  description: '  Product Description  ',
  price: 123,
  stock: 7,
  createAt: '2026-02-20T00:00:00.000Z',
  avatar: '',
};

describe('ProductService', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('getAllProduct returns initial products', async () => {
    const { ProductService, mockProduct } = await loadModules();
    const data = await ProductService.getAllProduct();
    expect(data.length).toBe(mockProduct.length);
  });

  it('create adds a new product and trims text fields', async () => {
    const { ProductService } = await loadModules();
    const before = await ProductService.getAllProduct();

    const created = await ProductService.create(basePayload);
    const after = await ProductService.getAllProduct();

    expect(created.id).toBeGreaterThan(0);
    expect(created.name).toBe('New Product');
    expect(created.category).toBe('Kitchen');
    expect(created.description).toBe('Product Description');
    expect(after.length).toBe(before.length + 1);
    expect(after[0].id).toBe(created.id);
  });

  it('update modifies existing product', async () => {
    const { ProductService } = await loadModules();
    const products = await ProductService.getAllProduct();
    const target = products[0];

    const updated = await ProductService.update(target.id, {
      ...basePayload,
      name: '  Updated Name  ',
      category: '  Updated Category  ',
    });

    expect(updated.name).toBe('Updated Name');
    expect(updated.category).toBe('Updated Category');
  });

  it('delete removes existing product', async () => {
    const { ProductService } = await loadModules();
    const products = await ProductService.getAllProduct();
    const targetId = products[0].id;

    await ProductService.delete(targetId);

    await expect(ProductService.getDetailProduct(targetId)).rejects.toMatchObject({
      response: { status: 404 },
    });
  });

  it('throws 404 when update target does not exist', async () => {
    const { ProductService } = await loadModules();
    await expect(ProductService.update(-9999, basePayload)).rejects.toMatchObject({
      response: { status: 404 },
    });
  });

  it('throws 404 when delete target does not exist', async () => {
    const { ProductService } = await loadModules();
    await expect(ProductService.delete(-9999)).rejects.toMatchObject({
      response: { status: 404 },
    });
  });
});
