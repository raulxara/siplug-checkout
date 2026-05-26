import { Injectable } from '@nestjs/common';
import { UnsupportedGatewayPaymentProvider } from '../base/unsupported-gateway-payment.provider';

@Injectable()
export class CieloGatewayPaymentProvider extends UnsupportedGatewayPaymentProvider {
  constructor() {
    super('cielo', ['cielo']);
  }
}
