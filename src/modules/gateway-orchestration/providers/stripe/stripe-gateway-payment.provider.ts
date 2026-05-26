import { Injectable } from '@nestjs/common';
import { UnsupportedGatewayPaymentProvider } from '../base/unsupported-gateway-payment.provider';

@Injectable()
export class StripeGatewayPaymentProvider extends UnsupportedGatewayPaymentProvider {
  constructor() {
    super('stripe', ['stripe']);
  }
}
