export class GetAllSubscriptionsByOfficeIdDtoIn {
  public readonly officeId: string;

  constructor(officeId: unknown) {
    this.officeId = String(officeId ?? '').trim();

    if (this.officeId === '') {
      throw new Error('officeId is required');
    }
  }
}
