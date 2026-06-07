import { Body, Controller, Headers, Post } from '@nestjs/common';

import { ListSplitRecipientsByOfficeIdDtoIn } from './dtos/list-split-recipients-by-office-id.dto-in';
import { ListSplitRecipientsByOfficeIdRequest } from './http/list-split-recipients-by-office-id.request';
import { ListSplitRecipientsByOfficeIdUseCase } from './list-split-recipients-by-office-id.use-case';

@Controller('split-recipients')
export class ListSplitRecipientsByOfficeIdController {
  constructor(
    private readonly listSplitRecipientsByOfficeIdUseCase: ListSplitRecipientsByOfficeIdUseCase,
  ) {}

  @Post('list-by-office-id')
  async handle(
    @Body() request: ListSplitRecipientsByOfficeIdRequest,
    @Headers('authorization') authorization?: string,
  ) {
    const dtoOut = await this.listSplitRecipientsByOfficeIdUseCase.exec(
      new ListSplitRecipientsByOfficeIdDtoIn({
        token: this.resolveToken(authorization, request.token),
        officeId: request.officeId,
      }),
    );

    return {
      status: 'success',
      message: 'split recipients listed by office successfully',
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
