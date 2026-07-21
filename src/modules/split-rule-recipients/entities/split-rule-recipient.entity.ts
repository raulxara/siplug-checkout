import type { ISplitRuleRecipientsRepository } from './split-rule-recipients-repository.interface';

export class SplitRuleRecipientEntity {
  public id: number | null = null;
  public _id: string | null = null;

  public splitRuleId!: string;
  public splitRecipientId!: string;

  public role: string = 'secondary';
  public percentage: number | null = null;
  public fixedAmount: number | null = null;
  public liableForGatewayFee: boolean = false;
  public liableForRefund: boolean = false;
  public priority: number = 0;

  public metadata: Record<string, unknown> | null = null;
  public config: Record<string, unknown> | null = null;
  public changesHistory: Array<Record<string, unknown>> | null = null;

  public status: string = 'active';
  public createdAt: string | null = null;
  public updatedAt: string | null = null;

  constructor(
    private readonly splitRuleRecipientsRepository?: ISplitRuleRecipientsRepository,
  ) {}

  async create(): Promise<SplitRuleRecipientEntity> {
    if (!this.splitRuleRecipientsRepository) {
      throw new Error('splitRuleRecipientsRepository is required');
    }

    const created = await this.splitRuleRecipientsRepository.create(this);

    this.id = created.id;
    this._id = created._id;

    this.splitRuleId = created.splitRuleId;
    this.splitRecipientId = created.splitRecipientId;

    this.role = created.role;
    this.percentage = created.percentage;
    this.fixedAmount = created.fixedAmount;
    this.liableForGatewayFee = created.liableForGatewayFee;
    this.liableForRefund = created.liableForRefund;
    this.priority = created.priority;

    this.metadata = created.metadata;
    this.config = created.config;
    this.changesHistory = created.changesHistory;

    this.status = created.status;
    this.createdAt = created.createdAt;
    this.updatedAt = created.updatedAt;

    return this;
  }
}
