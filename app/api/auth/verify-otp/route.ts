import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // service role key
);

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Step 1: Fetch OTP record
    const { data: otpRecord, error: fetchError } = await supabaseAdmin
      .from("otp_verifications")
      .select("*")
      .eq("email", email)
      .single();

    if (fetchError || !otpRecord) {
      return NextResponse.json({ error: "OTP not found" }, { status: 400 });
    }

    // Step 2: Check expiry
    if (new Date(otpRecord.expires_at) < new Date()) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    // Step 3: Verify hash
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
    if (hashedOtp !== otpRecord.otp_code_hash) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // Step 4: Create user in Supabase
    const { data, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
      email: otpRecord.email,
      password: otpRecord.password,
      email_confirm: true, // mark email as confirmed since OTP passed
      user_metadata: {
        full_name: otpRecord.full_name,
      },
    });

    if (signUpError) {
      return NextResponse.json({ error: signUpError.message }, { status: 400 });
    }

    // Step 5: Delete OTP record (cleanup)
    await supabaseAdmin
      .from("otp_verifications")
      .delete()
      .eq("email", email);

    return NextResponse.json({ success: true, user: data.user });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}
