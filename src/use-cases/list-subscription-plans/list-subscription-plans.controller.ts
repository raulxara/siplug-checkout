import { Body, Controller, Headers, Post } from '@nestjs/common';

import { ListSubscriptionPlansDtoIn } from './dtos/list-subscription-plans.dto-in';
import { ListSubscriptionPlansRequest } from './http/list-subscription-plans.request';
import { ListSubscriptionPlansUseCase } from './list-subscription-plans.use-case';

@Controller('subscription-plans')
export class ListSubscriptionPlansController {
  constructor(
    private readonly listSubscriptionPlansUseCase: ListSubscriptionPlansUseCase,
  ) {}

  @Post('list')
  async handle(
    @Body() request: ListSubscriptionPlansRequest,
    @Headers('authorization') authorization?: string,
  ) {
    const dtoOut = await this.listSubscriptionPlansUseCase.exec(
      new ListSubscriptionPlansDtoIn({
        token: this.resolveToken(authorization, request.token),
      }),
    );

    return {
      status: 'success',
      message: 'subscription plans listed successfully',
      data: {
        subscriptionPlans: dtoOut.subscriptionPlans,
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
