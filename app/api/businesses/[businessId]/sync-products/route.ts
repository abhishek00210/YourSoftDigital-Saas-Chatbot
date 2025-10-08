import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { WooCommerceAPI, transformWooCommerceProduct } from "@/lib/utils/woocommerce"

export async function POST(request: NextRequest, { params }: { params: Promise<{ businessId: string }> }) {
  try {
    const { businessId } = await params
    const supabase = await createClient()

    // Verify user authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get business with WooCommerce credentials
    const { data: business, error: businessError } = await supabase
      .from("businesses")
      .select("*")
      .eq("id", businessId)
      .eq("user_id", user.id)
      .single()

    if (businessError || !business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 })
    }

    if (!business.woocommerce_url || !business.woocommerce_consumer_key || !business.woocommerce_consumer_secret) {
      return NextResponse.json({ error: "WooCommerce credentials not configured" }, { status: 400 })
    }

    // Initialize WooCommerce API
    const wooApi = new WooCommerceAPI({
      url: business.woocommerce_url,
      consumer_key: business.woocommerce_consumer_key,
      consumer_secret: business.woocommerce_consumer_secret,
    })

    // Test connection
    const connectionTest = await wooApi.testConnection()
    if (!connectionTest) {
      return NextResponse.json({ error: "Failed to connect to WooCommerce store" }, { status: 400 })
    }

    const allProducts = []
    let page = 1
    let hasMore = true

    // Fetch all products with pagination
    while (hasMore) {
      const products = await wooApi.getProducts(page, 100)
      if (products.length === 0) {
        hasMore = false
      } else {
        allProducts.push(...products)
        page++
        // Prevent infinite loops
        if (page > 50) break
      }
    }

    // Transform and upsert products
    const transformedProducts = allProducts.map((product) => ({
      business_id: businessId,
      ...transformWooCommerceProduct(product),
    }))

    // Delete existing products for this business
    await supabase.from("products").delete().eq("business_id", businessId)

    // Insert new products in batches
    const batchSize = 100
    let syncedCount = 0

    for (let i = 0; i < transformedProducts.length; i += batchSize) {
      const batch = transformedProducts.slice(i, i + batchSize)
      const { error: insertError } = await supabase.from("products").insert(batch)

      if (insertError) {
        console.error("Error inserting product batch:", insertError)
        continue
      }

      syncedCount += batch.length
    }

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${syncedCount} products`,
      synced_count: syncedCount,
      total_found: allProducts.length,
    })
  } catch (error) {
    console.error("Product sync error:", error)
    return NextResponse.json(
      { error: "Failed to sync products", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}






