import {
  ApiCredential,
  PaymentTransaction,
  PaymentRefund,
  Subscription,
} from '@prisma/client';
export type RefundPayment = PaymentTransaction & {
  api_credential: ApiCredential | null;
};
export type RefundSubscription = Subscription & {
  api_credential: ApiCredential | null;
};
export type VerifiedPayment = { id: string; refunded: number };
export type RefundResult = {
  id: string;
  state: 'succeeded' | 'failed' | 'processing';
};
export interface RefundAdapter {
  verify(p: RefundPayment, pinned?: string): Promise<VerifiedPayment>;
  submit(p: RefundPayment, id: string, r: PaymentRefund): Promise<RefundResult>;
  poll(
    p: RefundPayment,
    id: string,
    r: PaymentRefund,
  ): Promise<RefundResult | null>;
  cancel?(s: RefundSubscription): Promise<void>;
}
export function object(v: unknown): Record<string, any> {
  return v && typeof v === 'object' && !Array.isArray(v)
    ? (v as Record<string, any>)
    : {};
}
export function safeId(v: unknown, pattern: RegExp): string {
  if (typeof v !== 'string' || !pattern.test(v))
    throw new Error('REFUND_PAYMENT_ID_INVALID');
  return v;
}
export function cents(v: unknown): number {
  if (typeof v !== 'string' || !/^\d+(\.\d{1,2})?$/.test(v))
    throw new Error('REFUND_AMOUNT_INVALID');
  const n = Math.round(Number(v) * 100);
  if (!Number.isSafeInteger(n)) throw new Error('REFUND_AMOUNT_INVALID');
  return n;
}
export function match(p: RefundPayment, amount: number, currency: string) {
  if (
    !Number.isSafeInteger(amount) ||
    amount !== p.amount ||
    currency?.toUpperCase() !== p.currency
  )
    throw new Error('REFUND_PAYMENT_MISMATCH');
}
