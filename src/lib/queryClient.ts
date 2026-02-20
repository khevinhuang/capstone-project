import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error) => {
        if (error instanceof Error && 'status' in error) {
          const status = (error as { status?: number }).status;
          if (status === 404 || status === 403 || status === 401) {
            return false;
          }
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});

queryClient.getQueryCache().config.onError = (error) => {
  console.error('Query Error:', error);
};

queryClient.getMutationCache().config.onError = (error) => {
  console.error('Mutation Error:', error);
};
