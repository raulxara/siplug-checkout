export class UpdateSplitRecipientDtoIn {
  constructor(
    public readonly _id: string,

    public readonly officeId: string | null,
    public readonly clientId: string | null,
    public readonly gatewayId: string | null,
    public readonly apiCredentialId: string | null,

    public readonly name: string | null,
    public readonly documentType: string | null,
    public readonly documentValue: string | null,
    public readonly email: string | null,

    public readonly gatewayProvider: string | null,
    public readonly gatewayRecipientId: string | null,
    public readonly gatewayAccountId: string | null,

    public readonly bankData: Record<string, unknown> | null,
    public readonly metadata: Record<string, unknown> | null,
    public readonly config: Record<string, unknown> | null,

    public readonly status: string | null,
    public readonly source: string,
  ) {}
}
