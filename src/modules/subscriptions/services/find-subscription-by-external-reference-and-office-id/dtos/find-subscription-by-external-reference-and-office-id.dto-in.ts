export class FindSubscriptionByExternalReferenceAndOfficeIdDtoIn {
  public readonly externalReference: string;
  public readonly officeId: string;

  constructor(params: {
    externalReference: string;
    officeId: string;
  }) {
    if (!params.externalReference || params.externalReference.trim() === '') {
      throw new Error('externalReference is required');
    }

    if (!params.officeId || params.officeId.trim() === '') {
      throw new Error('officeId is required');
    }

    this.externalReference = params.externalReference.trim();
    this.officeId = params.officeId.trim();
  }
}