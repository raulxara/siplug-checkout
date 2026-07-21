import type { ISplitRecipientsRepository } from './split-recipients-repository.interface';

export class SplitRecipientEntity {
  public id: number | null = null;
  public _id: string | null = null;

  public officeId!: string;
  public clientId!: string;
  public gatewayId: string | null = null;
  public apiCredentialId: string | null = null;

  public name!: string;
  public documentType: string | null = null;
  public documentValue: string | null = null;
  public email: string | null = null;

  public gatewayProvider: string | null = null;
  public gatewayRecipientId: string | null = null;
  public gatewayAccountId: string | null = null;

  public bankData: Record<string, unknown> | null = null;
  public metadata: Record<string, unknown> | null = null;
  public config: Record<string, unknown> | null = null;
  public changesHistory: Array<Record<string, unknown>> | null = null;

  public status: string = 'active';
  public createdAt: string | null = null;
  public updatedAt: string | null = null;

  constructor(
    private readonly splitRecipientsRepository?: ISplitRecipientsRepository,
  ) {}

  async create(): Promise<SplitRecipientEntity> {
    if (!this.splitRecipientsRepository) {
      throw new Error('splitRecipientsRepository is required');
    }

    const created = await this.splitRecipientsRepository.create(this);

    this.id = created.id;
    this._id = created._id;

    this.officeId = created.officeId;
    this.clientId = created.clientId;
    this.gatewayId = created.gatewayId;
    this.apiCredentialId = created.apiCredentialId;

    this.name = created.name;
    this.documentType = created.documentType;
    this.documentValue = created.documentValue;
    this.email = created.email;

    this.gatewayProvider = created.gatewayProvider;
    this.gatewayRecipientId = created.gatewayRecipientId;
    this.gatewayAccountId = created.gatewayAccountId;

    this.bankData = created.bankData;
    this.metadata = created.metadata;
    this.config = created.config;
    this.changesHistory = created.changesHistory;

    this.status = created.status;
    this.createdAt = created.createdAt;
    this.updatedAt = created.updatedAt;

    return this;
  }
}