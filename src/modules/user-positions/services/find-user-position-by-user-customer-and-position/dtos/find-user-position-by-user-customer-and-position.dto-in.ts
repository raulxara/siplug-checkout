export class FindUserPositionByUserCustomerAndPositionDtoIn {
  public readonly userCustomerId: string;
  public readonly positionId: string;

  constructor(params: { userCustomerId: string; positionId: string }) {
    this.userCustomerId = params.userCustomerId;
    this.positionId = params.positionId;

    if (this.userCustomerId.trim() === '') {
      throw new Error('userCustomerId is required');
    }

    if (this.positionId.trim() === '') {
      throw new Error('positionId is required');
    }
  }
}