import { Body, Controller, Headers, Post } from '@nestjs/common';

import { ListPaymentSplitsByOfficeIdDtoIn } from './dtos/list-payment-splits-by-office-id.dto-in';
import { ListPaymentSplitsByOfficeIdRequest } from './http/list-payment-splits-by-office-id.request';
import { ListPaymentSplitsByOfficeIdUseCase } from './list-payment-splits-by-office-id.use-case';

@Controller('payment-splits')
export class ListPaymentSplitsByOfficeIdController {
  constructor(
    private readonly listPaymentSplitsByOfficeIdUseCase: ListPaymentSplitsByOfficeIdUseCase,
  ) {}

  @Post('list-by-office-id')
  async handle(
    @Body() request: ListPaymentSplitsByOfficeIdRequest,
    @Headers('authorization') authorization?: string,
  ) {
    const dtoOut = await this.listPaymentSplitsByOfficeIdUseCase.exec(
      new ListPaymentSplitsByOfficeIdDtoIn({
        token: this.resolveToken(authorization, request.token),
        officeId: request.officeId,
      }),
    );

    return {
      status: 'success',
      message: 'payment splits listed by office successfully',
      data: {
        paymentSplits: dtoOut.paymentSplits,
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
