export class DecryptApiCredentialSecretDtoIn {
  public readonly apiCredential: Record<string, unknown>;
  public readonly keysToDecrypt: string[];
  public readonly encryptedPrefix: string;
  public readonly strict: boolean;

  constructor(params: {
    apiCredential: Record<string, unknown>;
    keysToDecrypt?: string[];
    encryptedPrefix?: string;
    strict?: boolean;
  }) {
    this.apiCredential = params.apiCredential;
    this.keysToDecrypt = params.keysToDecrypt ?? [
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