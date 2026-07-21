import { Body, Controller, Headers, Post } from '@nestjs/common';

import { ListSplitRulesByOfficeIdDtoIn } from './dtos/list-split-rules-by-office-id.dto-in';
import { ListSplitRulesByOfficeIdRequest } from './http/list-split-rules-by-office-id.request';
import { ListSplitRulesByOfficeIdUseCase } from './list-split-rules-by-office-id.use-case';

@Controller('split-rules')
export class ListSplitRulesByOfficeIdController {
  constructor(
    private readonly listSplitRulesByOfficeIdUseCase: ListSplitRulesByOfficeIdUseCase,
  ) {}

  @Post('list-by-office-id')
  async handle(
    @Body() request: ListSplitRulesByOfficeIdRequest,
    @Headers('authorization') authorization?: string,
  ) {
    const dtoOut = await this.listSplitRulesByOfficeIdUseCase.exec(
      new ListSplitRulesByOfficeIdDtoIn({
        token: this.resolveToken(authorization, request.token),
        officeId: request.officeId,
      }),
    );

    return {
      status: 'success',
      message: 'split rules listed by office successfully',
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
