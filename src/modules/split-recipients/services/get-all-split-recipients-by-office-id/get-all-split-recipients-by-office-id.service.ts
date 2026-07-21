import { Inject, Injectable } from '@nestjs/common';

import type { ISplitRecipientsRepository } from '../../entities/split-recipients-repository.interface';
import { SPLIT_RECIPIENTS_REPOSITORY } from '../../tokens/split-recipients.tokens';
import { GetAllSplitRecipientsByOfficeIdDtoIn } from './dtos/get-all-split-recipients-by-office-id.dto-in';
import { GetAllSplitRecipientsByOfficeIdDtoOut } from './dtos/get-all-split-recipients-by-office-id.dto-out';

@Injectable()
export class GetAllSplitRecipientsByOfficeIdService {
  constructor(
    @Inject(SPLIT_RECIPIENTS_REPOSITORY)
    private readonly splitRecipientsRepository: ISplitRecipientsRepository,
  ) {}

  async exec(
    dtoIn: GetAllSplitRecipientsByOfficeIdDtoIn,
  ): Promise<GetAllSplitRecipientsByOfficeIdDtoOut> {
    const splitRecipients =
      await this.splitRecipientsRepository.getAllByOfficeId(dtoIn.officeId);

    return new GetAllSplitRecipientsByOfficeIdDtoOut(
      splitRecipients as unknown as Array<Record<string, unknown>>,
    );
  }
}
