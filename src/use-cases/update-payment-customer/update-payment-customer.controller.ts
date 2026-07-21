import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Put,
} from '@nestjs/common';
import { UpdatePaymentCustomerDtoIn } from './dtos/update-payment-customer.dto-in';
import { UpdatePaymentCustomerRequest } from './http/update-payment-customer.request';
import { UpdatePaymentCustomerUseCase } from './update-payment-customer.use-case';

@Controller('payment-customers')
export class UpdatePaymentCustomerController {
  constructor(
    private readonly updatePaymentCustomerUseCase: UpdatePaymentCustomerUseCase,
  ) {}

  @Put('update')
  async handle(
    @Body() body: UpdatePaymentCustomerRequest,
    @Headers('authorization') authorization?: string,
  ) {
    try {
      const token =
        body.token ??
        authorization?.replace(/^Bearer\s+/i, '').trim() ??
        '';

      const dtoOut = await this.updatePaymentCustomerUseCase.exec(
        new UpdatePaymentCustomerDtoIn({
          token,
          paymentCustomerId: body.paymentCustomerId,

          officeId: body.officeId ?? null,
          clientId: body.clientId ?? null,
          profileId: body.profileId ?? null,

          externalReference: body.externalReference ?? null,
          name: body.name ?? null,
          email: body.email ?? null,
          documentType: body.documentType ?? null,
          documentValue: body.documentValue ?? null,
          phone: body.phone ?? null,

          billingAddress: body.billingAddress ?? null,
          metadata: body.metadata ?? null,
          config: body.config ?? null,

          status: body.status ?? null,
          source: body.source ?? 'UpdatePaymentCustomerController',
        }),
      );

      return {
        status: 'success',
        message: 'payment customer updated successfully',
        data: dtoOut,
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on update payment customer controller';

      throw new BadRequestException({
        status: 'error',
        message,
      });
    }
  }
}