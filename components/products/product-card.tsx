import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, ExternalLink } from "lucide-react"
import type { Product } from "@/lib/types/database"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number | null) => {
    if (price === null) return "N/A"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  const primaryImage = product.images?.[0]

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base line-clamp-2">{product.name}</CardTitle>
            <CardDescription className="text-sm">{product.sku && `SKU: ${product.sku}`}</CardDescription>
          </div>
          <Badge variant={product.in_stock ? "default" : "secondary"} className="ml-2">
            {product.in_stock ? "In Stock" : "Out of Stock"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Product Image */}
        {primaryImage ? (
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img src={primaryImage || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
            <Package className="h-8 w-8 text-gray-400" />
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            {product.sale_price && product.sale_price < (product.regular_price || 0) ? (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-red-600">{formatPrice(product.sale_price)}</span>
                <span className="text-sm text-gray-500 line-through">{formatPrice(product.regular_price)}</span>
              </div>
            ) : (
              <span className="font-semibold">{formatPrice(product.price)}</span>
            )}
          </div>
          {product.stock_quantity !== null && (
            <span className="text-sm text-gray-600">Qty: {product.stock_quantity}</span>
          )}
        </div>

        {/* Categories */}
        {product.categories && product.categories.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.categories.slice(0, 2).map((category) => (
              <Badge key={category} variant="outline" className="text-xs">
                {category}
              </Badge>
            ))}
            {product.categories.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{product.categories.length - 2} more
              </Badge>
            )}
          </div>
        )}

        {/* Description */}
        {product.short_description && (
          <p className="text-sm text-gray-600 line-clamp-2">{product.short_description.replace(/<[^>]*>/g, "")}</p>
        )}

        {/* External Link */}
        {product.permalink && (
          <a
            href={product.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-500"
          >
            <ExternalLink className="h-3 w-3" />
            View in Store
          </a>
        )}
      </CardContent>
    </Card>
  )
}
