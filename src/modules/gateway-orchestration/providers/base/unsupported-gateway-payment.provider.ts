import { GatewayPaymentDtoIn } from '../../dtos/gateway-payment.dto-in';
import { GatewayPaymentDtoOut } from '../../dtos/gateway-payment.dto-out';
import type { IGatewayPaymentProvider } from '../../contracts/gateway-payment-provider.interface';

export abstract class UnsupportedGatewayPaymentProvider implements IGatewayPaymentProvider {
  protected constructor(
    private readonly providerName: string,
    private readonly aliases: string[],
  ) {}

  getProviderName(): string {
    return this.providerName;
  }

  supports(gatewayProvider: string): boolean {
    const normalizedProvider = this.normalize(gatewayProvider);

    return this.aliases
      .map((alias) => this.normalize(alias))
      .includes(normalizedProvider);
  }

  async processPayment(
    dtoIn: GatewayPaymentDtoIn,
  ): Promise<GatewayPaymentDtoOut> {
    return new GatewayPaymentDtoOut({
      success: false,
      provider: this.providerName,

      gatewayTransactionId: null,
      gatewayStatus: null,

      status: dtoIn.paymentTransaction.status,
      processStatus: 'gateway_provider_not_implemented',
      processMessage: `${this.providerName} payment provider is not implemented yet`,

      providerRequest: {
        paymentTransactionId: dtoIn.paymentTransaction._id,
        idempotencyKey: dtoIn.idempotencyKey,
        providerPayload: dtoIn.providerPayload,
      },

      providerResponse: {
        message: 'gateway provider adapter not implemented yet',
        provider: this.providerName,
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

  private normalize(value: string): string {
    return value
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\./g, '')
      .replace(/-/g, '_')
      .replace(/\s+/g, '_');
  }
}
