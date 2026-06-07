import { Body, Controller, Headers, Post } from '@nestjs/common';

import { ListSplitRecipientsDtoIn } from './dtos/list-split-recipients.dto-in';
import { ListSplitRecipientsRequest } from './http/list-split-recipients.request';
import { ListSplitRecipientsUseCase } from './list-split-recipients.use-case';

@Controller('split-recipients')
export class ListSplitRecipientsController {
  constructor(
    private readonly listSplitRecipientsUseCase: ListSplitRecipientsUseCase,
  ) {}

  @Post('list')
  async handle(
    @Body() request: ListSplitRecipientsRequest,
    @Headers('authorization') authorization?: string,
  ) {
    const dtoOut = await this.listSplitRecipientsUseCase.exec(
      new ListSplitRecipientsDtoIn({
        token: this.resolveToken(authorization, request.token),
      }),
    );

    return {
      status: 'success',
      message: 'split recipients listed successfully',
      data: {
        splitRecipients: dtoOut.splitRecipients,
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
