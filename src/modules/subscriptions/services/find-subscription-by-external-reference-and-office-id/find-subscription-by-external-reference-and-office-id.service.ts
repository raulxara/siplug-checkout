import { Inject, Injectable } from '@nestjs/common';
import type { ISubscriptionsRepository } from '../../entities/subscriptions-repository.interface';
import { SUBSCRIPTIONS_REPOSITORY } from '../../tokens/subscriptions.tokens';
import { FindSubscriptionByExternalReferenceAndOfficeIdDtoIn } from './dtos/find-subscription-by-external-reference-and-office-id.dto-in';
import { FindSubscriptionByExternalReferenceAndOfficeIdDtoOut } from './dtos/find-subscription-by-external-reference-and-office-id.dto-out';

@Injectable()
export class FindSubscriptionByExternalReferenceAndOfficeIdService {
  constructor(
    @Inject(SUBSCRIPTIONS_REPOSITORY)
    private readonly repository: ISubscriptionsRepository,
  ) {}

  async exec(
    dtoIn: FindSubscriptionByExternalReferenceAndOfficeIdDtoIn,
  ): Promise<FindSubscriptionByExternalReferenceAndOfficeIdDtoOut> {
    try {
      const row = await this.repository.findByExternalReferenceAndOfficeId({
        externalReference: dtoIn.externalReference,
        officeId: dtoIn.officeId,
      });

      return new FindSubscriptionByExternalReferenceAndOfficeIdDtoOut(row);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on find subscription by external reference and office id';

      throw new Error(message);
    }
  }
}