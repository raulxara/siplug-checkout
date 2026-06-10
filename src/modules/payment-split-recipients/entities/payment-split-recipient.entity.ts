import type { IPaymentSplitRecipientsRepository } from './payment-split-recipients-repository.interface';

export class PaymentSplitRecipientEntity {
  public id: number | null = null;
  public _id: string | null = null;

  public paymentSplitId!: string;
  public splitRecipientId!: string;

  public gatewayRecipientId: string | null = null;
  public gatewayTransferId: string | null = null;

  public role: string = 'secondary';
  public amount!: number;
  public percentage: number | null = null;
  public currency!: string;

  public providerPayload: Record<string, unknown> | null = null;
  public providerResponse: Record<string, unknown> | null = null;
  public gatewayResponse: Record<string, unknown> | null = null;
  public metadata: Record<string, unknown> | null = null;
  public config: Record<string, unknown> | null = null;
  public changesHistory: Array<Record<string, unknown>> | null = null;

  public status: string = 'created';
  public createdAt: string | null = null;
  public updatedAt: string | null = null;

  constructor(
    private readonly paymentSplitRecipientsRepository?: IPaymentSplitRecipientsRepository,
  ) {}

  async create(): Promise<PaymentSplitRecipientEntity> {
    if (!this.paymentSplitRecipientsRepository) {
      throw new Error('paymentSplitRecipientsRepository is required');
    }

    const created = await this.paymentSplitRecipientsRepository.create(this);

    this.id = created.id;
    this._id = created._id;

    this.paymentSplitId = created.paymentSplitId;
    this.splitRecipientId = created.splitRecipientId;

    this.gatewayRecipientId = created.gatewayRecipientId;
    this.gatewayTransferId = created.gatewayTransferId;

    this.role = created.role;
    this.amount = created.amount;
    this.percentage = created.percentage;
    this.currency = created.currency;

    this.providerPayload = created.providerPayload;
    this.providerResponse = created.providerResponse;
    this.gatewayResponse = created.gatewayResponse;
    this.metadata = created.metadata;
    this.config = created.config;
    this.changesHistory = created.changesHistory;

    this.status = created.status;
    this.createdAt = created.createdAt;
    this.updatedAt = created.updatedAt;

    return this;
  }
}
