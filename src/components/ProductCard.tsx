import { Card, Text } from '@mantine/core'
import type { Product } from '../api/products'
import classes from './ProductCard.module.css'

export function ProductCard({ product, isNew }: { product: Product; isNew: boolean }) {
  return (
    <Card withBorder shadow="sm" padding="lg" className={classes.card} mod={{ new: isNew }}>
      <Text fw={600}>{product.title}</Text>
      <Text size="sm" c="dimmed">
        {product.description}
      </Text>
    </Card>
  )
}
