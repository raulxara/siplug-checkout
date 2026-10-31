import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infra/database/prisma/prisma.module';
import { GetAuthContextModule } from '../../use-cases/get-auth-context/get-auth-context.module';
import { SecurityModule } from '../security/security.module';
import { FiscalPaymentsRepository } from './fiscal-payments.repository';
import { FiscalPaymentsUseCase } from './fiscal-payments.use-case';
import { FiscalPaymentsController } from './fiscal-payments.controller';
@Module({
  imports: [PrismaModule, GetAuthContextModule, SecurityModule],
  controllers: [FiscalPaymentsController],
  providers: [FiscalPaymentsRepository, FiscalPaymentsUseCase],
})
export class FiscalPaymentsModule {}
