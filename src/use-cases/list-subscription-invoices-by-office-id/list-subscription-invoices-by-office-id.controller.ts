import { Body, Controller, Headers, Post } from '@nestjs/common';

import { ListSubscriptionInvoicesByOfficeIdDtoIn } from './dtos/list-subscription-invoices-by-office-id.dto-in';
import { ListSubscriptionInvoicesByOfficeIdRequest } from './http/list-subscription-invoices-by-office-id.request';
import { ListSubscriptionInvoicesByOfficeIdUseCase } from './list-subscription-invoices-by-office-id.use-case';

@Controller('subscription-invoices')
export class ListSubscriptionInvoicesByOfficeIdController {
  constructor(
    private readonly listSubscriptionInvoicesByOfficeIdUseCase: ListSubscriptionInvoicesByOfficeIdUseCase,
  ) {}

  @Post('list-by-office-id')
  async handle(
    @Body() request: ListSubscriptionInvoicesByOfficeIdRequest,
    @Headers('authorization') authorization?: string,
  ) {
    const dtoOut = await this.listSubscriptionInvoicesByOfficeIdUseCase.exec(
      new ListSubscriptionInvoicesByOfficeIdDtoIn({
        token: this.resolveToken(authorization, request.token),
        officeId: request.officeId,
      }),
    );

    return {
      status: 'success',
      message: 'subscription invoices listed by office successfully',
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
