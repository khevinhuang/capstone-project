import { Product, ProductFilters } from '../types';

export function generateProductID(products: Array<Product>): number {
  const maxId = products.reduce((max, product) => Math.max(max, Number(product.id) || 0), 0);
  return maxId + 1;
}

export function filterProducts(products: Array<Product>, filters: ProductFilters): Array<Product> {
  return products.filter((product) => {
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesName = product.name.toLowerCase().includes(query);
      const matchesDescription = product.description.toLowerCase().includes(query);
      if (!matchesName && !matchesDescription) return false;
      return true;
    }
    return true;
  });
}

export function sortProductByName(
  products: Array<Product>,
  order: 'asc' | 'desc' = 'asc'
): Array<Product> {
  return [...products].sort((a, b) => {
    const comparison = a.name.localeCompare(b.name);
    return order === 'asc' ? comparison : -comparison;
  });
}

export function sortProductByPrice(
  products: Array<Product>,
  order: 'asc' | 'desc' = 'desc'
): Array<Product> {
  return [...products].sort((a, b) => {
    const priceA = parsePrice(a.price);
    const priceB = parsePrice(b.price);
    if (isNaN(priceA) && isNaN(priceB)) return 0;
    if (isNaN(priceA)) return 1;
    if (isNaN(priceB)) return -1;

    return order === 'desc' ? priceB - priceA : priceA - priceB;
  });
}

function parsePrice(price: string | number | undefined): number {
  if (typeof price === 'number') return price;
  if (!price) return NaN;
  const clean = String(price)
    .replace(/[^\d.]/g, '')
    .replace(/\.(?=.*\.)/g, '');
  return parseFloat(clean) || NaN;
}
