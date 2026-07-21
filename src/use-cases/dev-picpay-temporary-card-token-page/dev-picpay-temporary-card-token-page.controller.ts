import { Controller, Get, Param, Res } from '@nestjs/common';
import type { Response } from 'express';

import { DevPicPayTemporaryCardTokenPageDtoIn } from './dtos/dev-picpay-temporary-card-token-page.dto-in';
import { DevPicPayTemporaryCardTokenPageUseCase } from './dev-picpay-temporary-card-token-page.use-case';

@Controller('dev/picpay')
export class DevPicPayTemporaryCardTokenPageController {
  constructor(
    private readonly devPicPayTemporaryCardTokenPageUseCase: DevPicPayTemporaryCardTokenPageUseCase,
  ) {}

  @Get('temporary-card-token-page/:apiCredentialId')
  async page(
    @Param('apiCredentialId') apiCredentialId: string,
    @Res() response: Response,
  ) {
    const dtoOut = await this.devPicPayTemporaryCardTokenPageUseCase.exec(
      new DevPicPayTemporaryCardTokenPageDtoIn({
        apiCredentialId,
      }),
    );

    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    response.send(dtoOut.html);
  }
}