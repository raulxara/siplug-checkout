import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  HttpCode,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';

import { ReceiveGatewayWebhookDtoIn } from './dtos/receive-gateway-webhook.dto-in';
import { ReceiveGatewayWebhookUseCase } from './receive-gateway-webhook.use-case';

@Controller('webhooks/gateways')
export class ReceiveGatewayWebhookController {
  constructor(
    private readonly receiveGatewayWebhookUseCase: ReceiveGatewayWebhookUseCase,
  ) {}

  @Post(':gatewayProvider')
  @HttpCode(200)
  async receive(
    @Param('gatewayProvider') gatewayProvider: string,
    @Body() body: Record<string, unknown>,
    @Headers() headers: Record<string, string | string[] | undefined>,
    @Req() request: RawBodyRequest<Request>,
  ) {
    try {
      const dtoOut = await this.receiveGatewayWebhookUseCase.exec(
        new ReceiveGatewayWebhookDtoIn({
          gatewayProvider,
          payload: body,
          headers,
          rawBody: request.rawBody ?? null,
        }),
      );

      return {
        status: 'success',
        message: 'gateway webhook received successfully',
        data: dtoOut,
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on receive gateway webhook controller';

      throw new BadRequestException({
        status: 'error',
        message,
      });
    }
  }
}
