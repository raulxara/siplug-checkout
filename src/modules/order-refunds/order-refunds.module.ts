import { Module } from "@nestjs/common";
import { PrismaModule } from "../../infra/database/prisma/prisma.module";
import { GetAuthContextModule } from "../../use-cases/get-auth-context/get-auth-context.module";
import { SecurityModule } from "../security/security.module";
import { OrderRefundsController } from "./order-refunds.controller";
import { OrderRefundsRepository } from "./order-refunds.repository";
import { OrderRefundsUseCase } from "./order-refunds.use-case";
import { MercadoPagoRefundService } from "./mercado-pago-refund.service";
import { DecryptApiCredentialSecretService } from "../../common/services/crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service";
@Module({
  imports: [PrismaModule, GetAuthContextModule, SecurityModule],
  controllers: [OrderRefundsController],
  providers: [
    OrderRefundsRepository,
    OrderRefundsUseCase,
    MercadoPagoRefundService,
    DecryptApiCredentialSecretService,
  ],
})
export class OrderRefundsModule {}
