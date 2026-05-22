import { Resend } from 'resend';

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[resend] RESEND_API_KEY not set — emails will not be sent');
    return {
      emails: {
        send: async () => {
          console.warn('[resend] Skipped sending email (no API key)');
          return { id: null };
        },
      },
    } as unknown as Resend;
  }
  return new Resend(apiKey);
}

export default getResend;
