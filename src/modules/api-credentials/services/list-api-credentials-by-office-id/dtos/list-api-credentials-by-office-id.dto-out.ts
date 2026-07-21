import type { ApiCredentialRow } from '../../../entities/api-credentials-repository.interface';

export class ListApiCredentialsByOfficeIdDtoOut {
  constructor(public readonly apiCredentials: ApiCredentialRow[]) {}
}
