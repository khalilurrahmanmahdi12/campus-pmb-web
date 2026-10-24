// @ts-ignore
import midtransClient from 'midtrans-client';
import crypto from 'crypto';

// Initialize Midtrans Snap client
export const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-YOUR_SANDBOX_SERVER_KEY',
  clientKey: process.env.MIDTRANS_CLIENT_KEY || 'SB-Mid-client-YOUR_SANDBOX_CLIENT_KEY',
});

// Helper to verify Midtrans notification signature key
// Signature formula: SHA512(order_id + status_code + gross_amount + ServerKey)
export function verifyMidtransSignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  receivedSignature: string
): boolean {
  const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
  const hash = crypto
    .createHash('sha512')
    .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
    .digest('hex');

  return hash === receivedSignature;
}
