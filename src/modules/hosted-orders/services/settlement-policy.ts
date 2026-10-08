export function assertSettlement(
  metadata: unknown,
  resource: {
    apiCredentialId: string | null;
    amount: number;
    currency: string;
  },
  event: {
    canonicalStatus: string;
    amount: number | null;
    currency: string | null;
  },
): void {
  const credential = (metadata as Record<string, unknown> | null)
    ?.apiCredentialId;
  if (
    typeof credential !== 'string' ||
    !resource.apiCredentialId ||
    credential !== resource.apiCredentialId
  )
    throw new Error('Webhook credential does not own this resource');
  if (
    ['paid', 'invoice_paid'].includes(event.canonicalStatus) &&
    (event.amount !== resource.amount ||
      event.currency?.toUpperCase() !== resource.currency.toUpperCase())
  )
    throw new Error('Webhook settlement amount or currency mismatch');
}
