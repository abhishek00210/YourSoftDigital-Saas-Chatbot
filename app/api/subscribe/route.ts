import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/utils/stripe"
import { getURL } from "@/lib/utils/helpers"

export async function POST(request: NextRequest) {
  try {
    const { priceId } = await request.json()

    if (!priceId) {
      return NextResponse.json({ error: "Price ID is required" }, { status: 400 })
    }
    
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if the user is already a customer in your DB
    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single()

    let stripeCustomerId: string

    if (customerError || !customer?.stripe_customer_id) {
      // Create a new customer in Stripe and in your DB
      const customerData = {
        email: user.email,
        metadata: { userId: user.id },
      }
      const newStripeCustomer = await stripe.customers.create(customerData)
      stripeCustomerId = newStripeCustomer.id

      const { error: newCustomerError } = await supabase
        .from("customers")
        .insert({ id: user.id, stripe_customer_id: stripeCustomerId })
      
      if (newCustomerError) {
        console.error("Failed to create customer in DB:", newCustomerError)
        return NextResponse.json({ error: "Failed to create customer" }, { status: 500 })
      }
    } else {
      stripeCustomerId = customer.stripe_customer_id
    }

    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      billing_address_collection: "required",
      customer: stripeCustomerId,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${getURL()}/dashboard?success=true`,
      cancel_url: `${getURL()}/dashboard/pricing`,
    })

    if (session.url) {
      return NextResponse.json({ url: session.url })
    } else {
      return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
    }

  } catch (error) {
    console.error("Subscription API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}