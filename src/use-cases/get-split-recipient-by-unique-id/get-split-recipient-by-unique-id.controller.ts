import { Body, Controller, Headers, Post } from '@nestjs/common';

import { GetSplitRecipientByUniqueIdDtoIn } from './dtos/get-split-recipient-by-unique-id.dto-in';
import { GetSplitRecipientByUniqueIdRequest } from './http/get-split-recipient-by-unique-id.request';
import { GetSplitRecipientByUniqueIdUseCase } from './get-split-recipient-by-unique-id.use-case';

@Controller('split-recipients')
export class GetSplitRecipientByUniqueIdController {
  constructor(
    private readonly getSplitRecipientByUniqueIdUseCase: GetSplitRecipientByUniqueIdUseCase,
  ) {}

  @Post('get-by-unique-id')
  async handle(
    @Body() request: GetSplitRecipientByUniqueIdRequest,
    @Headers('authorization') authorization?: string,
  ) {
    const dtoOut = await this.getSplitRecipientByUniqueIdUseCase.exec(
      new GetSplitRecipientByUniqueIdDtoIn({
        token: this.resolveToken(authorization, request.token),
        splitRecipientId: request.splitRecipientId ?? request._id,
      }),
    );

    return {
      status: 'success',
      message: 'split recipient found successfully',
      data: {
        splitRecipient: dtoOut.splitRecipient,
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
