export class ResolvePaymentGatewayCredentialDtoIn {
  public readonly officeId: string;
  public readonly clientId: string;
  public readonly paymentType: string;
  public readonly paymentMethod: string;

  constructor(params: {
    officeId: string;
    clientId: string;
    paymentType: string;
    paymentMethod: string;
  }) {
    this.officeId = params.officeId;
    this.clientId = params.clientId;
    this.paymentType = params.paymentType;
    this.paymentMethod = params.paymentMethod;

    if (this.officeId.trim() === '') {
      throw new Error('officeId is required');
    }

    if (this.clientId.trim() === '') {
      throw new Error('clientId is required');
    }

    if (this.paymentType.trim() === '') {
      throw new Error('paymentType is required');
    }

    if (this.paymentMethod.trim() === '') {
      throw new Error('paymentMethod is required');
    }
  }
}
