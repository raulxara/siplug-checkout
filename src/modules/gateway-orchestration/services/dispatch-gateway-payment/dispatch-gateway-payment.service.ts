import { Injectable } from '@nestjs/common';
import { GatewayPaymentDtoIn } from '../../dtos/gateway-payment.dto-in';
import { GatewayPaymentDtoOut } from '../../dtos/gateway-payment.dto-out';
import { ResolveGatewayPaymentProviderService } from '../resolve-gateway-payment-provider/resolve-gateway-payment-provider.service';

@Injectable()
export class DispatchGatewayPaymentService {
  constructor(
    private readonly resolveGatewayPaymentProviderService: ResolveGatewayPaymentProviderService,
  ) {}

  async exec(dtoIn: GatewayPaymentDtoIn): Promise<GatewayPaymentDtoOut> {
    try {
      const provider = this.resolveGatewayPaymentProviderService.exec(
        dtoIn.gatewayProvider,
      );

      return await provider.processPayment(dtoIn);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on dispatch gateway payment';

      return new GatewayPaymentDtoOut({
        success: false,
        provider: dtoIn.gatewayProvider,

        gatewayTransactionId: null,
        gatewayStatus: null,

        status: dtoIn.paymentTransaction.status,
        processStatus: 'gateway_dispatch_failed',
        processMessage: message,

        providerRequest: {
          paymentTransactionId: dtoIn.paymentTransaction._id,
          idempotencyKey: dtoIn.idempotencyKey,
          providerPayload: dtoIn.providerPayload,
        },

        providerResponse: {
          message,
        },

        gatewayResponse: null,

        qrCode: null,
        qrCodeBase64: null,
        boletoUrl: null,
        checkoutUrl: null,

        paidAt: null,
        authorizedAt: null,
        canceledAt: null,
        failedAt: null,
        refundedAt: null,
        expiresAt: dtoIn.paymentTransaction.expiresAt,
      });
    }
  }
}
