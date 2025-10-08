import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server'; // Or appropriate client for API routes
import { WooCommerceAPI } from '@/lib/woocommerce'; // Your WooCommerce API wrapper
import { transformWooCommerceProduct } from '@/lib/woocommerce'; // Your product transformer

export async function POST(
  request: Request,
  { params }: { params: { businessId: string } }
) {
  const { businessId } = params;
  const supabase = createClient(); // Ensure correct Supabase client for this context

  const { data: business, error: businessError } = await supabase
    .from('businesses')
    .select('woocommerce_url, woocommerce_consumer_key, woocommerce_consumer_secret')
    .eq('id', businessId)
    .single();

  if (businessError || !business) {
    console.error('Business not found or error fetching business:', businessError);
    return NextResponse.json({ error: 'Business not found' }, { status: 404 });
  }

  if (
    !business.woocommerce_url ||
    !business.woocommerce_consumer_key ||
    !business.woocommerce_consumer_secret
  ) {
    console.error('Missing WooCommerce credentials for business:', businessId);
    return NextResponse.json(
      { error: 'WooCommerce credentials not configured for this business.' },
      { status: 400 } // This is likely the source of your 400 error
    );
  }

  try {
    const wc = new WooCommerceAPI({
      url: business.woocommerce_url,
      consumer_key: business.woocommerce_consumer_key,
      consumer_secret: business.woocommerce_consumer_secret,
    });

    const wooProducts = await wc.getProducts(); // Fetch from WooCommerce
    const transformedProducts = wooProducts.map(p => transformWooCommerceProduct(p, businessId));

    // Insert/Upsert into Supabase
    const { error: upsertError } = await supabase
      .from('products')
      .upsert(transformedProducts, { onConflict: 'id', ignoreDuplicates: false }); // Ensure 'id' is your unique identifier from WooCommerce

    if (upsertError) {
      console.error('Error upserting products to Supabase:', upsertError);
      return NextResponse.json(
        { error: 'Failed to save products to database', details: upsertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: `Successfully synced ${transformedProducts.length} products.` },
      { status: 200 }
    );
  } catch (wcError: any) {
    console.error('Error during WooCommerce API call or product transformation:', wcError);
    return NextResponse.json(
      { error: 'Failed to connect to WooCommerce or process products', details: wcError.message },
      { status: 500 } // Or 400 if it's a known credential issue
    );
  }
}