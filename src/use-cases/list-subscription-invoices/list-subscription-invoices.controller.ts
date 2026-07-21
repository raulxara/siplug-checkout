import { Body, Controller, Headers, Post } from '@nestjs/common';

import { ListSubscriptionInvoicesDtoIn } from './dtos/list-subscription-invoices.dto-in';
import { ListSubscriptionInvoicesRequest } from './http/list-subscription-invoices.request';
import { ListSubscriptionInvoicesUseCase } from './list-subscription-invoices.use-case';

@Controller('subscription-invoices')
export class ListSubscriptionInvoicesController {
  constructor(
    private readonly listSubscriptionInvoicesUseCase: ListSubscriptionInvoicesUseCase,
  ) {}

  @Post('list')
  async handle(
    @Body() request: ListSubscriptionInvoicesRequest,
    @Headers('authorization') authorization?: string,
  ) {
    const dtoOut = await this.listSubscriptionInvoicesUseCase.exec(
      new ListSubscriptionInvoicesDtoIn({
        token: this.resolveToken(authorization, request.token),
      }),
    );

    return {
      status: 'success',
      message: 'subscription invoices listed successfully',
      data: {
        subscriptionInvoices: dtoOut.subscriptionInvoices,
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
