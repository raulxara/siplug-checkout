export class GetAllUserCustomersByClientIdsDtoIn {
  public readonly clientIds: string[];

  constructor(clientIds: string[]) {
    this.clientIds = clientIds;

    if (!Array.isArray(this.clientIds) || this.clientIds.length === 0) {
      throw new Error('clientIds is required');
    }

    for (const clientId of this.clientIds) {
      if (clientId.trim() === '') {
        throw new Error('clientIds contains invalid value');
      }
    }
  }
}