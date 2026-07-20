export class ListApiCredentialsByOfficeIdDtoIn {
  public readonly officeId: string;

  constructor(params: { officeId?: unknown }) {
    this.officeId = String(params.officeId ?? '').trim();

    if (this.officeId === '') {
      throw new Error('officeId is required');
    }
  }
}