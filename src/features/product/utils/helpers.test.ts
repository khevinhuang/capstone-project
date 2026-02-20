import { describe, expect, it } from 'vitest';
import { filterProducts, generateProductID, sortProductByName, sortProductByPrice } from './helpers';
import type { Product } from '../types';

const products: Product[] = [
  {
    id: 1,
    name: 'Banana Chips',
    category: 'Snacks',
    price: 12,
    description: 'Sweet crispy banana',
    stock: 10,
    createAt: '2026-01-01',
    avatar: '',
  },
  {
    id: 2,
    name: 'Apple Juice',
    category: 'Beverage',
    price: 8,
    description: 'Fresh drink',
    stock: 5,
    createAt: '2026-01-02',
    avatar: '',
  },
  {
    id: 3,
    name: 'Carrot Cake',
    category: 'Bakery',
    price: 15,
    description: 'Delicious dessert',
    stock: 3,
    createAt: '2026-01-03',
    avatar: '',
  },
];

describe('product helpers', () => {
  it('generateProductID returns max id + 1', () => {
    expect(generateProductID(products)).toBe(4);
  });

  it('filterProducts matches query against name or description', () => {
    const byName = filterProducts(products, { searchQuery: 'apple' });
    const byDescription = filterProducts(products, { searchQuery: 'dessert' });

    expect(byName.map((p) => p.id)).toEqual([2]);
    expect(byDescription.map((p) => p.id)).toEqual([3]);
  });

  it('sortProductByName sorts ascending and descending', () => {
    const asc = sortProductByName(products, 'asc');
    const desc = sortProductByName(products, 'desc');

    expect(asc.map((p) => p.name)).toEqual(['Apple Juice', 'Banana Chips', 'Carrot Cake']);
    expect(desc.map((p) => p.name)).toEqual(['Carrot Cake', 'Banana Chips', 'Apple Juice']);
  });

  it('sortProductByPrice sorts ascending and descending', () => {
    const asc = sortProductByPrice(products, 'asc');
    const desc = sortProductByPrice(products, 'desc');

    expect(asc.map((p) => p.price)).toEqual([8, 12, 15]);
    expect(desc.map((p) => p.price)).toEqual([15, 12, 8]);
  });
});
