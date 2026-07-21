import { Body, Controller, Headers, Post } from '@nestjs/common';

import { GetSplitRuleByUniqueIdDtoIn } from './dtos/get-split-rule-by-unique-id.dto-in';
import { GetSplitRuleByUniqueIdRequest } from './http/get-split-rule-by-unique-id.request';
import { GetSplitRuleByUniqueIdUseCase } from './get-split-rule-by-unique-id.use-case';

@Controller('split-rules')
export class GetSplitRuleByUniqueIdController {
  constructor(
    private readonly getSplitRuleByUniqueIdUseCase: GetSplitRuleByUniqueIdUseCase,
  ) {}

  @Post('get-by-unique-id')
  async handle(
    @Body() request: GetSplitRuleByUniqueIdRequest,
    @Headers('authorization') authorization?: string,
  ) {
    const dtoOut = await this.getSplitRuleByUniqueIdUseCase.exec(
      new GetSplitRuleByUniqueIdDtoIn({
        token: this.resolveToken(authorization, request.token),
        splitRuleId: request.splitRuleId ?? request._id,
      }),
    );

    return {
      status: 'success',
      message: 'split rule found successfully',
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