export class GetAllCheckoutSessionsByOfficeIdDtoIn {
  public readonly officeId: string;

  constructor(officeId: string) {
    this.officeId = officeId;

    if (this.officeId.trim() === '') {
      throw new Error('officeId is required');
    }
  }
}