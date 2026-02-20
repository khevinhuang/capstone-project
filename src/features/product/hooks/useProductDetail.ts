import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ProductService } from '../services/product.service';
import type { Product } from '../types';

export function useProductDetail(id?: string, enabled = true) {
  const parseId: Product['id'] | undefined =
    id && !Number.isNaN(Number(id)) ? Number(id) : undefined;
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => ProductService.getDetailProduct(parseId!),
    enabled: parseId !== undefined && enabled,
    placeholderData: keepPreviousData,
  });
}
