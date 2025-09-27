interface WooCommerceProduct {
  id: number
  name: string
  description: string
  short_description: string
  price: string
  regular_price: string
  sale_price: string
  sku: string
  stock_quantity: number | null
  in_stock: boolean
  categories: Array<{ id: number; name: string; slug: string }>
  tags: Array<{ id: number; name: string; slug: string }>
  images: Array<{ id: number; src: string; alt: string }>
  permalink: string
  status: string
}

interface WooCommerceCredentials {
  url: string
  consumer_key: string
  consumer_secret: string
}

export class WooCommerceAPI {
  private baseUrl: string
  private consumerKey: string
  private consumerSecret: string

  constructor(credentials: WooCommerceCredentials) {
    this.baseUrl = credentials.url.replace(/\/$/, "") + "/wp-json/wc/v3"
    this.consumerKey = credentials.consumer_key
    this.consumerSecret = credentials.consumer_secret
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = new URL(`${this.baseUrl}${endpoint}`)
    url.searchParams.append("consumer_key", this.consumerKey)
    url.searchParams.append("consumer_secret", this.consumerSecret)

    const response = await fetch(url.toString(), {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`WooCommerce API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.makeRequest("/products?per_page=1")
      return true
    } catch (error) {
      console.error("WooCommerce connection test failed:", error)
      return false
    }
  }

  async getProducts(page = 1, perPage = 100): Promise<WooCommerceProduct[]> {
    return this.makeRequest(`/products?page=${page}&per_page=${perPage}&status=publish`)
  }

  async getProduct(id: number): Promise<WooCommerceProduct> {
    return this.makeRequest(`/products/${id}`)
  }

  async getCategories(): Promise<Array<{ id: number; name: string; slug: string; count: number }>> {
    return this.makeRequest("/products/categories?per_page=100")
  }

  async getTags(): Promise<Array<{ id: number; name: string; slug: string; count: number }>> {
    return this.makeRequest("/products/tags?per_page=100")
  }
}

export function transformWooCommerceProduct(wcProduct: WooCommerceProduct) {
  return {
    woocommerce_id: wcProduct.id,
    name: wcProduct.name,
    description: wcProduct.description,
    short_description: wcProduct.short_description,
    price: Number.parseFloat(wcProduct.price) || null,
    regular_price: Number.parseFloat(wcProduct.regular_price) || null,
    sale_price: wcProduct.sale_price ? Number.parseFloat(wcProduct.sale_price) : null,
    sku: wcProduct.sku || null,
    stock_quantity: wcProduct.stock_quantity,
    in_stock: wcProduct.in_stock,
    categories: wcProduct.categories.map((cat) => cat.name),
    tags: wcProduct.tags.map((tag) => tag.name),
    images: wcProduct.images.map((img) => img.src),
    permalink: wcProduct.permalink,
  }
}
