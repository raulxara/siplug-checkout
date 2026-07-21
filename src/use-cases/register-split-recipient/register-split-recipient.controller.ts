import { Body, Controller, Headers, Post } from '@nestjs/common';

import { RegisterSplitRecipientDtoIn } from './dtos/register-split-recipient.dto-in';
import { RegisterSplitRecipientRequest } from './http/register-split-recipient.request';
import { RegisterSplitRecipientUseCase } from './register-split-recipient.use-case';

@Controller('split-recipients')
export class RegisterSplitRecipientController {
  constructor(
    private readonly registerSplitRecipientUseCase: RegisterSplitRecipientUseCase,
  ) {}

  @Post('register')
  async handle(
    @Body() request: RegisterSplitRecipientRequest,
    @Headers('authorization') authorization?: string,
  ) {
    const dtoOut = await this.registerSplitRecipientUseCase.exec(
      new RegisterSplitRecipientDtoIn({
        token: this.resolveToken(authorization, request.token),

        officeId: request.officeId,
        clientId: request.clientId,
        gatewayId: request.gatewayId,
        apiCredentialId: request.apiCredentialId,

        name: request.name,
        documentType: request.documentType,
        documentValue: request.documentValue,
        email: request.email,

        gatewayProvider: request.gatewayProvider,
        gatewayRecipientId: request.gatewayRecipientId,
        gatewayAccountId: request.gatewayAccountId,

        bankData: request.bankData,
        metadata: request.metadata,
        config: request.config,

        status: request.status,
      }),
    );

    return {
      status: 'success',
      message: 'split recipient registered successfully',
      data: {
        splitRecipient: dtoOut.splitRecipient,
      },
    };
  }

  private resolveToken(
    authorization: string | undefined,
    fallbackToken: string | undefined,
  ): string {
    if (authorization && authorization.startsWith('Bearer ')) {
      return authorization.replace('Bearer ', '').trim();
    }

    return String(fallbackToken ?? '').trim();
  }
}
