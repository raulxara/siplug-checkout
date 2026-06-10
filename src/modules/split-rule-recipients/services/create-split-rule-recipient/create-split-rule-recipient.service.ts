import { Inject, Injectable } from '@nestjs/common';

import { SplitRuleRecipientEntity } from '../../entities/split-rule-recipient.entity';
import type { ISplitRuleRecipientsRepository } from '../../entities/split-rule-recipients-repository.interface';
import { SPLIT_RULE_RECIPIENTS_REPOSITORY } from '../../tokens/split-rule-recipients.tokens';
import { CreateSplitRuleRecipientDtoIn } from './dtos/create-split-rule-recipient.dto-in';
import { CreateSplitRuleRecipientDtoOut } from './dtos/create-split-rule-recipient.dto-out';

@Injectable()
export class CreateSplitRuleRecipientService {
  constructor(
    @Inject(SPLIT_RULE_RECIPIENTS_REPOSITORY)
    private readonly splitRuleRecipientsRepository: ISplitRuleRecipientsRepository,
  ) {}

  async exec(
    dtoIn: CreateSplitRuleRecipientDtoIn,
  ): Promise<CreateSplitRuleRecipientDtoOut> {
    const entity = new SplitRuleRecipientEntity(
      this.splitRuleRecipientsRepository,
    );

    entity.splitRuleId = dtoIn.splitRuleId;
    entity.splitRecipientId = dtoIn.splitRecipientId;

    entity.role = dtoIn.role;
    entity.percentage = dtoIn.percentage;
    entity.fixedAmount = dtoIn.fixedAmount;
    entity.liableForGatewayFee = dtoIn.liableForGatewayFee;
    entity.liableForRefund = dtoIn.liableForRefund;
    entity.priority = dtoIn.priority;

    entity.metadata = dtoIn.metadata;
    entity.config = dtoIn.config;

    entity.changesHistory = [
      {
        source: 'CreateSplitRuleRecipientService',
        action: 'created',
        createdAt: new Date().toISOString(),
      },
    ];

    entity.status = dtoIn.status ?? 'active';

    const created = await entity.create();

    return new CreateSplitRuleRecipientDtoOut({
      id: created.id,
      _id: created._id,

      splitRuleId: created.splitRuleId,
      splitRecipientId: created.splitRecipientId,

      role: created.role,
      percentage: created.percentage,
      fixedAmount: created.fixedAmount,
      liableForGatewayFee: created.liableForGatewayFee,
      liableForRefund: created.liableForRefund,
      priority: created.priority,

      metadata: created.metadata,
      config: created.config,
      changesHistory: created.changesHistory,

      status: created.status,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    });
  }
}
