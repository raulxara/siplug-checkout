import { Body, Controller, Headers, Put } from '@nestjs/common';

import { UpdateSubscriptionPlanDtoIn } from './dtos/update-subscription-plan.dto-in';
import { UpdateSubscriptionPlanRequest } from './http/update-subscription-plan.request';
import { UpdateSubscriptionPlanUseCase } from './update-subscription-plan.use-case';

@Controller('subscription-plans')
export class UpdateSubscriptionPlanController {
  constructor(
    private readonly updateSubscriptionPlanUseCase: UpdateSubscriptionPlanUseCase,
  ) {}

  @Put('update')
  async handle(
    @Body() request: UpdateSubscriptionPlanRequest,
    @Headers('authorization') authorization?: string,
  ) {
    const dtoOut = await this.updateSubscriptionPlanUseCase.exec(
      new UpdateSubscriptionPlanDtoIn({
        token: this.resolveToken(authorization, request.token),
        subscriptionPlanId: request.subscriptionPlanId ?? request._id,

        officeId: request.officeId,
        clientId: request.clientId,
        gatewayId: request.gatewayId,
        apiCredentialId: request.apiCredentialId,

        name: request.name,
        slug: request.slug,
        description: request.description,

        billingInterval: request.billingInterval,
        billingIntervalCount: request.billingIntervalCount,

        amount: request.amount,
        currency: request.currency,

        trialDays: request.trialDays,
        maxBillingCycles: request.maxBillingCycles,

        gatewayPlanId: request.gatewayPlanId,
        paymentMethods: request.paymentMethods,

        metadata: request.metadata,
        config: request.config,

        status: request.status,
      }),
    );

    return {
      status: 'success',
      message: 'subscription plan updated successfully',
      data: {
        subscriptionPlan: dtoOut.subscriptionPlan,
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
