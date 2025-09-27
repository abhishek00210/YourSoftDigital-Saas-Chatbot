import { createClient } from "@/lib/supabase/server"
import type { User, Business, Chatbot, Product } from "@/lib/types/database"

export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient()

  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !authUser) return null

  const { data: user, error } = await supabase.from("users").select("*").eq("id", authUser.id).single()

  if (error) return null
  return user
}

export async function getUserBusinesses(userId: string): Promise<Business[]> {
  const supabase = await createClient()

  const { data: businesses, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) return []
  return businesses
}

export async function getBusinessChatbots(businessId: string): Promise<Chatbot[]> {
  const supabase = await createClient()

  const { data: chatbots, error } = await supabase
    .from("chatbots")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false })

  if (error) return []
  return chatbots
}

export async function getBusinessProducts(businessId: string): Promise<Product[]> {
  const supabase = await createClient()

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false })

  if (error) return []
  return products
}
