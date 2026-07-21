import type { ISplitRulesRepository } from './split-rules-repository.interface';

export class SplitRuleEntity {
  public id: number | null = null;
  public _id: string | null = null;

  public officeId!: string;
  public clientId!: string;
  public gatewayId: string | null = null;

  public name!: string;
  public slug!: string;
  public description: string | null = null;
  public splitType!: string;
  public calculationBase: string = 'gross_amount';
  public priority: number = 0;

  public metadata: Record<string, unknown> | null = null;
  public config: Record<string, unknown> | null = null;
  public changesHistory: Array<Record<string, unknown>> | null = null;

  public status: string = 'active';
  public createdAt: string | null = null;
  public updatedAt: string | null = null;

  constructor(private readonly splitRulesRepository?: ISplitRulesRepository) {}

  async create(): Promise<SplitRuleEntity> {
    if (!this.splitRulesRepository) {
      throw new Error('splitRulesRepository is required');
    }

    const created = await this.splitRulesRepository.create(this);

    this.id = created.id;
    this._id = created._id;

    this.officeId = created.officeId;
    this.clientId = created.clientId;
    this.gatewayId = created.gatewayId;

    this.name = created.name;
    this.slug = created.slug;
    this.description = created.description;
    this.splitType = created.splitType;
    this.calculationBase = created.calculationBase;
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
