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
  providers: [HostedOrdersRepository, HostedOrdersUseCase],
  controllers: [HostedOrdersController],
})
export class HostedOrdersModule {}
