import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ProductService } from '../services/product.service';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => ProductService.getAllProduct(),
    placeholderData: keepPreviousData,
  });
}
