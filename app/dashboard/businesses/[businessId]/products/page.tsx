import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/utils/database"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Package, RefreshCw, Search, ExternalLink } from "lucide-react"
import Link from "next/link"
import { ProductSyncButton } from "@/components/products/product-sync-button"
import { ProductCard } from "@/components/products/product-card"

interface ProductsPageProps {
  params: { businessId: string }
  searchParams: { search?: string; category?: string }
}

export default async function ProductsPage({ params, searchParams }: ProductsPageProps) {
  const { businessId } = params
  const { search, category } = searchParams
  const supabase = await createClient()

  const user = await getCurrentUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Get business details
  const { data: business, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("id", businessId)
    .eq("user_id", user.id)
    .single()

  if (error || !business) {
    redirect("/dashboard")
  }

  // Get products with optional filtering
  let query = supabase
    .from("products")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false })

  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,sku.ilike.%${search}%`)
  }

  const { data: products = [], error: productsError } = await query

  // Get unique categories for filtering
  const categories = [...new Set(products.flatMap((p) => p.categories || []))].filter(Boolean)

  // Filter by category if specified
  const filteredProducts = category ? products.filter((p) => p.categories?.includes(category)) : products

  const hasWooCommerceConfig = !!(
    business.woocommerce_url &&
    business.woocommerce_consumer_key &&
    business.woocommerce_consumer_secret
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header is handled by layout */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href={`/dashboard/businesses/${businessId}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to {business.name}
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Package className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-semibold">Products</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {hasWooCommerceConfig && <ProductSyncButton businessId={businessId} />}
              <Link href={`/dashboard/businesses/${businessId}/settings`}>
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Configure WooCommerce
                </Button>
              </Link>
            </div>
          </div>
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Stock</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.filter((p) => p.in_stock).length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">WooCommerce</CardTitle>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <Badge variant={hasWooCommerceConfig ? "default" : "secondary"}>
                  {hasWooCommerceConfig ? "Connected" : "Not Connected"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {!hasWooCommerceConfig ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">WooCommerce Not Connected</h3>
              <p className="text-gray-600 text-center mb-6 max-w-md">
                Connect your WooCommerce store to automatically sync your product catalog and enable AI-powered product
                recommendations.
              </p>
              <Link href={`/dashboard/businesses/${businessId}/settings`}>
                <Button>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Configure WooCommerce
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : products.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Products Found</h3>
              <p className="text-gray-600 text-center mb-6 max-w-md">
                Your WooCommerce store is connected but no products have been synced yet. Click the sync button to
                import your products.
              </p>
              <ProductSyncButton businessId={businessId} />
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <form className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Search products..." className="pl-10" name="search" defaultValue={search} />
              </form>
              {categories.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  <Link href={`/dashboard/businesses/${businessId}/products`}>
                    <Badge variant={!category ? "default" : "outline"} className="cursor-pointer">
                      All
                    </Badge>
                  </Link>
                  {categories.slice(0, 5).map((cat) => (
                    <Link
                      key={cat}
                      href={`/dashboard/businesses/${businessId}/products?category=${encodeURIComponent(cat)}`}
                    >
                      <Badge variant={category === cat ? "default" : "outline"} className="cursor-pointer">
                        {cat}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Products Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (search || category) && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Search className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Products Found</h3>
                  <p className="text-gray-600 text-center mb-6">
                    No products match your current search or filter criteria.
                  </p>
                  <Link href={`/dashboard/businesses/${businessId}/products`}>
                    <Button variant="outline">Clear Filters</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  )
}