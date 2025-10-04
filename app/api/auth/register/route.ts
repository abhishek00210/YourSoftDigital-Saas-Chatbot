import { createClient } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role key
);

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName } = await request.json();

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // 1. Check if a pending OTP record already exists
    const { data: existingOtp } = await supabaseAdmin
      .from("otp_verifications")
      .select("*")
      .eq("email", email)
      .single();

    if (existingOtp) {
      // Optional: Check if the OTP is expired. If so, you could delete it and create a new one.
      // For now, we'll just inform the user.
      return NextResponse.json(
        { error: "An OTP has already been sent to this email. Please check your inbox or wait for it to expire." },
        { status: 400 }
      );
    }

    // 2. Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // 3. Save OTP + user info temporarily
    const { error: insertError } = await supabaseAdmin
      .from("otp_verifications")
      .insert({
        email,
        password, // ⚠️ Consider hashing this password before storing it temporarily.
        full_name: fullName,
        otp_code_hash: hashedOtp,
        expires_at: expiresAt.toISOString(),
      });

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return NextResponse.json(
        { error: "Could not save OTP.", details: insertError.message },
        { status: 500 }
      );
    }

    // 4. Send OTP email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const emailHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Verification Code</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8f9fa; margin: 0; padding: 20px;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
                <td align="center">
                    <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow: hidden;">
                        <tr>
                            <td align="center" style="padding: 20px; background-color: #f1f3f5;">
                                <h1 style="margin: 0; color: #212529; font-size: 24px; font-weight: bold;">Chat Bot - YourSoft Digital</h1>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 40px 30px;">
                                <h2 style="margin: 0 0 20px; color: #ff0d00ff; font-size: 20px; font-weight: 600;">Confirm Your Sign-Up</h2>
                                <p style="margin: 0 0 25px; color: #ff0d00ff; font-size: 16px; line-height: 1.6;">
                                    Please use the following verification code to complete your registration.
                                </p>
                                <div style="text-align: center; margin-bottom: 25px;">
                                    <p style="display: inline-block; background-color: #e9ecef; padding: 12px 24px; border-radius: 6px; font-size: 28px; font-weight: bold; color: #000; letter-spacing: 4px; margin: 0;">
                                        ${otp}
                                    </p>
                                </div>
                                <p style="margin: 0 0 25px; color: #ff0d00ff; font-size: 16px; line-height: 1.6;">
                                    This code will expire in 10 minutes. If you did not request this code, you can safely ignore this email.
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="padding: 20px; background-color: #f1f3f5; color: #ff0d00ff; font-size: 12px;">
                                <p style="margin: 0;">&copy; ${new Date().getFullYear()} YourSoft Digital. All rights reserved.</p>
                                <p style="margin: 5px 0 0;">Powered by <a href="https://yoursoftdigital.ca/" style="color: #ff0d00ff; text-decoration: none;">YourSoftDigital</a></p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

    await transporter.sendMail({
      from: `YourSoft Digital <${process.env.SMTP_FROM_EMAIL || 'noreply@yoursoftdigital.ca'}>`,
      to: email,
      subject: "Your Verification Code",
      html: emailHtml,
    });

    return NextResponse.json({
      message: "Verification code sent. Please check your inbox.",
    });
  } catch (err: any) {
    console.error("Registration API error:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}