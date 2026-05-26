import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { generateUniqueId } from '../../../common/utils/generate-unique-id.util';
import { formatDateTime } from '../../../common/utils/format-date-time.util';
import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { CheckoutSessionItemEntity } from '../entities/checkout-session-item.entity';
import type {
  CheckoutSessionItemRow,
  ICheckoutSessionItemsRepository,
} from '../entities/checkout-session-items-repository.interface';

@Injectable()
export class CheckoutSessionItemsRepository
  implements ICheckoutSessionItemsRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(
    entity: CheckoutSessionItemEntity,
  ): Promise<CheckoutSessionItemEntity> {
    const model = await this.prisma.checkoutSessionItem.create({
      data: {
        unique_id: entity._id ?? generateUniqueId(),
        checkout_session_id: entity.checkoutSessionId,

        item_ref: entity.itemRef,
        item_type: entity.itemType,
        name: entity.name,
        description: entity.description,

        quantity: entity.quantity,
        unit_amount: entity.unitAmount,
        total_amount: entity.totalAmount,

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
      },
    });

    const fresh = new CheckoutSessionItemEntity(this);

    fresh.id = model.id;
    fresh._id = model.unique_id;
    fresh.checkoutSessionId = model.checkout_session_id;

    fresh.itemRef = model.item_ref;
    fresh.itemType = model.item_type;
    fresh.name = model.name;
    fresh.description = model.description;

    fresh.quantity = model.quantity;
    fresh.unitAmount = model.unit_amount;
    fresh.totalAmount = model.total_amount;

    fresh.metadata = this.parseJsonObject(model.metadata);
    fresh.config = this.parseJsonObject(model.config);
    fresh.changesHistory = this.parseChangesHistory(model.changes_history);

    fresh.status = model.status;
    fresh.createdAt = formatDateTime(model.created_at);
    fresh.updatedAt = model.updated_at ? formatDateTime(model.updated_at) : null;

    return fresh;
  }

  async updateByUniqueId(
    _id: string,
    data: Record<string, unknown>,
  ): Promise<CheckoutSessionItemRow> {
    const updateData: Prisma.CheckoutSessionItemUncheckedUpdateInput = {};

    if (
      data.checkout_session_id !== undefined &&
      data.checkout_session_id !== null
    ) {
      updateData.checkout_session_id = String(data.checkout_session_id);
    }

    if (data.item_ref !== undefined && data.item_ref !== null) {
      updateData.item_ref = String(data.item_ref);
    }

    if (data.item_type !== undefined && data.item_type !== null) {
      updateData.item_type = String(data.item_type);
    }

    if (data.name !== undefined && data.name !== null) {
      updateData.name = String(data.name);
    }

    if (data.description !== undefined && data.description !== null) {
      updateData.description = String(data.description);
    }

    if (data.quantity !== undefined && data.quantity !== null) {
      updateData.quantity = Number(data.quantity);
    }

    if (data.unit_amount !== undefined && data.unit_amount !== null) {
      updateData.unit_amount = Number(data.unit_amount);
    }

    if (data.total_amount !== undefined && data.total_amount !== null) {
      updateData.total_amount = Number(data.total_amount);
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

    const model = await this.prisma.checkoutSessionItem.update({
      where: {
        unique_id: _id,
      },
      data: updateData,
    });

    return this.toRow(model);
  }

  async findByUniqueId(_id: string): Promise<CheckoutSessionItemRow | null> {
    const model = await this.prisma.checkoutSessionItem.findUnique({
      where: {
        unique_id: _id,
      },
    });

    return model ? this.toRow(model) : null;
  }

  async getAllByCheckoutSessionId(
    checkoutSessionId: string,
  ): Promise<CheckoutSessionItemRow[]> {
    const rows = await this.prisma.checkoutSessionItem.findMany({
      where: {
        checkout_session_id: checkoutSessionId,
      },
      orderBy: {
        id: 'asc',
      },
    });

    return rows.map((row) => this.toRow(row));
  }

  private toRow(model: {
    id: number;
    unique_id: string;
    checkout_session_id: string;

    item_ref: string | null;
    item_type: string | null;
    name: string;
    description: string | null;

    quantity: number;
    unit_amount: number;
    total_amount: number;

    metadata: Prisma.JsonValue | null;
    config: Prisma.JsonValue | null;
    changes_history: Prisma.JsonValue | null;

    status: string;

    created_at: Date;
    updated_at: Date | null;
  }): CheckoutSessionItemRow {
    return {
      id: model.id,
      _id: model.unique_id,
      checkoutSessionId: model.checkout_session_id,

      itemRef: model.item_ref,
      itemType: model.item_type,
      name: model.name,
      description: model.description,

      quantity: model.quantity,
      unitAmount: model.unit_amount,
      totalAmount: model.total_amount,

      metadata: this.parseJsonObject(model.metadata),
      config: this.parseJsonObject(model.config),
      changesHistory: this.parseChangesHistory(model.changes_history),

      status: model.status,

      createdAt: formatDateTime(model.created_at),
      updatedAt: model.updated_at ? formatDateTime(model.updated_at) : null,
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
