import { Injectable } from '@nestjs/common';
import { UnsupportedGatewayPaymentProvider } from '../base/unsupported-gateway-payment.provider';

@Injectable()
export class VindiGatewayPaymentProvider extends UnsupportedGatewayPaymentProvider {
  constructor() {
    super('vindi', ['vindi']);
  }
}
