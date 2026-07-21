import type { ApiCredentialRow } from '../../../modules/api-credentials/entities/api-credentials-repository.interface';

export type SafeUpdatedApiCredentialRow = Omit<ApiCredentialRow, 'token'> & {
  tokenUpdated: boolean;
};

export class UpdateApiCredentialDtoOut {
  constructor(public readonly apiCredential: SafeUpdatedApiCredentialRow) {}
}