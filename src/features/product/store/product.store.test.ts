import { beforeEach, describe, expect, it } from 'vitest';
import { useProductStore } from './product.store';

describe('useProductStore', () => {
  beforeEach(() => {
    useProductStore.setState({
      products: [],
      addDraft: {},
      updateDrafts: {},
    });
  });

  it('addProduct creates product with sanitized values', () => {
    const created = useProductStore.getState().addProduct({
      name: '  Test Product  ',
      category: '  Kitchen  ',
      description: '  Desc  ',
      price: '100',
      stock: '3',
      createAt: '2026-01-01',
    });

    expect(created.id).toBe(1);
    expect(created.name).toBe('Test Product');
    expect(created.category).toBe('Kitchen');
    expect(created.description).toBe('Desc');
    expect(created.price).toBe(100);
    expect(created.stock).toBe(3);
    expect(useProductStore.getState().products.length).toBe(1);
  });

  it('updateProduct updates matching product only', () => {
    const first = useProductStore.getState().addProduct({
      name: 'First',
      category: 'A',
      description: 'A',
      price: '10',
      stock: '1',
      createAt: '2026-01-01',
    });
    const second = useProductStore.getState().addProduct({
      name: 'Second',
      category: 'B',
      description: 'B',
      price: '20',
      stock: '2',
      createAt: '2026-01-02',
    });

    useProductStore.getState().updateProduct(first.id, {
      name: '  First Updated  ',
      price: '30',
      stock: '5',
    });

    const products = useProductStore.getState().products;
    const updated = products.find((p) => p.id === first.id)!;
    const untouched = products.find((p) => p.id === second.id)!;

    expect(updated.name).toBe('  First Updated  ');
    expect(updated.price).toBe(30);
    expect(updated.stock).toBe(5);
    expect(untouched.name).toBe('Second');
  });

  it('set and clear update draft by id', () => {
    useProductStore.getState().setUpdateDraft(10, { name: 'Draft Name' });
    expect(useProductStore.getState().updateDrafts['10']).toEqual({ name: 'Draft Name' });

    useProductStore.getState().clearUpdateDraft(10);
    expect(useProductStore.getState().updateDrafts['10']).toBeUndefined();
  });

  it('set and clear add draft', () => {
    useProductStore.getState().setAddDraft({ name: 'Draft Add' });
    expect(useProductStore.getState().addDraft).toEqual({ name: 'Draft Add' });

    useProductStore.getState().clearAddDraft();
    expect(useProductStore.getState().addDraft).toEqual({});
  });
});
