import { infiniteQueryOptions } from '@tanstack/react-query'
import { fetchProducts } from './api/products'

export const productsQuery = (q: string) =>
  infiniteQueryOptions({
    queryKey: ['products', { q }],
    queryFn: ({ pageParam }) => fetchProducts(q, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    refetchInterval: 5000,
  })
