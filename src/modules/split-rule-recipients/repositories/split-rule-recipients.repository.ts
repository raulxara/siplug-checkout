import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { generateUniqueId } from '../../../common/utils/generate-unique-id.util';
import { formatDateTime } from '../../../common/utils/format-date-time.util';
import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { SplitRuleRecipientEntity } from '../entities/split-rule-recipient.entity';
import type {
  ISplitRuleRecipientsRepository,
  SplitRuleRecipientRow,
} from '../entities/split-rule-recipients-repository.interface';

@Injectable()
export class SplitRuleRecipientsRepository
  implements ISplitRuleRecipientsRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(
    entity: SplitRuleRecipientEntity,
  ): Promise<SplitRuleRecipientEntity> {
    const data: Prisma.SplitRuleRecipientUncheckedCreateInput = {
      unique_id: entity._id ?? generateUniqueId(),

      split_rule_id: entity.splitRuleId,
      split_recipient_id: entity.splitRecipientId,

      role: entity.role ?? 'secondary',
      percentage:
        entity.percentage === null
          ? null
          : new Prisma.Decimal(String(entity.percentage)),
      fixed_amount: entity.fixedAmount,
      liable_for_gateway_fee: entity.liableForGatewayFee ?? false,
      liable_for_refund: entity.liableForRefund ?? false,
      priority: entity.priority ?? 0,

      metadata:
        entity.metadata === null
          ? Prisma.JsonNull
          : (entity.metadata as Prisma.InputJsonValue),

      config:
        entity.config === null
          ? Prisma.JsonNull
          : (entity.config as Prisma.InputJsonValue),

      changes_history:
        entity.changesHistory === null
          ? Prisma.JsonNull
          : (entity.changesHistory as Prisma.InputJsonValue),

      status: entity.status ?? 'active',
    };

    const model = await this.prisma.splitRuleRecipient.create({
      data,
    });

    const fresh = new SplitRuleRecipientEntity(this);

    fresh.id = model.id;
    fresh._id = model.unique_id;

    fresh.splitRuleId = model.split_rule_id;
    fresh.splitRecipientId = model.split_recipient_id;

    fresh.role = model.role;
    fresh.percentage =
      model.percentage === null ? null : Number(model.percentage.toString());
    fresh.fixedAmount = model.fixed_amount;
    fresh.liableForGatewayFee = model.liable_for_gateway_fee;
    fresh.liableForRefund = model.liable_for_refund;
    fresh.priority = model.priority;

    fresh.metadata = this.parseJsonObject(model.metadata);
    fresh.config = this.parseJsonObject(model.config);
    fresh.changesHistory = this.parseChangesHistory(model.changes_history);

    fresh.status = model.status;
    fresh.createdAt = formatDateTime(model.created_at);
    fresh.updatedAt = formatDateTime(model.updated_at);

    return fresh;
  }

  async updateByUniqueId(
    _id: string,
    data: Record<string, unknown>,
  ): Promise<SplitRuleRecipientRow> {
    const updateData: Prisma.SplitRuleRecipientUncheckedUpdateInput = {};

    if (data.split_rule_id !== undefined && data.split_rule_id !== null) {
      updateData.split_rule_id = String(data.split_rule_id);
    }

    if (
      data.split_recipient_id !== undefined &&
      data.split_recipient_id !== null
    ) {
      updateData.split_recipient_id = String(data.split_recipient_id);
    }

    if (data.role !== undefined && data.role !== null) {
      updateData.role = String(data.role);
    }

    if (data.percentage !== undefined && data.percentage !== null) {
      updateData.percentage = new Prisma.Decimal(String(data.percentage));
    }

    if (data.fixed_amount !== undefined && data.fixed_amount !== null) {
      updateData.fixed_amount = Number(data.fixed_amount);
    }

    if (
      data.liable_for_gateway_fee !== undefined &&
      data.liable_for_gateway_fee !== null
    ) {
      updateData.liable_for_gateway_fee = Boolean(data.liable_for_gateway_fee);
    }

    if (
      data.liable_for_refund !== undefined &&
      data.liable_for_refund !== null
    ) {
      updateData.liable_for_refund = Boolean(data.liable_for_refund);
    }

    if (data.priority !== undefined && data.priority !== null) {
      updateData.priority = Number(data.priority);
    }

    if (data.metadata !== undefined && data.metadata !== null) {
      updateData.metadata = data.metadata as Prisma.InputJsonValue;
    }

    if (data.config !== undefined && data.config !== null) {
      updateData.config = data.config as Prisma.InputJsonValue;
    }

    if (data.changes_history !== undefined && data.changes_history !== null) {
      updateData.changes_history =
        data.changes_history as Prisma.InputJsonValue;
    }

    if (data.status !== undefined && data.status !== null) {
      updateData.status = String(data.status);
    }

    const model = await this.prisma.splitRuleRecipient.update({
      where: {
        unique_id: _id,
      },
      data: updateData,
    });

    return this.toRow(model);
  }

  async findByUniqueId(_id: string): Promise<SplitRuleRecipientRow | null> {
    const model = await this.prisma.splitRuleRecipient.findUnique({
      where: {
        unique_id: _id,
      },
    });

    return model ? this.toRow(model) : null;
  }

  async findByRuleIdAndRecipientId(
    splitRuleId: string,
    splitRecipientId: string,
  ): Promise<SplitRuleRecipientRow | null> {
    const model = await this.prisma.splitRuleRecipient.findFirst({
      where: {
        split_rule_id: splitRuleId,
        split_recipient_id: splitRecipientId,
      },
    });

    return model ? this.toRow(model) : null;
  }

  async getAllBySplitRuleId(
    splitRuleId: string,
  ): Promise<SplitRuleRecipientRow[]> {
    const rows = await this.prisma.splitRuleRecipient.findMany({
      where: {
        split_rule_id: splitRuleId,
      },
      orderBy: {
        id: 'desc',
      },
    });

    return rows.map((row) => this.toRow(row));
  }

  private toRow(model: {
    id: number;
    unique_id: string;

    split_rule_id: string;
    split_recipient_id: string;

    role: string;
    percentage: Prisma.Decimal | null;
    fixed_amount: number | null;
    liable_for_gateway_fee: boolean;
    liable_for_refund: boolean;
    priority: number;

    metadata: Prisma.JsonValue | null;
    config: Prisma.JsonValue | null;
    changes_history: Prisma.JsonValue | null;

    status: string;
    created_at: Date;
    updated_at: Date;
  }): SplitRuleRecipientRow {
    return {
      id: model.id,
      _id: model.unique_id,

      splitRuleId: model.split_rule_id,
      splitRecipientId: model.split_recipient_id,

      role: model.role,
      percentage:
        model.percentage === null ? null : Number(model.percentage.toString()),
      fixedAmount: model.fixed_amount,
      liableForGatewayFee: model.liable_for_gateway_fee,
      liableForRefund: model.liable_for_refund,
      priority: model.priority,

      metadata: this.parseJsonObject(model.metadata),
      config: this.parseJsonObject(model.config),
      changesHistory: this.parseChangesHistory(model.changes_history),

      status: model.status,
      createdAt: formatDateTime(model.created_at),
      updatedAt: formatDateTime(model.updated_at),
    };
  }

  private parseJsonObject(
    value: Prisma.JsonValue | null,
  ): Record<string, unknown> | null {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return null;
    }

    return value as Record<string, unknown>;
  }

  private parseChangesHistory(
    value: Prisma.JsonValue | null,
  ): Array<Record<string, unknown>> | null {
    if (!Array.isArray(value)) {
      return null;
    }

    return value as Array<Record<string, unknown>>;
  }
}
