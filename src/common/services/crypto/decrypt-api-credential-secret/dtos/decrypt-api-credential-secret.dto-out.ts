export class DecryptApiCredentialSecretDtoOut {
  constructor(
    public readonly apiCredential: Record<string, unknown>,
    public readonly decryptedKeys: string[],
  ) {}
}