import { Body, Controller, Headers, Post } from '@nestjs/common';

import { ListSubscriptionPlansByOfficeIdDtoIn } from './dtos/list-subscription-plans-by-office-id.dto-in';
import { ListSubscriptionPlansByOfficeIdRequest } from './http/list-subscription-plans-by-office-id.request';
import { ListSubscriptionPlansByOfficeIdUseCase } from './list-subscription-plans-by-office-id.use-case';

@Controller('subscription-plans')
export class ListSubscriptionPlansByOfficeIdController {
  constructor(
    private readonly listSubscriptionPlansByOfficeIdUseCase: ListSubscriptionPlansByOfficeIdUseCase,
  ) {}

  @Post('list-by-office-id')
  async handle(
    @Body() request: ListSubscriptionPlansByOfficeIdRequest,
    @Headers('authorization') authorization?: string,
  ) {
    const dtoOut = await this.listSubscriptionPlansByOfficeIdUseCase.exec(
      new ListSubscriptionPlansByOfficeIdDtoIn({
        token: this.resolveToken(authorization, request.token),
        officeId: request.officeId,
      }),
    );

    return {
      status: 'success',
      message: 'subscription plans listed by office successfully',
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
