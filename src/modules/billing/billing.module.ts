import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infra/database/prisma/prisma.module';
import { GetAuthContextModule } from '../../use-cases/get-auth-context/get-auth-context.module';
import { SecurityModule } from '../security/security.module';
import { ProcessPaymentModule } from '../../use-cases/process-payment/process-payment.module';
import { HostedOrdersRepository } from '../hosted-orders/repositories/hosted-orders.repository';
import { BillingController } from './billing.controller';
import { BillingRepository } from './billing.repository';
import { BillingUseCase } from './billing.use-case';
@Module({
  imports: [
    PrismaModule,
    GetAuthContextModule,
    SecurityModule,
    ProcessPaymentModule,
  ],
  controllers: [BillingController],
  providers: [BillingRepository, BillingUseCase, HostedOrdersRepository],
})
export class BillingModule {}
