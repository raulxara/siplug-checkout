import { Injectable } from '@nestjs/common';
import { UnsupportedGatewayPaymentProvider } from '../base/unsupported-gateway-payment.provider';

@Injectable()
export class IuguGatewayPaymentProvider extends UnsupportedGatewayPaymentProvider {
  constructor() {
    super('iugu', ['iugu']);
  }
}
