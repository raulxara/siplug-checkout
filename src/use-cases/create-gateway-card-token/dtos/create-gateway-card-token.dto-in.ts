export class CreateGatewayCardTokenDtoIn {
  public readonly apiCredentialId: string;
  public readonly cardNumber: string;
  public readonly securityCode: string;
  public readonly expirationMonth: string;
  public readonly expirationYear: string;
  public readonly cardholderName: string;
  public readonly documentType: string;
  public readonly documentValue: string;

  constructor(params: {
    apiCredentialId?: unknown;
    cardNumber?: unknown;
    securityCode?: unknown;
    expirationMonth?: unknown;
    expirationYear?: unknown;
    cardholderName?: unknown;
    documentType?: unknown;
    documentValue?: unknown;
  }) {
    this.apiCredentialId = String(params.apiCredentialId ?? '').trim();

    this.cardNumber = String(params.cardNumber ?? '').replace(/\D/g, '');
    this.securityCode = String(params.securityCode ?? '').replace(/\D/g, '');
    this.expirationMonth = String(params.expirationMonth ?? '').replace(/\D/g, '');
    this.expirationYear = String(params.expirationYear ?? '').replace(/\D/g, '');

    this.cardholderName = String(params.cardholderName ?? '').trim();
    this.documentType = String(params.documentType ?? '').trim().toUpperCase();
    this.documentValue = String(params.documentValue ?? '').replace(/\D/g, '');

    if (this.apiCredentialId === '') {
      throw new Error('apiCredentialId is required');
    }

    if (this.cardNumber === '') {
      throw new Error('cardNumber is required');
    }

    if (this.securityCode === '') {
      throw new Error('securityCode is required');
    }

    if (this.expirationMonth === '') {
      throw new Error('expirationMonth is required');
    }

    if (this.expirationYear === '') {
      throw new Error('expirationYear is required');
    }

    if (this.cardholderName === '') {
      throw new Error('cardholderName is required');
    }

    if (this.documentType === '') {
      throw new Error('documentType is required');
    }

    if (this.documentValue === '') {
      throw new Error('documentValue is required');
    }
  }
}