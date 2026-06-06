import { Inject, Injectable } from '@nestjs/common';

import type { ISubscriptionInvoicesRepository } from '../../entities/subscription-invoices-repository.interface';
import { SUBSCRIPTION_INVOICES_REPOSITORY } from '../../tokens/subscription-invoices.tokens';
import { GetAllSubscriptionInvoicesDtoOut } from './dtos/get-all-subscription-invoices.dto-out';

@Injectable()
export class GetAllSubscriptionInvoicesService {
  constructor(
    @Inject(SUBSCRIPTION_INVOICES_REPOSITORY)
    private readonly subscriptionInvoicesRepository: ISubscriptionInvoicesRepository,
  ) {}

  async exec(): Promise<GetAllSubscriptionInvoicesDtoOut> {
    const subscriptionInvoices =
      await this.subscriptionInvoicesRepository.getAll();

    return new GetAllSubscriptionInvoicesDtoOut(
      subscriptionInvoices as unknown as Array<Record<string, unknown>>,
    );
  }
}
