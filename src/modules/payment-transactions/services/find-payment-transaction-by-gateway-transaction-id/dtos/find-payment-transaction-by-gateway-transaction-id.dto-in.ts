export class FindPaymentTransactionByGatewayTransactionIdDtoIn {
  public readonly gatewayTransactionId: string;

  constructor(gatewayTransactionId: string) {
    this.gatewayTransactionId = gatewayTransactionId;

    if (this.gatewayTransactionId.trim() === '') {
      throw new Error('gatewayTransactionId is required');
    }
  }
}
