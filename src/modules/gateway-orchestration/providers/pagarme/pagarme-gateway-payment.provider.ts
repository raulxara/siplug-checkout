import { Injectable } from '@nestjs/common';
import { UnsupportedGatewayPaymentProvider } from '../base/unsupported-gateway-payment.provider';

@Injectable()
export class PagarmeGatewayPaymentProvider extends UnsupportedGatewayPaymentProvider {
  constructor() {
    super('pagarme', ['pagarme', 'pagar_me', 'pagar-me', 'pagar.me']);
  }
}
