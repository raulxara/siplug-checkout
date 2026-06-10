import type { IPaymentSplitsRepository } from './payment-splits-repository.interface';

export class PaymentSplitEntity {
  public id: number | null = null;
  public _id: string | null = null;

  public officeId!: string;
  public clientId!: string;
  public checkoutSessionId: string | null = null;
  public paymentTransactionId!: string;
  public subscriptionId: string | null = null;
  public subscriptionInvoiceId: string | null = null;
  public splitRuleId: string | null = null;

  public gatewayProvider!: string;
  public gatewaySplitId: string | null = null;

  public amount!: number;
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
    private readonly paymentSplitsRepository?: IPaymentSplitsRepository,
  ) {}

  async create(): Promise<PaymentSplitEntity> {
    if (!this.paymentSplitsRepository) {
      throw new Error('paymentSplitsRepository is required');
    }

    const created = await this.paymentSplitsRepository.create(this);

    this.id = created.id;
    this._id = created._id;

    this.officeId = created.officeId;
    this.clientId = created.clientId;
    this.checkoutSessionId = created.checkoutSessionId;
    this.paymentTransactionId = created.paymentTransactionId;
    this.subscriptionId = created.subscriptionId;
    this.subscriptionInvoiceId = created.subscriptionInvoiceId;
    this.splitRuleId = created.splitRuleId;

    this.gatewayProvider = created.gatewayProvider;
    this.gatewaySplitId = created.gatewaySplitId;

    this.amount = created.amount;
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