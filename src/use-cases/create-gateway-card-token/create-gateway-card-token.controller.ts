import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';

import { CreateGatewayCardTokenDtoIn } from './dtos/create-gateway-card-token.dto-in';
import { CreateGatewayCardTokenUseCase } from './create-gateway-card-token.use-case';

@Controller('dev/gateway-card-tokens')
export class CreateGatewayCardTokenController {
  constructor(
    private readonly createGatewayCardTokenUseCase: CreateGatewayCardTokenUseCase,
  ) {}

  @Post('mercado-pago/create')
  @HttpCode(200)
  async create(@Body() body: unknown) {
    try {
      const dtoOut = await this.createGatewayCardTokenUseCase.exec(
        new CreateGatewayCardTokenDtoIn(this.asRecord(body)),
      );

      return {
        status: 'success',
        message: 'gateway card token created successfully',
        data: dtoOut,
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on create gateway card token controller';

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