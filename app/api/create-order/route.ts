import { NextResponse } from 'next/server';
import getRazorpay from '@/lib/razorpay';

export async function POST(request: Request) {
  try {
    const { amount, currency, email } = await request.json();

    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount,
      currency: currency || 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        email,
      },
    });

    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
