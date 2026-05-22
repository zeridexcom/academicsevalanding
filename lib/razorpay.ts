import Razorpay from 'razorpay';

function getRazorpay() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    console.warn('[razorpay] Razorpay keys not set — orders will not be created');
    return {
      orders: {
        create: async () => {
          throw new Error('[razorpay] Cannot create order — Razorpay keys not configured');
        },
      },
    } as unknown as Razorpay;
  }
  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

export default getRazorpay;
