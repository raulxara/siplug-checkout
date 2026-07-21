import { Body, Controller, Headers, Post } from '@nestjs/common';

import { GetSubscriptionPlanByUniqueIdDtoIn } from './dtos/get-subscription-plan-by-unique-id.dto-in';
import { GetSubscriptionPlanByUniqueIdRequest } from './http/get-subscription-plan-by-unique-id.request';
import { GetSubscriptionPlanByUniqueIdUseCase } from './get-subscription-plan-by-unique-id.use-case';

@Controller('subscription-plans')
export class GetSubscriptionPlanByUniqueIdController {
  constructor(
    private readonly getSubscriptionPlanByUniqueIdUseCase: GetSubscriptionPlanByUniqueIdUseCase,
  ) {}

  @Post('get-by-unique-id')
  async handle(
    @Body() request: GetSubscriptionPlanByUniqueIdRequest,
    @Headers('authorization') authorization?: string,
  ) {
    const dtoOut = await this.getSubscriptionPlanByUniqueIdUseCase.exec(
      new GetSubscriptionPlanByUniqueIdDtoIn({
        token: this.resolveToken(authorization, request.token),
        subscriptionPlanId: request.subscriptionPlanId ?? request._id,
      }),
    );

    return {
      status: 'success',
      message: 'subscription plan found successfully',
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
