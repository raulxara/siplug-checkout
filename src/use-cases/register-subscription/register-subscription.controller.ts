import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { RegisterSubscriptionDtoIn } from './dtos/register-subscription.dto-in';
import { RegisterSubscriptionRequest } from './http/register-subscription.request';
import { RegisterSubscriptionUseCase } from './register-subscription.use-case';

@Controller('subscriptions')
export class RegisterSubscriptionController {
  constructor(
    private readonly registerSubscriptionUseCase: RegisterSubscriptionUseCase,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async handle(
    @Headers('authorization') authorization: string | undefined,
    @Body() body: RegisterSubscriptionRequest,
  ): Promise<Record<string, unknown>> {
    try {
      const dtoOut = await this.registerSubscriptionUseCase.exec(
        new RegisterSubscriptionDtoIn({
          token: this.extractBearerToken(authorization),

          officeId: body.officeId,
          clientId: body.clientId,

          subscriptionPlanId: body.subscriptionPlanId,
          paymentCustomerId: body.paymentCustomerId,

          gatewayId: body.gatewayId ?? null,
          apiCredentialId: body.apiCredentialId ?? null,

          externalReference: body.externalReference ?? null,

          amount: body.amount ?? null,
          currency: body.currency ?? null,

          nextBillingAt: body.nextBillingAt ?? null,

          metadata: body.metadata ?? null,
          config: body.config ?? null,

          status: body.status ?? 'created',
        }),
      );

      return {
        status: 'success',
        message: 'subscription registered successfully',
        data: {
          subscription: dtoOut.subscription,
        },
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'error on register subscription';

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