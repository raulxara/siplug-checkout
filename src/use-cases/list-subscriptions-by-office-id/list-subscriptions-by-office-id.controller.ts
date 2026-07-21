import { Body, Controller, Headers, Post } from '@nestjs/common';

import { ListSubscriptionsByOfficeIdDtoIn } from './dtos/list-subscriptions-by-office-id.dto-in';
import { ListSubscriptionsByOfficeIdRequest } from './http/list-subscriptions-by-office-id.request';
import { ListSubscriptionsByOfficeIdUseCase } from './list-subscriptions-by-office-id.use-case';

@Controller('subscriptions')
export class ListSubscriptionsByOfficeIdController {
  constructor(
    private readonly listSubscriptionsByOfficeIdUseCase: ListSubscriptionsByOfficeIdUseCase,
  ) {}

  @Post('list-by-office-id')
  async handle(
    @Body() request: ListSubscriptionsByOfficeIdRequest,
    @Headers('authorization') authorization?: string,
  ) {
    const dtoOut = await this.listSubscriptionsByOfficeIdUseCase.exec(
      new ListSubscriptionsByOfficeIdDtoIn({
        token: this.resolveToken(authorization, request.token),
        officeId: request.officeId,
      }),
    );

    return {
      status: 'success',
      message: 'subscriptions listed by office successfully',
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
