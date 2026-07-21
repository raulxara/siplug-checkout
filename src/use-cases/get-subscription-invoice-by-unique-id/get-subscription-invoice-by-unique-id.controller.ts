import { Body, Controller, Headers, Post } from '@nestjs/common';

import { GetSubscriptionInvoiceByUniqueIdDtoIn } from './dtos/get-subscription-invoice-by-unique-id.dto-in';
import { GetSubscriptionInvoiceByUniqueIdRequest } from './http/get-subscription-invoice-by-unique-id.request';
import { GetSubscriptionInvoiceByUniqueIdUseCase } from './get-subscription-invoice-by-unique-id.use-case';

@Controller('subscription-invoices')
export class GetSubscriptionInvoiceByUniqueIdController {
  constructor(
    private readonly getSubscriptionInvoiceByUniqueIdUseCase: GetSubscriptionInvoiceByUniqueIdUseCase,
  ) {}

  @Post('get-by-unique-id')
  async handle(
    @Body() request: GetSubscriptionInvoiceByUniqueIdRequest,
    @Headers('authorization') authorization?: string,
  ) {
    const dtoOut = await this.getSubscriptionInvoiceByUniqueIdUseCase.exec(
      new GetSubscriptionInvoiceByUniqueIdDtoIn({
        token: this.resolveToken(authorization, request.token),
        subscriptionInvoiceId: request.subscriptionInvoiceId ?? request._id,
      }),
    );

    return {
      status: 'success',
      message: 'subscription invoice found successfully',
      data: {
        subscriptionInvoice: dtoOut.subscriptionInvoice,
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
