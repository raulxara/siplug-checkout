import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { GetCheckoutSessionByUniqueIdDtoIn } from './dtos/get-checkout-session-by-unique-id.dto-in';
import { GetCheckoutSessionByUniqueIdRequest } from './http/get-checkout-session-by-unique-id.request';
import { GetCheckoutSessionByUniqueIdUseCase } from './get-checkout-session-by-unique-id.use-case';

@Controller('checkout-sessions')
export class GetCheckoutSessionByUniqueIdController {
  constructor(
    private readonly getCheckoutSessionByUniqueIdUseCase: GetCheckoutSessionByUniqueIdUseCase,
  ) {}

  @Post('get-by-unique-id')
  @HttpCode(HttpStatus.OK)
  async handle(
    @Body() body: GetCheckoutSessionByUniqueIdRequest,
    @Headers('authorization') authorization?: string,
  ) {
    try {
      const token =
        body.token ?? authorization?.replace(/^Bearer\s+/i, '').trim() ?? '';

      const dtoOut = await this.getCheckoutSessionByUniqueIdUseCase.exec(
        new GetCheckoutSessionByUniqueIdDtoIn({
          token,
          checkoutSessionId: body.checkoutSessionId,
        }),
      );

      return {
        status: 'success',
        message: 'checkout session found successfully',
        data: dtoOut,
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on get checkout session by unique id controller';

      throw new BadRequestException({
        status: 'error',
        message,
      });
    }
  }
}
