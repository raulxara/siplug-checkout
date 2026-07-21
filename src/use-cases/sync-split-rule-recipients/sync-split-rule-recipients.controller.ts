import { Body, Controller, Headers, Post } from '@nestjs/common';

import { SyncSplitRuleRecipientsDtoIn } from './dtos/sync-split-rule-recipients.dto-in';
import { SyncSplitRuleRecipientsRequest } from './http/sync-split-rule-recipients.request';
import { SyncSplitRuleRecipientsUseCase } from './sync-split-rule-recipients.use-case';

@Controller('split-rule-recipients')
export class SyncSplitRuleRecipientsController {
  constructor(
    private readonly syncSplitRuleRecipientsUseCase: SyncSplitRuleRecipientsUseCase,
  ) {}

  @Post('sync')
  async handle(
    @Body() request: SyncSplitRuleRecipientsRequest,
    @Headers('authorization') authorization?: string,
  ) {
    const dtoOut = await this.syncSplitRuleRecipientsUseCase.exec(
      new SyncSplitRuleRecipientsDtoIn({
        token: this.resolveToken(authorization, request.token),
        splitRuleId: request.splitRuleId,
        recipients: request.recipients,
      }),
    );

    return {
      status: 'success',
      message: 'split rule recipients synced successfully',
      data: {
        splitRule: dtoOut.splitRule,
        splitRuleRecipients: dtoOut.splitRuleRecipients,
        createdCount: dtoOut.createdCount,
        updatedCount: dtoOut.updatedCount,
        inactivatedCount: dtoOut.inactivatedCount,
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
