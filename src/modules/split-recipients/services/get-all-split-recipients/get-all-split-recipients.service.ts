import { Inject, Injectable } from '@nestjs/common';

import type { ISplitRecipientsRepository } from '../../entities/split-recipients-repository.interface';
import { SPLIT_RECIPIENTS_REPOSITORY } from '../../tokens/split-recipients.tokens';
import { GetAllSplitRecipientsDtoOut } from './dtos/get-all-split-recipients.dto-out';

@Injectable()
export class GetAllSplitRecipientsService {
  constructor(
    @Inject(SPLIT_RECIPIENTS_REPOSITORY)
    private readonly splitRecipientsRepository: ISplitRecipientsRepository,
  ) {}

  async exec(): Promise<GetAllSplitRecipientsDtoOut> {
    const splitRecipients = await this.splitRecipientsRepository.getAll();

    return new GetAllSplitRecipientsDtoOut(
      splitRecipients as unknown as Array<Record<string, unknown>>,
    );
  }
}