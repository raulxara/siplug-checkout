export class CreateSplitRecipientDtoIn {
  constructor(
    public readonly officeId: string,
    public readonly clientId: string,
    public readonly gatewayId: string | null,
    public readonly apiCredentialId: string | null,

    public readonly name: string,
    public readonly documentType: string | null,
    public readonly documentValue: string | null,
    public readonly email: string | null,

    public readonly gatewayProvider: string | null,
    public readonly gatewayRecipientId: string | null,
    public readonly gatewayAccountId: string | null,

    public readonly bankData: Record<string, unknown> | null,
    public readonly metadata: Record<string, unknown> | null,
    public readonly config: Record<string, unknown> | null,

    public readonly status: string,
  ) {}
}
