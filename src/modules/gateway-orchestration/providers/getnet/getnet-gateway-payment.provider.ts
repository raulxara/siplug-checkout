import { Injectable } from '@nestjs/common';
import { UnsupportedGatewayPaymentProvider } from '../base/unsupported-gateway-payment.provider';

@Injectable()
export class GetnetGatewayPaymentProvider extends UnsupportedGatewayPaymentProvider {
  constructor() {
    super('getnet', ['getnet', 'get_net', 'get-net']);
  }
}
