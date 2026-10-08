import { CouponRenewalsRepository } from '../../modules/hosted-orders/repositories/coupon-renewals.repository';
import { MercadoPagoRenewalService } from '../../modules/hosted-orders/services/mercado-pago-renewal.service';
import { RestoreCouponRenewalsUseCase } from './restore-coupon-renewals.use-case';
import { DecryptApiCredentialSecretService } from '../../common/services/crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service';
import { Module } from '@nestjs/common';
import { GetAuthContextModule } from '../get-auth-context/get-auth-context.module';
import { RegisterCheckoutSessionModule } from '../register-checkout-session/register-checkout-session.module';
import { RegisterSubscriptionPlanModule } from '../register-subscription-plan/register-subscription-plan.module';
import { ProcessPaymentModule } from '../process-payment/process-payment.module';
import { ProcessRecurringPaymentModule } from '../process-recurring-payment/process-recurring-payment.module';
import { HostedOrdersRepository } from '../../modules/hosted-orders/repositories/hosted-orders.repository';
import { HostedOrdersUseCase } from './hosted-orders.use-case';
import { HostedOrdersController } from './hosted-orders.controller';
@Module({
  imports: [
    GetAuthContextModule,
    RegisterCheckoutSessionModule,
    RegisterSubscriptionPlanModule,
    ProcessPaymentModule,
    ProcessRecurringPaymentModule,
  ],
  providers: [
    HostedOrdersRepository,
    HostedOrdersUseCase,
    CouponRenewalsRepository,
    MercadoPagoRenewalService,
    RestoreCouponRenewalsUseCase,
    DecryptApiCredentialSecretService,
  ],
  controllers: [HostedOrdersController],
})
export class HostedOrdersModule {}
