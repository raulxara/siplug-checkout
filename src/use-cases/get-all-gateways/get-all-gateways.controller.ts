import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Post,
} from '@nestjs/common';
import { GetAllGatewaysDtoIn } from './dtos/get-all-gateways.dto-in';
import { GetAllGatewaysRequest } from './http/get-all-gateways.request';
import { GetAllGatewaysUseCase } from './get-all-gateways.use-case';

@Controller('gateways')
export class GetAllGatewaysController {
  constructor(
    private readonly getAllGatewaysUseCase: GetAllGatewaysUseCase,
  ) {}

  @Post('get-all')
  async handle(
    @Body() body: GetAllGatewaysRequest,
    @Headers('authorization') authorization?: string,
  ) {
    try {
      const token =
        body.token ??
        authorization?.replace(/^Bearer\s+/i, '').trim() ??
        '';

      const dtoOut = await this.getAllGatewaysUseCase.exec(
        new GetAllGatewaysDtoIn({
          token,
          status: body.status ?? null,
          search: body.search ?? null,
          page: body.page ?? 1,
          perPage: body.perPage ?? 20,
        }),
      );

      return {
        status: 'success',
        message: 'gateways listed successfully',
        data: dtoOut,
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on get all gateways controller';

      throw new BadRequestException({
        status: 'error',
        message,
      });
    }
  }
}