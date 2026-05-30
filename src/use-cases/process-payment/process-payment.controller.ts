import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';

import { DevPagSeguroEncryptedCardPageDtoIn } from './dtos/dev-pagseguro-encrypted-card-page.dto-in';
import { DevPagSeguroEncryptedCardPageUseCase } from './dev-pagseguro-encrypted-card-page.use-case';

@Controller('dev/pagseguro')
export class DevPagSeguroEncryptedCardPageController {
  constructor(
    private readonly devPagSeguroEncryptedCardPageUseCase: DevPagSeguroEncryptedCardPageUseCase,
  ) {}

  @Get('encrypted-card-page/:apiCredentialId')
  async page(
    @Param('apiCredentialId') apiCredentialId: string,
    @Res() response: Response,
  ) {
    try {
      const dtoOut = await this.devPagSeguroEncryptedCardPageUseCase.exec(
        new DevPagSeguroEncryptedCardPageDtoIn({
          apiCredentialId,
        }),
      );

      response.setHeader('Content-Type', 'text/html; charset=utf-8');
      response.send(dtoOut.html);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on dev PagSeguro encrypted card page controller';

      throw new BadRequestException({
        status: 'error',
        message,
      });
    }
  }
}
