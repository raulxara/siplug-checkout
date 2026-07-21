import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Put,
} from '@nestjs/common';
import { UpdateGatewayDtoIn } from './dtos/update-gateway.dto-in';
import { UpdateGatewayRequest } from './http/update-gateway.request';
import { UpdateGatewayUseCase } from './update-gateway.use-case';

@Controller('gateways')
export class UpdateGatewayController {
  constructor(private readonly updateGatewayUseCase: UpdateGatewayUseCase) {}

  @Put('update')
  async handle(
    @Body() body: UpdateGatewayRequest,
    @Headers('authorization') authorization?: string,
  ) {
    try {
      const token =
        body.token ??
        authorization?.replace(/^Bearer\s+/i, '').trim() ??
        '';

      const dtoOut = await this.updateGatewayUseCase.exec(
        new UpdateGatewayDtoIn({
          token,
          gatewayId: body.gatewayId,
          name: body.name ?? null,
          slug: body.slug ?? null,
          provider: body.provider ?? null,
          description: body.description ?? null,
          config: body.config ?? null,
          status: body.status ?? null,
          source: body.source ?? 'UpdateGatewayController',
        }),
      );

      return {
        status: 'success',
        message: 'gateway updated successfully',
        data: dtoOut,
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on update gateway controller';

      throw new BadRequestException({
        status: 'error',
        message,
      });
    }
  }
}