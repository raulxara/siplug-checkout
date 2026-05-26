import { Injectable } from '@nestjs/common';
import { UnsupportedGatewayPaymentProvider } from '../base/unsupported-gateway-payment.provider';

@Injectable()
export class InfinityPayGatewayPaymentProvider extends UnsupportedGatewayPaymentProvider {
  constructor() {
    super('infinity_pay', [
      'infinity_pay',
      'infinitypay',
      'infinity-pay',
      'infinity',
    ]);
  }
}
