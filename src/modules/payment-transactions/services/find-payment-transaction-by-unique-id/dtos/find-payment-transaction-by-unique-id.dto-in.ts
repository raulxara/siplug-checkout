export class FindPaymentTransactionByUniqueIdDtoIn {
  public readonly _id: string;

  constructor(_id: string) {
    this._id = _id;

    if (this._id.trim() === '') {
      throw new Error('_id is required');
    }
  }
}
