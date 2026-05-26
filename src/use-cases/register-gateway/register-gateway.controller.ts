import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Post,
} from '@nestjs/common';
import { RegisterGatewayDtoIn } from './dtos/register-gateway.dto-in';
import { RegisterGatewayRequest } from './http/register-gateway.request';
import { RegisterGatewayUseCase } from './register-gateway.use-case';

@Controller('gateways')
export class RegisterGatewayController {
  constructor(private readonly registerGatewayUseCase: RegisterGatewayUseCase) {}

  @Post('register')
  async handle(
    @Body() body: RegisterGatewayRequest,
    @Headers('authorization') authorization?: string,
  ) {
    try {
      const token =
        body.token ??
        authorization?.replace(/^Bearer\s+/i, '').trim() ??
        '';

      const dtoOut = await this.registerGatewayUseCase.exec(
        new RegisterGatewayDtoIn({
          token,
          name: body.name,
          slug: body.slug,
          provider: body.provider,
          description: body.description ?? null,
          config: body.config ?? null,
          status: body.status ?? 'active',
        }),
      );

      return {
        status: 'success',
        message: 'gateway registered successfully',
        data: dtoOut,
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on register gateway controller';

      throw new BadRequestException({
        status: 'error',
        message,
      });
    }
  }
}