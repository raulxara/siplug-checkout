import type { ApiCredentialRow } from '../../../entities/api-credentials-repository.interface';

export class UpdateApiCredentialDtoOut {
  constructor(public readonly apiCredential: ApiCredentialRow) {}
}