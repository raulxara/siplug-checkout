import { Body, Controller, Headers, Post } from '@nestjs/common';

import { ListSplitRulesDtoIn } from './dtos/list-split-rules.dto-in';
import { ListSplitRulesRequest } from './http/list-split-rules.request';
import { ListSplitRulesUseCase } from './list-split-rules.use-case';

@Controller('split-rules')
export class ListSplitRulesController {
  constructor(private readonly listSplitRulesUseCase: ListSplitRulesUseCase) {}

  @Post('list')
  async handle(
    @Body() request: ListSplitRulesRequest,
    @Headers('authorization') authorization?: string,
  ) {
    const dtoOut = await this.listSplitRulesUseCase.exec(
      new ListSplitRulesDtoIn({
        token: this.resolveToken(authorization, request.token),
      }),
    );

    return {
      status: 'success',
      message: 'split rules listed successfully',
      data: {
        splitRules: dtoOut.splitRules,
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
