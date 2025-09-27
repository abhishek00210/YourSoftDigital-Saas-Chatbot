import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { WooCommerceAPI } from "@/lib/utils/woocommerce"

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

    // Test connection and get basic info
    const connectionTest = await wooApi.testConnection()
    if (!connectionTest) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to connect to WooCommerce store. Please check your credentials and store URL.",
        },
        { status: 400 },
      )
    }

    // Get sample data to verify connection
    const [products, categories] = await Promise.all([wooApi.getProducts(1, 5), wooApi.getCategories()])

    return NextResponse.json({
      success: true,
      message: "Successfully connected to WooCommerce store",
      store_info: {
        products_found: products.length,
        categories_found: categories.length,
        sample_products: products.slice(0, 3).map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          sku: p.sku,
        })),
      },
    })
  } catch (error) {
    console.error("WooCommerce test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to connect to WooCommerce store",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
