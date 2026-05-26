import { Injectable } from '@nestjs/common';
import { UnsupportedGatewayPaymentProvider } from '../base/unsupported-gateway-payment.provider';

@Injectable()
export class PagSeguroGatewayPaymentProvider extends UnsupportedGatewayPaymentProvider {
  constructor() {
    super('pagseguro', ['pagseguro', 'pag_seguro', 'pag-seguro']);
  }
}
