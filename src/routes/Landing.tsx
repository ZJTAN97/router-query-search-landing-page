import { Button, Container, Group, SimpleGrid, Text, TextInput, Title } from '@mantine/core'
import { useDebouncedCallback, useIntersection } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { useInfiniteQuery, useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
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
  useNewProductsToast()

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

const NEW_PRODUCTS_TOAST_ID = 'new-products'

function useNewProductsToast() {
  const { data } = useInfiniteQuery(productsQuery(''))
  const lastSeenIdRef = useRef<string>(undefined)
  const unseenCountRef = useRef(0)

  useEffect(() => {
    const products = data?.pages.flatMap((page) => page.items)
    if (!products?.length) return
    const lastSeenId = lastSeenIdRef.current
    lastSeenIdRef.current = products[0].id
    if (lastSeenId === undefined) return

    const newCount = products.filter((product) => product.id > lastSeenId).length
    if (newCount === 0) return

    const isOpen = unseenCountRef.current > 0
    unseenCountRef.current += newCount
    const message = `${unseenCountRef.current} new product${unseenCountRef.current === 1 ? '' : 's'}`
    if (isOpen) {
      notifications.update({ id: NEW_PRODUCTS_TOAST_ID, message })
    } else {
      notifications.show({
        id: NEW_PRODUCTS_TOAST_ID,
        message,
        onClose: () => {
          unseenCountRef.current = 0
        },
      })
    }
  }, [data])
}

function ProductList({ q }: { q: string }) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery(productsQuery(q))
  const products = data.pages.flatMap((page) => page.items)
  const [newestIdAtMount] = useState(() => products[0]?.id ?? '')
  const { ref, entry } = useIntersection()

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage()
  }, [entry?.isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage])

  if (products.length === 0) return <Text c="dimmed">No products found.</Text>

  return (
    <>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} isNew={product.id > newestIdAtMount} />
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
