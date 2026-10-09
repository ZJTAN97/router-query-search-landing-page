import { queryOptions } from '@tanstack/react-query'
import { fetchProducts } from './api/products'

export const productsQuery = (q: string) =>
  queryOptions({
    queryKey: ['products', { q }],
    queryFn: () => fetchProducts(q),
    refetchInterval: 5000,
  })
