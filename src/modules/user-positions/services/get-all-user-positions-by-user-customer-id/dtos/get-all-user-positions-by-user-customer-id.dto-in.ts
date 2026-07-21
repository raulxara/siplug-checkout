export class GetAllUserPositionsByUserCustomerIdDtoIn {
  public readonly userCustomerId: string;

  constructor(userCustomerId: string) {
    this.userCustomerId = userCustomerId;

    if (this.userCustomerId.trim() === '') {
      throw new Error('userCustomerId is required');
    }
  }
}