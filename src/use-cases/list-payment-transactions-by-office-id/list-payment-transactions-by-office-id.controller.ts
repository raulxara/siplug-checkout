import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ListPaymentTransactionsByOfficeIdDtoIn } from './dtos/list-payment-transactions-by-office-id.dto-in';
import { ListPaymentTransactionsByOfficeIdRequest } from './http/list-payment-transactions-by-office-id.request';
import { ListPaymentTransactionsByOfficeIdUseCase } from './list-payment-transactions-by-office-id.use-case';

@Controller('payment-transactions')
export class ListPaymentTransactionsByOfficeIdController {
  constructor(
    private readonly listPaymentTransactionsByOfficeIdUseCase: ListPaymentTransactionsByOfficeIdUseCase,
  ) {}

  @Post('list-by-office-id')
  @HttpCode(HttpStatus.OK)
  async handle(
    @Headers('authorization') authorization: string | undefined,
    @Body() body: ListPaymentTransactionsByOfficeIdRequest,
  ): Promise<Record<string, unknown>> {
    try {
      const dtoOut = await this.listPaymentTransactionsByOfficeIdUseCase.exec(
        new ListPaymentTransactionsByOfficeIdDtoIn({
          token: this.extractBearerToken(authorization),
          officeId: body.officeId,
        }),
      );

      return {
        status: 'success',
        message: 'payment transactions listed by office successfully',
        data: {
          paymentTransactions: dtoOut.paymentTransactions,
        },
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on list payment transactions by office id';

      throw new BadRequestException({
        status: 'error',
        message,
      });
    }
  }

  private extractBearerToken(authorization: string | undefined): string {
    if (!authorization || authorization.trim() === '') {
      throw new Error('authorization header is required');
    }

    return authorization.replace(/^Bearer\s+/i, '').trim();
  }
}
