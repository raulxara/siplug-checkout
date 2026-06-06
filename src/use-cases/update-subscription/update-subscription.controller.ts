import { Body, Controller, Headers, Put } from '@nestjs/common';

import { UpdateSubscriptionDtoIn } from './dtos/update-subscription.dto-in';
import { UpdateSubscriptionRequest } from './http/update-subscription.request';
import { UpdateSubscriptionUseCase } from './update-subscription.use-case';

@Controller('subscriptions')
export class UpdateSubscriptionController {
  constructor(
    private readonly updateSubscriptionUseCase: UpdateSubscriptionUseCase,
  ) {}

  @Put('update')
  async handle(
    @Body() request: UpdateSubscriptionRequest,
    @Headers('authorization') authorization?: string,
  ) {
    const dtoOut = await this.updateSubscriptionUseCase.exec(
      new UpdateSubscriptionDtoIn({
        token: this.resolveToken(authorization, request.token),
        subscriptionId: request.subscriptionId ?? request._id,

        gatewaySubscriptionId: request.gatewaySubscriptionId,
        currentCycle: request.currentCycle,
        nextBillingAt: request.nextBillingAt,
        startedAt: request.startedAt,
        canceledAt: request.canceledAt,
        endedAt: request.endedAt,

        metadata: request.metadata,
        config: request.config,
        status: request.status,
      }),
    );

    return {
      status: 'success',
      message: 'subscription updated successfully',
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
