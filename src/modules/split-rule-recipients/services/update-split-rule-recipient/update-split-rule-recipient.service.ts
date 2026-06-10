import { Inject, Injectable } from '@nestjs/common';

import { BuildChangesHistoryService } from '../../../../common/services/changes-history/build-changes-history.service';
import type { ISplitRuleRecipientsRepository } from '../../entities/split-rule-recipients-repository.interface';
import { SPLIT_RULE_RECIPIENTS_REPOSITORY } from '../../tokens/split-rule-recipients.tokens';
import { UpdateSplitRuleRecipientDtoIn } from './dtos/update-split-rule-recipient.dto-in';
import { UpdateSplitRuleRecipientDtoOut } from './dtos/update-split-rule-recipient.dto-out';

@Injectable()
export class UpdateSplitRuleRecipientService {
  constructor(
    @Inject(SPLIT_RULE_RECIPIENTS_REPOSITORY)
    private readonly splitRuleRecipientsRepository: ISplitRuleRecipientsRepository,

    private readonly buildChangesHistoryService: BuildChangesHistoryService,
  ) {}

  async exec(
    dtoIn: UpdateSplitRuleRecipientDtoIn,
  ): Promise<UpdateSplitRuleRecipientDtoOut> {
    const current = await this.splitRuleRecipientsRepository.findByUniqueId(
      dtoIn._id,
    );

    if (current === null) {
      throw new Error('split rule recipient not found');
    }

    const newDataForHistory = this.buildNewDataForHistory(dtoIn);

    const changesHistory = this.buildChangesHistoryService.exec({
      currentChangesHistory: current.changesHistory ?? null,
      oldData: current as unknown as Record<string, unknown>,
      newData: newDataForHistory,
      source: dtoIn.source,
    });

    const updated = await this.splitRuleRecipientsRepository.updateByUniqueId(
      dtoIn._id,
      {
        split_rule_id: dtoIn.splitRuleId,
        split_recipient_id: dtoIn.splitRecipientId,

        role: dtoIn.role,
        percentage: dtoIn.percentage,
        fixed_amount: dtoIn.fixedAmount,
        liable_for_gateway_fee: dtoIn.liableForGatewayFee,
        liable_for_refund: dtoIn.liableForRefund,
        priority: dtoIn.priority,

        metadata: dtoIn.metadata,
        config: dtoIn.config,

        changes_history: changesHistory,
        status: dtoIn.status,
      },
    );

    return new UpdateSplitRuleRecipientDtoOut(
      updated as unknown as Record<string, unknown>,
    );
  }

  private buildNewDataForHistory(
    dtoIn: UpdateSplitRuleRecipientDtoIn,
  ): Record<string, unknown> {
    const newData: Record<string, unknown> = {};

    this.addIfNotNull(newData, 'splitRuleId', dtoIn.splitRuleId);
    this.addIfNotNull(newData, 'splitRecipientId', dtoIn.splitRecipientId);
    this.addIfNotNull(newData, 'role', dtoIn.role);
    this.addIfNotNull(newData, 'percentage', dtoIn.percentage);
    this.addIfNotNull(newData, 'fixedAmount', dtoIn.fixedAmount);
    this.addIfNotNull(
      newData,
      'liableForGatewayFee',
      dtoIn.liableForGatewayFee,
    );
    this.addIfNotNull(newData, 'liableForRefund', dtoIn.liableForRefund);
    this.addIfNotNull(newData, 'priority', dtoIn.priority);
    this.addIfNotNull(newData, 'metadata', dtoIn.metadata);
    this.addIfNotNull(newData, 'config', dtoIn.config);
    this.addIfNotNull(newData, 'status', dtoIn.status);

    return newData;
  }

  private addIfNotNull(
    target: Record<string, unknown>,
    key: string,
    value: unknown,
  ): void {
    if (value !== null && value !== undefined) {
      target[key] = value;
    }
  }
}
