import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function GET() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const publicKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const senderEmail = process.env.SENDER_EMAIL;
  const resendKey = process.env.RESEND_API_KEY;

  const diagnostics: Record<string, unknown> = {
    envVars: {
      RAZORPAY_KEY_ID: keyId ? `${keyId.slice(0, 8)}...${keyId.slice(-4)}` : 'NOT SET',
      RAZORPAY_KEY_SECRET: keySecret ? `${keySecret.slice(0, 4)}...${keySecret.slice(-4)}` : 'NOT SET',
      NEXT_PUBLIC_RAZORPAY_KEY_ID: publicKeyId ? `${publicKeyId.slice(0, 8)}...${publicKeyId.slice(-4)}` : 'NOT SET',
      SENDER_EMAIL: senderEmail || 'NOT SET',
      RESEND_API_KEY: resendKey ? `${resendKey.slice(0, 6)}...${resendKey.slice(-4)}` : 'NOT SET',
    },
    keyMatch: false,
    razorpayTest: null,
    error: null,
  };

  diagnostics.keyMatch = keyId === publicKeyId;

  if (!keyId || !keySecret) {
    diagnostics.error = 'RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not set';
    return NextResponse.json(diagnostics);
  }

  try {
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await razorpay.orders.create({
      amount: 100,
      currency: 'INR',
      receipt: `debug_${Date.now()}`,
    });
    diagnostics.razorpayTest = { success: true, orderId: order.id };
  } catch (err: unknown) {
    const razorpayErr = err as { statusCode?: number; error?: Record<string, unknown> };
    diagnostics.razorpayTest = {
      success: false,
      statusCode: razorpayErr?.statusCode || null,
      error: razorpayErr?.error || String(err),
    };
  }

  return NextResponse.json(diagnostics);
}
