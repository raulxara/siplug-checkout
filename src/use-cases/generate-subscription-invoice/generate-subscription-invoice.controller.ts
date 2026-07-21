import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { GenerateSubscriptionInvoiceDtoIn } from './dtos/generate-subscription-invoice.dto-in';
import { GenerateSubscriptionInvoiceRequest } from './http/generate-subscription-invoice.request';
import { GenerateSubscriptionInvoiceUseCase } from './generate-subscription-invoice.use-case';

@Controller('subscription-invoices')
export class GenerateSubscriptionInvoiceController {
  constructor(
    private readonly generateSubscriptionInvoiceUseCase: GenerateSubscriptionInvoiceUseCase,
  ) {}

  @Post('generate')
  @HttpCode(HttpStatus.CREATED)
  async handle(
    @Headers('authorization') authorization: string | undefined,
    @Body() body: GenerateSubscriptionInvoiceRequest,
  ): Promise<Record<string, unknown>> {
    try {
      const dtoOut = await this.generateSubscriptionInvoiceUseCase.exec(
        new GenerateSubscriptionInvoiceDtoIn({
          token: this.extractBearerToken(authorization),
          subscriptionId: body.subscriptionId,
          scheduledAt: body.scheduledAt ?? null,
          dueAt: body.dueAt ?? null,
          force: body.force ?? false,
        }),
      );

      return {
        status: 'success',
        message: 'subscription invoice generated successfully',
        data: {
          subscription: dtoOut.subscription,
          subscriptionCycle: dtoOut.subscriptionCycle,
          subscriptionInvoice: dtoOut.subscriptionInvoice,
        },
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on generate subscription invoice';

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