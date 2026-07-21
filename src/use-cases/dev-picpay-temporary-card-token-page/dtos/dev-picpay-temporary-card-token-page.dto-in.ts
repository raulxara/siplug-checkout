export class DevPicPayTemporaryCardTokenPageDtoIn {
  public readonly apiCredentialId: string;

  constructor(params: { apiCredentialId?: unknown }) {
    this.apiCredentialId = String(params.apiCredentialId ?? '').trim();

    if (this.apiCredentialId === '') {
      throw new Error('apiCredentialId is required');
    }
  }
}