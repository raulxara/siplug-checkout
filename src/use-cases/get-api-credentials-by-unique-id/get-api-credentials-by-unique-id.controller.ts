import { Body, Controller, HttpCode, Post } from '@nestjs/common';

import { GetApiCredentialsByUniqueIdDtoIn } from './dtos/get-api-credentials-by-unique-id.dto-in';
import { GetApiCredentialsByUniqueIdUseCase } from './get-api-credentials-by-unique-id.use-case';

@Controller('api-credentials')
export class GetApiCredentialsByUniqueIdController {
  constructor(
    private readonly getApiCredentialsByUniqueIdUseCase: GetApiCredentialsByUniqueIdUseCase,
  ) {}

  @Post('get-by-unique-id')
  @HttpCode(200)
  async handle(@Body() body: Record<string, unknown>) {
    const dtoOut = await this.getApiCredentialsByUniqueIdUseCase.exec(
      new GetApiCredentialsByUniqueIdDtoIn({
        apiCredentialId: body.apiCredentialId,
        _id: body._id,
      }),
    );

    return {
      status: 'success',
      message: 'api credential found successfully',
      data: {
        apiCredential: dtoOut.apiCredential,
      },
    };
  }
}
