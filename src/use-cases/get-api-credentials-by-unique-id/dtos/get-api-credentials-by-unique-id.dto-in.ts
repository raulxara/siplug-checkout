export class GetApiCredentialsByUniqueIdDtoIn {
  public readonly apiCredentialId: string;

  constructor(params: { apiCredentialId?: unknown; _id?: unknown }) {
    this.apiCredentialId = String(
      params.apiCredentialId ?? params._id ?? '',
    ).trim();

    if (this.apiCredentialId === '') {
      throw new Error('apiCredentialId is required');
    }
  }
}
