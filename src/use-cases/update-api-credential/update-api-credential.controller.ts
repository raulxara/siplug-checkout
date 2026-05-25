import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Put,
} from '@nestjs/common';
import { UpdateApiCredentialDtoIn } from './dtos/update-api-credential.dto-in';
import { UpdateApiCredentialRequest } from './http/update-api-credential.request';
import { UpdateApiCredentialUseCase } from './update-api-credential.use-case';

@Controller('api-credentials')
export class UpdateApiCredentialController {
  constructor(
    private readonly updateApiCredentialUseCase: UpdateApiCredentialUseCase,
  ) {}

  @Put('update')
  async handle(
    @Body() body: UpdateApiCredentialRequest,
    @Headers('authorization') authorization?: string,
  ) {
    try {
      const token =
        body.token ??
        authorization?.replace(/^Bearer\s+/i, '').trim() ??
        '';

      const dtoOut = await this.updateApiCredentialUseCase.exec(
        new UpdateApiCredentialDtoIn({
          token,
          apiCredentialId: body.apiCredentialId,
          officeId: body.officeId ?? null,
          clientId: body.clientId ?? null,
          gatewayId: body.gatewayId ?? null,
          name: body.name ?? null,
          slug: body.slug ?? null,
          provider: body.provider ?? null,
          providerType: body.providerType ?? null,
          environment: body.environment ?? null,
          providerToken: body.providerToken ?? null,
          origin: body.origin ?? null,
          config: body.config ?? null,
          expiresAt: body.expiresAt ?? null,
          status: body.status ?? null,
          source: body.source ?? 'UpdateApiCredentialController',
        }),
      );

      return {
        status: 'success',
        message: 'api credential updated successfully',
        data: dtoOut,
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on update api credential controller';

      throw new BadRequestException({
        status: 'error',
        message,
      });
    }
  }
}