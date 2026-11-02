import { UseGuards } from '@nestjs/common';
import { CredentialAccessGuard } from '../../modules/gateway-settings/services/credential-access.guard';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';

import { ListApiCredentialByOfficeIdDtoIn } from './dtos/list-api-credential-by-office-id.dto-in';
import { ListApiCredentialByOfficeIdUseCase } from './list-api-credential-by-office-id.use-case';

@Controller('api-credentials')
@UseGuards(CredentialAccessGuard)
export class ListApiCredentialByOfficeIdController {
  constructor(
    private readonly listApiCredentialByOfficeIdUseCase: ListApiCredentialByOfficeIdUseCase,
  ) {}

  @Post('list-by-office-id')
  @HttpCode(200)
  async handle(@Body() body: Record<string, unknown>) {
    const dtoOut = await this.listApiCredentialByOfficeIdUseCase.exec(
      new ListApiCredentialByOfficeIdDtoIn({
        officeId: body.officeId,
      }),
    );

    return {
      status: 'success',
      message: 'api credentials listed successfully',
      data: {
        apiCredentials: dtoOut.apiCredentials,
        total: dtoOut.total,
      },
    };
  }
}
