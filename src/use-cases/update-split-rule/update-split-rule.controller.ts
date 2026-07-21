import { Body, Controller, Headers, Put } from '@nestjs/common';

import { UpdateSplitRuleDtoIn } from './dtos/update-split-rule.dto-in';
import { UpdateSplitRuleRequest } from './http/update-split-rule.request';
import { UpdateSplitRuleUseCase } from './update-split-rule.use-case';

@Controller('split-rules')
export class UpdateSplitRuleController {
  constructor(private readonly updateSplitRuleUseCase: UpdateSplitRuleUseCase) {}

  @Put('update')
  async handle(
    @Body() request: UpdateSplitRuleRequest,
    @Headers('authorization') authorization?: string,
  ) {
    const dtoOut = await this.updateSplitRuleUseCase.exec(
      new UpdateSplitRuleDtoIn({
        token: this.resolveToken(authorization, request.token),
        splitRuleId: request.splitRuleId ?? request._id,

        officeId: request.officeId,
        clientId: request.clientId,
        gatewayId: request.gatewayId,

        name: request.name,
        slug: request.slug,
        description: request.description,
        splitType: request.splitType,
        calculationBase: request.calculationBase,
        priority: request.priority,

        metadata: request.metadata,
        config: request.config,

        status: request.status,
      }),
    );

    return {
      status: 'success',
      message: 'split rule updated successfully',
      data: {
        splitRule: dtoOut.splitRule,
      },
    };
  }

  private resolveToken(
    authorization: string | undefined,
    fallbackToken: string | undefined,
  ): string {
    if (authorization && authorization.startsWith('Bearer ')) {
      return authorization.replace('Bearer ', '').trim();
    }

    return String(fallbackToken ?? '').trim();
  }
}
