import type { ApiCredentialRow } from '../../../entities/api-credentials-repository.interface';

export class FindActiveApiCredentialBySlugDtoOut {
  constructor(public readonly apiCredential: ApiCredentialRow) {}
}