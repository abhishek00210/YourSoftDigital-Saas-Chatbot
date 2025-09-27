import { createClient } from "@/lib/supabase/server";

export async function getUserSubscription(
  userId: string
): Promise<{ data: any; error: any }> {
  const supabase = await createClient();

  
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*, prices:subscription_prices(*, products:subscription_products(*))")
    .in("status", ["trialing", "active"])
    .eq("user_id", userId)
    .single();

  return { data, error };
}