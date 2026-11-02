import {
  Body,
  Controller,
  Headers,
  Post,
  HttpException,
  ServiceUnavailableException,
} from '@nestjs/common';
import {
  HostedOrderIdentity,
  HostedOrderRequest,
} from './dtos/hosted-order.request';
import { HostedOrdersUseCase } from './hosted-orders.use-case';
@Controller('hosted-orders')
export class HostedOrdersController {
  constructor(private readonly useCase: HostedOrdersUseCase) {}
  @Post('start') async start(
    @Headers('authorization') authorization: string,
    @Body() input: HostedOrderRequest,
  ) {
    try {
      return {
        data: await this.useCase.start(
          (authorization ?? '').replace(/^Bearer\s+/i, ''),
          input,
        ),
      };
    } catch (e) {
      if (e instanceof HttpException) throw e;
      throw new ServiceUnavailableException(
        'Não foi possível iniciar o pagamento.',
      );
    }
  }
  @Post('status') async status(
    @Headers('authorization') authorization: string,
    @Body() input: HostedOrderIdentity,
  ) {
    return {
      data: await this.useCase.status(
        (authorization ?? '').replace(/^Bearer\s+/i, ''),
        input.orderId,
      ),
    };
  }
}
