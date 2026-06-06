import { Body, Controller, Headers, Put } from '@nestjs/common';

import { UpdateSubscriptionInvoiceDtoIn } from './dtos/update-subscription-invoice.dto-in';
import { UpdateSubscriptionInvoiceRequest } from './http/update-subscription-invoice.request';
import { UpdateSubscriptionInvoiceUseCase } from './update-subscription-invoice.use-case';

@Controller('subscription-invoices')
export class UpdateSubscriptionInvoiceController {
  constructor(
    private readonly updateSubscriptionInvoiceUseCase: UpdateSubscriptionInvoiceUseCase,
  ) {}

  @Put('update')
  async handle(
    @Body() request: UpdateSubscriptionInvoiceRequest,
    @Headers('authorization') authorization?: string,
  ) {
    const dtoOut = await this.updateSubscriptionInvoiceUseCase.exec(
      new UpdateSubscriptionInvoiceDtoIn({
        token: this.resolveToken(authorization, request.token),
        subscriptionInvoiceId: request.subscriptionInvoiceId ?? request._id,

        paymentTransactionId: request.paymentTransactionId,
        gatewayInvoiceId: request.gatewayInvoiceId,
        paidAt: request.paidAt,
        dueAt: request.dueAt,
        lastAttemptAt: request.lastAttemptAt,
        attemptNumber: request.attemptNumber,

        metadata: request.metadata,
        config: request.config,
        status: request.status,
      }),
    );

    return {
      status: 'success',
      message: 'subscription invoice updated successfully',
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
