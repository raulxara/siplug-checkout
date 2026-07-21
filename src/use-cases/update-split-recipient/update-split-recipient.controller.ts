import { Body, Controller, Headers, Put } from '@nestjs/common';

import { UpdateSplitRecipientDtoIn } from './dtos/update-split-recipient.dto-in';
import { UpdateSplitRecipientRequest } from './http/update-split-recipient.request';
import { UpdateSplitRecipientUseCase } from './update-split-recipient.use-case';

@Controller('split-recipients')
export class UpdateSplitRecipientController {
  constructor(
    private readonly updateSplitRecipientUseCase: UpdateSplitRecipientUseCase,
  ) {}

  @Put('update')
  async handle(
    @Body() request: UpdateSplitRecipientRequest,
    @Headers('authorization') authorization?: string,
  ) {
    const dtoOut = await this.updateSplitRecipientUseCase.exec(
      new UpdateSplitRecipientDtoIn({
        token: this.resolveToken(authorization, request.token),
        splitRecipientId: request.splitRecipientId ?? request._id,

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
      message: 'split recipient updated successfully',
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
