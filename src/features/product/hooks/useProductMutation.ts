import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProductService } from '../services/product.service';
import { Product, ProductPayload } from '../types';

export function useProductMutations() {
  const qc = useQueryClient();
  const create = useMutation({
    mutationFn: ProductService.create,
    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: ['products'] });
      const previous = qc.getQueriesData<Product[]>({ queryKey: ['products'] });
      qc.setQueriesData<Product[]>({ queryKey: ['products'] }, (old) => {
        if (!Array.isArray(old)) return old;
        const optimisticItem: Product = {
          id: -Date.now(),
          ...payload,
          avatar: payload.avatar ?? '',
        };
        return [optimisticItem, ...old];
      });
      return { previous };
    },
    onError: (_error, _payload, context) => {
      if (context?.previous?.length) {
        context.previous.forEach(([key, data]) => {
          qc.setQueryData(key, data);
        });
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
    },
  });
  const update = useMutation({
    mutationFn: ({ id, payload }: { id: Product['id']; payload: ProductPayload }) =>
      ProductService.update(id, payload),
    onMutate: async (variables) => {
      await qc.cancelQueries({ queryKey: ['products'] });
      const previous = qc.getQueriesData<Product[]>({ queryKey: ['products'] });
      qc.setQueriesData<Product[]>({ queryKey: ['products'] }, (old) => {
        if (!Array.isArray(old)) return old;
        return old.map((item) =>
          item.id === variables.id ? { ...item, ...variables.payload } : item
        );
      });
      return { previous };
    },
    onError: (_error, _payload, context) => {
      if (context?.previous?.length) {
        context.previous.forEach(([key, data]) => {
          qc.setQueryData(key, data);
        });
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
    },
  });
  const remove = useMutation({
    mutationFn: ProductService.delete,
    onMutate: async (id: Product['id']) => {
      await qc.cancelQueries({ queryKey: ['products'] });
      const previous = qc.getQueriesData<Product[]>({ queryKey: ['products'] });
      qc.setQueriesData<Product[]>({ queryKey: ['products'] }, (old) => {
        if (!Array.isArray(old)) return old;
        return old.filter((item) => item.id !== id);
      });
      return { previous };
    },
    onError: (_error, _payload, context) => {
      if (context?.previous?.length) {
        context.previous.forEach(([key, data]) => {
          qc.setQueryData(key, data);
        });
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
    },
  });

  return { create, update, remove };
}
