import { Body, Controller, Headers, Post } from '@nestjs/common';

import { ListSubscriptionsDtoIn } from './dtos/list-subscriptions.dto-in';
import { ListSubscriptionsRequest } from './http/list-subscriptions.request';
import { ListSubscriptionsUseCase } from './list-subscriptions.use-case';

@Controller('subscriptions')
export class ListSubscriptionsController {
  constructor(
    private readonly listSubscriptionsUseCase: ListSubscriptionsUseCase,
  ) {}

  @Post('list')
  async handle(
    @Body() request: ListSubscriptionsRequest,
    @Headers('authorization') authorization?: string,
  ) {
    const dtoOut = await this.listSubscriptionsUseCase.exec(
      new ListSubscriptionsDtoIn({
        token: this.resolveToken(authorization, request.token),
      }),
    );

    return {
      status: 'success',
      message: 'subscriptions listed successfully',
      data: {
        subscriptions: dtoOut.subscriptions,
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
