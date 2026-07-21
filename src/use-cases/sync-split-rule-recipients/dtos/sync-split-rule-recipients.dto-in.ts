export type SyncSplitRuleRecipientItemDtoIn = {
  splitRecipientId: string;
  role: string;
  percentage: number | null;
  fixedAmount: number | null;
  liableForGatewayFee: boolean;
  liableForRefund: boolean;
  priority: number;
  metadata: Record<string, unknown> | null;
  config: Record<string, unknown> | null;
  status: string;
};

export class SyncSplitRuleRecipientsDtoIn {
  public readonly token: string;
  public readonly splitRuleId: string;
  public readonly recipients: SyncSplitRuleRecipientItemDtoIn[];

  constructor(params: {
    token?: unknown;
    splitRuleId?: unknown;
    recipients?: unknown;
  }) {
    this.token = String(params.token ?? '').trim();
    this.splitRuleId = String(params.splitRuleId ?? '').trim();

    if (this.token === '') {
      throw new Error('token is required');
    }

    if (this.splitRuleId === '') {
      throw new Error('splitRuleId is required');
    }

    if (!Array.isArray(params.recipients)) {
      throw new Error('recipients must be an array');
    }

    this.recipients = params.recipients.map((item) =>
      this.parseRecipient(item),
    );

    if (this.recipients.length === 0) {
      throw new Error('recipients cannot be empty');
    }

    this.validateRuleComposition();
  }

  private parseRecipient(value: unknown): SyncSplitRuleRecipientItemDtoIn {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new Error('recipient item must be an object');
    }

    const item = value as Record<string, unknown>;

    const splitRecipientId = String(item.splitRecipientId ?? '').trim();

    if (splitRecipientId === '') {
      throw new Error('recipient.splitRecipientId is required');
    }

    return {
      splitRecipientId,
      role: this.toNullableString(item.role) ?? 'secondary',
      percentage: this.toNullableNumber(item.percentage),
      fixedAmount: this.toNullableNumber(item.fixedAmount),
      liableForGatewayFee: this.toBoolean(item.liableForGatewayFee, false),
      liableForRefund: this.toBoolean(item.liableForRefund, false),
      priority: this.toNumber(item.priority, 0),
      metadata: this.toNullableObject(item.metadata),
      config: this.toNullableObject(item.config),
      status: this.toNullableString(item.status) ?? 'active',
    };
  }

  private validateRuleComposition(): void {
    const uniqueRecipients = new Set<string>();

    let percentageTotal = 0;
    let hasPercentage = false;
    let hasFixedAmount = false;

    for (const recipient of this.recipients) {
      if (uniqueRecipients.has(recipient.splitRecipientId)) {
        throw new Error(
          `duplicated splitRecipientId: ${recipient.splitRecipientId}`,
        );
      }

      uniqueRecipients.add(recipient.splitRecipientId);

      if (recipient.percentage !== null) {
        hasPercentage = true;
        percentageTotal += recipient.percentage;
      }

      if (recipient.fixedAmount !== null) {
        hasFixedAmount = true;
      }
    }

    if (hasPercentage && percentageTotal > 100) {
      throw new Error('percentage total cannot be greater than 100');
    }

    if (!hasPercentage && !hasFixedAmount) {
      throw new Error(
        'at least one recipient must have percentage or fixedAmount',
      );
    }
  }

  private toNullableString(value: unknown): string | null {
    if (value === undefined || value === null) {
      return null;
    }

    const stringValue = String(value).trim();

    return stringValue === '' ? null : stringValue;
  }

  private toNullableNumber(value: unknown): number | null {
    if (value === undefined || value === null || value === '') {
      return null;
    }

    const numberValue = Number(value);

    if (!Number.isFinite(numberValue)) {
      throw new Error(`invalid number value: ${String(value)}`);
    }

    return numberValue;
  }

  private toNumber(value: unknown, fallback: number): number {
    const nullable = this.toNullableNumber(value);

    return nullable === null ? fallback : nullable;
  }

  private toBoolean(value: unknown, fallback: boolean): boolean {
    if (value === undefined || value === null || value === '') {
      return fallback;
    }

    if (typeof value === 'boolean') {
      return value;
    }

    const normalized = String(value).toLowerCase().trim();

    return normalized === 'true' || normalized === '1' || normalized === 'yes';
  }

  private toNullableObject(value: unknown): Record<string, unknown> | null {
    if (value === undefined || value === null) {
      return null;
    }

    if (typeof value !== 'object' || Array.isArray(value)) {
      throw new Error('value must be an object');
    }

    return value as Record<string, unknown>;
  }
}
