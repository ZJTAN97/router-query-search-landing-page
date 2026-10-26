export type Product = {
  id: string
  title: string
  description: string
}

export type ProductsPage = {
  items: Product[]
  nextCursor?: string
}

const PAGE_SIZE = 6

const ADJECTIVES = ['Wireless', 'Ergonomic', 'Compact', 'Smart', 'Portable', 'Solar', 'Vintage', 'Modular']
const NOUNS = ['Headphones', 'Keyboard', 'Lamp', 'Backpack', 'Speaker', 'Monitor', 'Kettle', 'Chair']

let counter = 0

function makeObjectId(): string {
  const seconds = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0')
  return seconds + (counter++).toString(16).padStart(16, '0')
}

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

function makeProduct(): Product {
  const adjective = pick(ADJECTIVES)
  const noun = pick(NOUNS)
  return {
    id: makeObjectId(),
    title: `${adjective} ${noun}`,
    description: `A ${adjective.toLowerCase()} ${noun.toLowerCase()} built for everyday use.`,
  }
}

const products: Product[] = Array.from({ length: 30 }, makeProduct).reverse()

export async function fetchProducts(q: string, cursor?: string): Promise<ProductsPage> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const term = q.trim().toLowerCase()
  const matches = products.filter((p) => `${p.title} ${p.description}`.toLowerCase().includes(term))
  const start = cursor ? matches.findIndex((p) => p.id === cursor) + 1 : 0
  const items = matches.slice(start, start + PAGE_SIZE)
  const hasMore = start + PAGE_SIZE < matches.length
  return { items, nextCursor: hasMore ? items.at(-1)!.id : undefined }
}

export function insertRandomProduct() {
  products.unshift(makeProduct())
}
