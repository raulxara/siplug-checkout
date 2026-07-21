import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { RegisterSubscriptionPlanDtoIn } from './dtos/register-subscription-plan.dto-in';
import { RegisterSubscriptionPlanRequest } from './http/register-subscription-plan.request';
import { RegisterSubscriptionPlanUseCase } from './register-subscription-plan.use-case';

@Controller('subscription-plans')
export class RegisterSubscriptionPlanController {
  constructor(
    private readonly registerSubscriptionPlanUseCase: RegisterSubscriptionPlanUseCase,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async handle(
    @Headers('authorization') authorization: string | undefined,
    @Body() body: RegisterSubscriptionPlanRequest,
  ): Promise<Record<string, unknown>> {
    try {
      const dtoOut = await this.registerSubscriptionPlanUseCase.exec(
        new RegisterSubscriptionPlanDtoIn({
          token: this.extractBearerToken(authorization),

          officeId: body.officeId,
          clientId: body.clientId,

          gatewayId: body.gatewayId ?? null,
          apiCredentialId: body.apiCredentialId ?? null,

          name: body.name,
          slug: body.slug,
          description: body.description ?? null,

          billingInterval: body.billingInterval,
          billingIntervalCount: body.billingIntervalCount ?? 1,

          amount: body.amount,
          currency: body.currency ?? 'BRL',

          trialDays: body.trialDays ?? null,
          maxBillingCycles: body.maxBillingCycles ?? null,

          paymentMethods: body.paymentMethods ?? null,
          metadata: body.metadata ?? null,
          config: body.config ?? null,

          status: body.status ?? 'active',
        }),
      );

      return {
        status: 'success',
        message: 'subscription plan registered successfully',
        data: {
          subscriptionPlan: dtoOut.subscriptionPlan,
        },
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on register subscription plan';

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
