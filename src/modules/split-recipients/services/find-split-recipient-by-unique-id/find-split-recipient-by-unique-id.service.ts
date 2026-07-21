import { Inject, Injectable } from '@nestjs/common';

import type { ISplitRecipientsRepository } from '../../entities/split-recipients-repository.interface';
import { SPLIT_RECIPIENTS_REPOSITORY } from '../../tokens/split-recipients.tokens';
import { FindSplitRecipientByUniqueIdDtoIn } from './dtos/find-split-recipient-by-unique-id.dto-in';
import { FindSplitRecipientByUniqueIdDtoOut } from './dtos/find-split-recipient-by-unique-id.dto-out';

@Injectable()
export class FindSplitRecipientByUniqueIdService {
  constructor(
    @Inject(SPLIT_RECIPIENTS_REPOSITORY)
    private readonly splitRecipientsRepository: ISplitRecipientsRepository,
  ) {}

  async exec(
    dtoIn: FindSplitRecipientByUniqueIdDtoIn,
  ): Promise<FindSplitRecipientByUniqueIdDtoOut> {
    const splitRecipient =
      await this.splitRecipientsRepository.findByUniqueId(
        dtoIn.splitRecipientId,
      );

    if (splitRecipient === null) {
      throw new Error('split recipient not found');
    }

    return new FindSplitRecipientByUniqueIdDtoOut(splitRecipient);
  }
}