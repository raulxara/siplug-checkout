import { Inject, Injectable } from '@nestjs/common';

import type { ISubscriptionInvoicesRepository } from '../../entities/subscription-invoices-repository.interface';
import { SUBSCRIPTION_INVOICES_REPOSITORY } from '../../tokens/subscription-invoices.tokens';
import { GetAllSubscriptionInvoicesByOfficeIdDtoIn } from './dtos/get-all-subscription-invoices-by-office-id.dto-in';
import { GetAllSubscriptionInvoicesByOfficeIdDtoOut } from './dtos/get-all-subscription-invoices-by-office-id.dto-out';

@Injectable()
export class GetAllSubscriptionInvoicesByOfficeIdService {
  constructor(
    @Inject(SUBSCRIPTION_INVOICES_REPOSITORY)
    private readonly subscriptionInvoicesRepository: ISubscriptionInvoicesRepository,
  ) {}

  async exec(
    dtoIn: GetAllSubscriptionInvoicesByOfficeIdDtoIn,
  ): Promise<GetAllSubscriptionInvoicesByOfficeIdDtoOut> {
    const subscriptionInvoices =
      await this.subscriptionInvoicesRepository.getAllByOfficeId(
        dtoIn.officeId,
      );

    return new GetAllSubscriptionInvoicesByOfficeIdDtoOut(
      subscriptionInvoices as unknown as Array<Record<string, unknown>>,
    );
  }
}
