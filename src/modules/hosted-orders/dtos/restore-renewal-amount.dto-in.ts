export interface RestoreRenewalAmountDtoIn {
  token: string;
  subscriptionId: string;
  reference: string;
  firstAmount: number;
  renewalAmount: number;
  currency: string;
}
