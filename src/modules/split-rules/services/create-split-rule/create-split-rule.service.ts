import { Inject, Injectable } from '@nestjs/common';

import { SplitRuleEntity } from '../../entities/split-rule.entity';
import type { ISplitRulesRepository } from '../../entities/split-rules-repository.interface';
import { SPLIT_RULES_REPOSITORY } from '../../tokens/split-rules.tokens';
import { CreateSplitRuleDtoIn } from './dtos/create-split-rule.dto-in';
import { CreateSplitRuleDtoOut } from './dtos/create-split-rule.dto-out';

@Injectable()
export class CreateSplitRuleService {
  constructor(
    @Inject(SPLIT_RULES_REPOSITORY)
    private readonly splitRulesRepository: ISplitRulesRepository,
  ) {}

  async exec(dtoIn: CreateSplitRuleDtoIn): Promise<CreateSplitRuleDtoOut> {
    const existingSplitRule =
      await this.splitRulesRepository.findByOfficeIdAndSlug(
        dtoIn.officeId,
        dtoIn.slug,
      );

    if (existingSplitRule !== null) {
      throw new Error('split rule slug already exists for this office');
    }

    const entity = new SplitRuleEntity(this.splitRulesRepository);

    entity.officeId = dtoIn.officeId;
    entity.clientId = dtoIn.clientId;
    entity.gatewayId = dtoIn.gatewayId;

    entity.name = dtoIn.name;
    entity.slug = dtoIn.slug;
    entity.description = dtoIn.description;
    entity.splitType = dtoIn.splitType;
    entity.calculationBase = dtoIn.calculationBase;
    entity.priority = dtoIn.priority;

    entity.metadata = dtoIn.metadata;
    entity.config = dtoIn.config;

    entity.changesHistory = [
      {
        source: 'CreateSplitRuleService',
        action: 'created',
        createdAt: new Date().toISOString(),
      },
    ];

    entity.status = dtoIn.status ?? 'active';

    const created = await entity.create();

    return new CreateSplitRuleDtoOut({
      id: created.id,
      _id: created._id,

      officeId: created.officeId,
      clientId: created.clientId,
      gatewayId: created.gatewayId,

      name: created.name,
      slug: created.slug,
      description: created.description,
      splitType: created.splitType,
      calculationBase: created.calculationBase,
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
