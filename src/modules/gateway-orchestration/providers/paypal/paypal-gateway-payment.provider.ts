import { Injectable } from '@nestjs/common';
import { UnsupportedGatewayPaymentProvider } from '../base/unsupported-gateway-payment.provider';

@Injectable()
export class PayPalGatewayPaymentProvider extends UnsupportedGatewayPaymentProvider {
  constructor() {
    super('paypal', ['paypal', 'pay_pal', 'pay-pal']);
  }
}
