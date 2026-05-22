import getResend from './resend';

export async function sendConfirmationEmail(
  to: string,
  paymentId: string,
  taxExempt: boolean
) {
  const resend = getResend();
  const taxSection = taxExempt
    ? `
      <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #D97706;">
        <p style="margin: 0; color: #92400e; font-weight: bold;">Tax Exemption (80G)</p>
        <p style="margin: 8px 0 0; color: #78350f; font-size: 14px;">Your donation is eligible for tax exemption under Section 80G. A separate 80G receipt will be sent to you shortly.</p>
      </div>
    `
    : '';

  await resend.emails.send({
    from: process.env.SENDER_EMAIL!,
    to,
    subject: 'Thank You for Your Donation — Academic Seva',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #D97706;">Thank You for Your Kindness!</h1>
        <p>Your contribution of <strong>₹199</strong> will directly help a student in need.</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Payment ID:</strong> ${paymentId}</p>
          <p><strong>Amount:</strong> ₹199</p>
          <p><strong>Donor Email:</strong> ${to}</p>
        </div>
        ${taxSection}
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          If you have any questions, simply reply to this email.<br/>
          — Team Academic Seva
        </p>
      </div>
    `,
  });
}
