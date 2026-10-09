export type Product = {
  id: string
  title: string
  description: string
}

const ADJECTIVES = ['Wireless', 'Ergonomic', 'Compact', 'Smart', 'Portable', 'Solar', 'Vintage', 'Modular']
const NOUNS = ['Headphones', 'Keyboard', 'Lamp', 'Backpack', 'Speaker', 'Monitor', 'Kettle', 'Chair']

let nextId = 1

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

function makeProduct(): Product {
  const adjective = pick(ADJECTIVES)
  const noun = pick(NOUNS)
  return {
    id: String(nextId++),
    title: `${adjective} ${noun}`,
    description: `A ${adjective.toLowerCase()} ${noun.toLowerCase()} built for everyday use.`,
  }
}

const products: Product[] = Array.from({ length: 6 }, makeProduct).reverse()

export async function fetchProducts(q: string): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const term = q.trim().toLowerCase()
  return products.filter((p) => `${p.title} ${p.description}`.toLowerCase().includes(term))
}

export function insertRandomProduct() {
  products.unshift(makeProduct())
}
