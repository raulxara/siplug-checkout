import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../../../infra/database/prisma/prisma.service';
import { NormalizedPaymentWebhookEventDto } from '../../../payment-webhook-events/dtos/normalized-payment-webhook-event.dto';
@Injectable()
export class VerifyInfinitePayPaymentService {
  constructor(private readonly db: PrismaService) {}
  async exec(
    event: NormalizedPaymentWebhookEventDto,
    credentialId: string | null,
  ) {
    if (!event.paymentTransactionId)
      throw new UnauthorizedException('Unknown payment');
    const transaction = await this.db.paymentTransaction.findUnique({
      where: { unique_id: event.paymentTransactionId },
    });
    if (
      !transaction?.api_credential_id ||
      (credentialId && credentialId !== transaction.api_credential_id)
    )
      throw new UnauthorizedException();
    const credential = await this.db.apiCredential.findFirst({
      where: {
        unique_id: transaction.api_credential_id,
        office_id: transaction.office_id,
        status: 'active',
      },
    });
    const config = credential?.config as Record<string, unknown> | null;
    if (
      !credential ||
      !['infinitepay', 'infinitypay'].includes(
        credential.provider.toLowerCase().replace(/[^a-z0-9]/g, ''),
      ) ||
      typeof config?.handle !== 'string'
    )
      throw new UnauthorizedException();
    const raw = event.rawPayload as Record<string, unknown>;
    const payload = (
      raw.data && typeof raw.data === 'object' ? raw.data : raw
    ) as Record<string, unknown>;
    const order = payload.order_nsu;
    const tx = payload.transaction_nsu;
    const slug = payload.invoice_slug ?? payload.slug;
    if ([order, tx, slug].some((v) => typeof v !== 'string' || v.length > 255))
      throw new UnauthorizedException();
    const expectedOrder =
      transaction.external_reference ??
      transaction.idempotency_key ??
      transaction.unique_id;
    if (
      order !== expectedOrder ||
      event.amount !== transaction.amount ||
      event.currency !== transaction.currency ||
      (event.checkoutSessionId &&
        event.checkoutSessionId !== transaction.checkout_session_id)
    )
      throw new UnauthorizedException('Payment identity mismatch');
    const response = await fetch(
      'https://api.checkout.infinitepay.io/payment_check',
      {
        method: 'POST',
        redirect: 'error',
        signal: AbortSignal.timeout(8000),
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          handle: config.handle,
          order_nsu: order,
          transaction_nsu: tx,
          slug,
        }),
      },
    );
    if (!response.ok)
      throw new UnauthorizedException('Payment verification failed');
    const result = (await response.json()) as Record<string, unknown>;
    if (
      result.success !== true ||
      result.paid !== true ||
      result.amount !== transaction.amount ||
      event.canonicalStatus !== 'paid'
    )
      throw new UnauthorizedException('Payment not confirmed');
  }
}
