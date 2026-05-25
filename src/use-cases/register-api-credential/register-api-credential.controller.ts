import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Post,
} from '@nestjs/common';
import { RegisterApiCredentialDtoIn } from './dtos/register-api-credential.dto-in';
import { RegisterApiCredentialRequest } from './http/register-api-credential.request';
import { RegisterApiCredentialUseCase } from './register-api-credential.use-case';

@Controller('api-credentials')
export class RegisterApiCredentialController {
  constructor(
    private readonly registerApiCredentialUseCase: RegisterApiCredentialUseCase,
  ) {}

  @Post('register')
  async handle(
    @Body() body: RegisterApiCredentialRequest,
    @Headers('authorization') authorization?: string,
  ) {
    try {
      const token =
        body.token ??
        authorization?.replace(/^Bearer\s+/i, '').trim() ??
        '';

      const dtoOut = await this.registerApiCredentialUseCase.exec(
        new RegisterApiCredentialDtoIn({
          token,
          officeId: body.officeId ?? null,
          clientId: body.clientId ?? null,
          gatewayId: body.gatewayId ?? null,
          name: body.name,
          slug: body.slug,
          provider: body.provider,
          providerType: body.providerType,
          environment: body.environment ?? 'local',
          providerToken: body.providerToken,
          origin: body.origin ?? null,
          config: body.config ?? null,
          expiresAt: body.expiresAt ?? null,
          status: body.status ?? 'active',
        }),
      );

      return {
        status: 'success',
        message: 'api credential registered successfully',
        data: dtoOut,
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on register api credential controller';

      throw new BadRequestException({
        status: 'error',
        message,
      });
    }
  }
}