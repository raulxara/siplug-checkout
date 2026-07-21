import { Body, Controller, Headers, Post } from '@nestjs/common';

import { GetSubscriptionByUniqueIdDtoIn } from './dtos/get-subscription-by-unique-id.dto-in';
import { GetSubscriptionByUniqueIdRequest } from './http/get-subscription-by-unique-id.request';
import { GetSubscriptionByUniqueIdUseCase } from './get-subscription-by-unique-id.use-case';

@Controller('subscriptions')
export class GetSubscriptionByUniqueIdController {
  constructor(
    private readonly getSubscriptionByUniqueIdUseCase: GetSubscriptionByUniqueIdUseCase,
  ) {}

  @Post('get-by-unique-id')
  async handle(
    @Body() request: GetSubscriptionByUniqueIdRequest,
    @Headers('authorization') authorization?: string,
  ) {
    const dtoOut = await this.getSubscriptionByUniqueIdUseCase.exec(
      new GetSubscriptionByUniqueIdDtoIn({
        token: this.resolveToken(authorization, request.token),
        subscriptionId: request.subscriptionId ?? request._id,
      }),
    );

    return {
      status: 'success',
      message: 'subscription found successfully',
      data: {
        subscription: dtoOut.subscription,
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
