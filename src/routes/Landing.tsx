import { Button, Container, Group, SimpleGrid, Text, TextInput, Title } from '@mantine/core'
import { useDebouncedCallback, useIntersection } from '@mantine/hooks'
import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { insertRandomProduct } from '../api/products'
import { ProductCard } from '../components/ProductCard'
import { productsQuery } from '../queries'

const route = getRouteApi('/')

export function Landing() {
  const { q = '' } = route.useSearch()
  const navigate = route.useNavigate()
  const updateSearch = useDebouncedCallback(
    (value: string) => navigate({ search: value ? { q: value } : {}, replace: true }),
    300,
  )

  return (
    <Container size="lg" py="xl">
      <Title mb="md">Products</Title>
      <Group mb="xs" align="end">
        <TextInput
          flex={1}
          placeholder="Search products"
          defaultValue={q}
          onChange={(e) => updateSearch(e.currentTarget.value)}
        />
        <Button onClick={insertRandomProduct}>Insert product</Button>
      </Group>
      <Text size="sm" c="dimmed" mb="lg">
        New products are picked up by polling every 5 seconds.
      </Text>
      <ProductList key={q} q={q} />
    </Container>
  )
}

function ProductList({ q }: { q: string }) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery(productsQuery(q))
  const products = data.pages.flatMap((page) => page.items)
  const [newestAtMount] = useState(() => products[0]?.createdAt ?? 0)
  const { ref, entry } = useIntersection()

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage()
  }, [entry?.isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage])

  if (products.length === 0) return <Text c="dimmed">No products found.</Text>

  return (
    <>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} isNew={product.createdAt > newestAtMount} />
        ))}
      </SimpleGrid>
      <div ref={ref} />
      {isFetchingNextPage && (
        <Text c="dimmed" ta="center" mt="lg">
          Loading more...
        </Text>
      )}
    </>
  )
}
