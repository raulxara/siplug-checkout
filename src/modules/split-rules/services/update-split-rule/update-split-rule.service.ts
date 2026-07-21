import { Inject, Injectable } from '@nestjs/common';

import { BuildChangesHistoryService } from '../../../../common/services/changes-history/build-changes-history.service';
import type { ISplitRulesRepository } from '../../entities/split-rules-repository.interface';
import { SPLIT_RULES_REPOSITORY } from '../../tokens/split-rules.tokens';
import { UpdateSplitRuleDtoIn } from './dtos/update-split-rule.dto-in';
import { UpdateSplitRuleDtoOut } from './dtos/update-split-rule.dto-out';

@Injectable()
export class UpdateSplitRuleService {
  constructor(
    @Inject(SPLIT_RULES_REPOSITORY)
    private readonly splitRulesRepository: ISplitRulesRepository,

    private readonly buildChangesHistoryService: BuildChangesHistoryService,
  ) {}

  async exec(dtoIn: UpdateSplitRuleDtoIn): Promise<UpdateSplitRuleDtoOut> {
    const current = await this.splitRulesRepository.findByUniqueId(dtoIn._id);

    if (current === null) {
      throw new Error('split rule not found');
    }

    if (dtoIn.slug !== null) {
      const existingBySlug = await this.splitRulesRepository.findByOfficeIdAndSlug(
        current.officeId,
        dtoIn.slug,
      );

      if (existingBySlug !== null && existingBySlug._id !== dtoIn._id) {
        throw new Error('split rule slug already exists for this office');
      }
    }

    const newDataForHistory = this.buildNewDataForHistory(dtoIn);

    const changesHistory = this.buildChangesHistoryService.exec({
      currentChangesHistory: current.changesHistory ?? null,
      oldData: current as unknown as Record<string, unknown>,
      newData: newDataForHistory,
      source: dtoIn.source,
    });

    const updated = await this.splitRulesRepository.updateByUniqueId(dtoIn._id, {
      office_id: dtoIn.officeId,
      client_id: dtoIn.clientId,
      gateway_id: dtoIn.gatewayId,

      name: dtoIn.name,
      slug: dtoIn.slug,
      description: dtoIn.description,
      split_type: dtoIn.splitType,
      calculation_base: dtoIn.calculationBase,
      priority: dtoIn.priority,

      metadata: dtoIn.metadata,
      config: dtoIn.config,

      changes_history: changesHistory,
      status: dtoIn.status,
    });

    return new UpdateSplitRuleDtoOut(
      updated as unknown as Record<string, unknown>,
    );
  }

  private buildNewDataForHistory(
    dtoIn: UpdateSplitRuleDtoIn,
  ): Record<string, unknown> {
    const newData: Record<string, unknown> = {};

    this.addIfNotNull(newData, 'officeId', dtoIn.officeId);
    this.addIfNotNull(newData, 'clientId', dtoIn.clientId);
    this.addIfNotNull(newData, 'gatewayId', dtoIn.gatewayId);

    this.addIfNotNull(newData, 'name', dtoIn.name);
    this.addIfNotNull(newData, 'slug', dtoIn.slug);
    this.addIfNotNull(newData, 'description', dtoIn.description);
    this.addIfNotNull(newData, 'splitType', dtoIn.splitType);
    this.addIfNotNull(newData, 'calculationBase', dtoIn.calculationBase);
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
