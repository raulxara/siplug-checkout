export class GetAllUserPositionsByUserCustomerIdsDtoIn {
  public readonly userCustomerIds: string[];

  constructor(userCustomerIds: string[]) {
    this.userCustomerIds = userCustomerIds;

    if (
      !Array.isArray(this.userCustomerIds) ||
      this.userCustomerIds.length === 0
    ) {
      throw new Error('userCustomerIds is required');
    }

    for (const userCustomerId of this.userCustomerIds) {
      if (userCustomerId.trim() === '') {
        throw new Error('userCustomerIds contains invalid value');
      }
    }
  }
}