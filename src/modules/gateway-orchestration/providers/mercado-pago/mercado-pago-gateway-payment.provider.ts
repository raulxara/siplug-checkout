import { Injectable } from '@nestjs/common';
import { UnsupportedGatewayPaymentProvider } from '../base/unsupported-gateway-payment.provider';

@Injectable()
export class MercadoPagoGatewayPaymentProvider extends UnsupportedGatewayPaymentProvider {
  constructor() {
    super('mercado_pago', ['mercado_pago', 'mercadopago', 'mercado-pago']);
  }
}
