import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';

import { ReceiveGatewayWebhookDtoIn } from './dtos/receive-gateway-webhook.dto-in';
import { ReceiveGatewayWebhookUseCase } from './receive-gateway-webhook.use-case';

@Controller('webhooks/gateways')
export class ReceiveGatewayWebhookController {
  constructor(
    private readonly receiveGatewayWebhookUseCase: ReceiveGatewayWebhookUseCase,
  ) {}

  @Post(':provider')
  @HttpCode(200)
  async handle(
    @Param('provider') provider: string,
    @Body() body: unknown,
    @Query() query: Record<string, unknown>,
    @Headers() headers: Record<string, unknown>,
  ) {
    try {
      const dtoOut = await this.receiveGatewayWebhookUseCase.exec(
        new ReceiveGatewayWebhookDtoIn({
          provider,
          body: this.asRecord(body),
          query: this.asRecord(query),
          headers: this.asRecord(headers),
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

  private asRecord(value: unknown): Record<string, unknown> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return {};
    }

    return value as Record<string, unknown>;
  }
}