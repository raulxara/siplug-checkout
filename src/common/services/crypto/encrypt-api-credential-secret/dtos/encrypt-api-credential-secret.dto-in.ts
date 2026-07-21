export class EncryptApiCredentialSecretDtoIn {
  public readonly apiCredential: Record<string, unknown>;
  public readonly keysToEncrypt: string[];
  public readonly encryptedPrefix: string;
  public readonly strict: boolean;

  constructor(params: {
    apiCredential: Record<string, unknown>;
    keysToEncrypt?: string[];
    encryptedPrefix?: string;
    strict?: boolean;
  }) {
    this.apiCredential = params.apiCredential;
    this.keysToEncrypt = params.keysToEncrypt ?? [
      'token',
      'secret',
      'password',
      'apiKey',
      'api_key',
      'clientSecret',
      'client_secret',
      'accessToken',
      'access_token',
      'privateKey',
      'private_key',
      'webhookSecret',
      'webhook_secret',
    ];
    this.encryptedPrefix = params.encryptedPrefix ?? 'enc::';
    this.strict = params.strict ?? false;
  }
}