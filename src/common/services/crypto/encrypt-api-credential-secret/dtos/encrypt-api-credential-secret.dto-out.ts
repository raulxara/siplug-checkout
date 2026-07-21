export class EncryptApiCredentialSecretDtoOut {
  constructor(
    public readonly apiCredential: Record<string, unknown>,
    public readonly encryptedKeys: string[],
  ) {}
}