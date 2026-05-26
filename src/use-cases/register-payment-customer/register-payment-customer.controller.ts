import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Post,
} from '@nestjs/common';
import { RegisterPaymentCustomerDtoIn } from './dtos/register-payment-customer.dto-in';
import { RegisterPaymentCustomerRequest } from './http/register-payment-customer.request';
import { RegisterPaymentCustomerUseCase } from './register-payment-customer.use-case';

@Controller('payment-customers')
export class RegisterPaymentCustomerController {
  constructor(
    private readonly registerPaymentCustomerUseCase: RegisterPaymentCustomerUseCase,
  ) {}

  @Post('register')
  async handle(
    @Body() body: RegisterPaymentCustomerRequest,
    @Headers('authorization') authorization?: string,
  ) {
    try {
      const token =
        body.token ??
        authorization?.replace(/^Bearer\s+/i, '').trim() ??
        '';

      const dtoOut = await this.registerPaymentCustomerUseCase.exec(
        new RegisterPaymentCustomerDtoIn({
          token,
          officeId: body.officeId,
          clientId: body.clientId,
          profileId: body.profileId ?? null,
          externalReference: body.externalReference ?? null,
          name: body.name,
          email: body.email ?? null,
          documentType: body.documentType ?? null,
          documentValue: body.documentValue ?? null,
          phone: body.phone ?? null,
          billingAddress: body.billingAddress ?? null,
          metadata: body.metadata ?? null,
          config: body.config ?? null,
          status: body.status ?? 'active',
        }),
      );

      return {
        status: 'success',
        message: 'payment customer registered successfully',
        data: dtoOut,
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on register payment customer controller';

      throw new BadRequestException({
        status: 'error',
        message,
      });
    }
  }
}