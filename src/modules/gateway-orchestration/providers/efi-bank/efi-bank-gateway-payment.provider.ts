import { Injectable } from '@nestjs/common';
import { UnsupportedGatewayPaymentProvider } from '../base/unsupported-gateway-payment.provider';

@Injectable()
export class EfiBankGatewayPaymentProvider extends UnsupportedGatewayPaymentProvider {
  constructor() {
    super('efi_bank', ['efi_bank', 'efibank', 'efi-bank', 'efi', 'efi_banco']);
  }
}
