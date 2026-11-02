import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { CouponRenewalsRepository } from '../../modules/hosted-orders/repositories/coupon-renewals.repository';
import { MercadoPagoRenewalService } from '../../modules/hosted-orders/services/mercado-pago-renewal.service';
@Injectable()
export class RestoreCouponRenewalsUseCase
  implements OnModuleInit, OnModuleDestroy
{
  private timer?: ReturnType<typeof setInterval>;
  private running = false;
  private readonly logger = new Logger(RestoreCouponRenewalsUseCase.name);
  constructor(
    private readonly repo: CouponRenewalsRepository,
    private readonly provider: MercadoPagoRenewalService,
  ) {}
  onModuleInit() {
    this.timer = setInterval(() => {
      void this.exec().catch(() =>
        this.logger.error('Coupon renewal reconciliation failed'),
      );
    }, 60000);
    this.timer.unref();
  }
  onModuleDestroy() {
    if (this.timer) clearInterval(this.timer);
  }
  async exec() {
    if (this.running) return;
    this.running = true;
    try {
      for (const session of await this.repo.pending()) {
        try {
          const config = session.config as Record<string, unknown>;
          const amount = config.renewalAmount;
          if (
            session.gateway?.provider !== 'mercadopago' ||
            !session.external_reference ||
            !session.api_credential?.token ||
            !Number.isSafeInteger(amount) ||
            Number(amount) <= session.amount
          )
            continue;
          const subscription = await this.repo.subscription(
            session.office_id,
            session.client_id,
            session.external_reference,
          );
          const first = subscription?.invoices[0];
          if (
            !subscription?.gateway_subscription_id ||
            !first ||
            first.amount !== session.amount ||
            first.currency !== session.currency ||
            ['canceled', 'expired', 'ended'].includes(subscription.status)
          )
            continue;
          await this.provider.restore({
            token: session.api_credential.token,
            subscriptionId: subscription.gateway_subscription_id,
            reference: session.external_reference,
            firstAmount: session.amount,
            renewalAmount: Number(amount),
            currency: session.currency,
          });
          await this.repo.complete(
            session.unique_id,
            subscription.unique_id,
            Number(amount),
          );
        } catch {
          this.logger.warn(
            'Coupon renewal adjustment pending; retry scheduled',
          );
        } finally {
          await this.repo.touched(session.unique_id);
        }
      }
    } finally {
      this.running = false;
    }
  }
}
