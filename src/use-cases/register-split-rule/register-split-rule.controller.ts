import { Body, Controller, Headers, Post } from '@nestjs/common';

import { RegisterSplitRuleDtoIn } from './dtos/register-split-rule.dto-in';
import { RegisterSplitRuleRequest } from './http/register-split-rule.request';
import { RegisterSplitRuleUseCase } from './register-split-rule.use-case';

@Controller('split-rules')
export class RegisterSplitRuleController {
  constructor(
    private readonly registerSplitRuleUseCase: RegisterSplitRuleUseCase,
  ) {}

  @Post('register')
  async handle(
    @Body() request: RegisterSplitRuleRequest,
    @Headers('authorization') authorization?: string,
  ) {
    const dtoOut = await this.registerSplitRuleUseCase.exec(
      new RegisterSplitRuleDtoIn({
        token: this.resolveToken(authorization, request.token),

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
      message: 'split rule registered successfully',
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
