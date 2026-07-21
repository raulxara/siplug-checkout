import { Inject, Injectable } from '@nestjs/common';
import type { ISubscriptionInvoicesRepository } from '../../entities/subscription-invoices-repository.interface';
import { SUBSCRIPTION_INVOICES_REPOSITORY } from '../../tokens/subscription-invoices.tokens';
import { FindSubscriptionInvoiceByUniqueIdDtoIn } from './dtos/find-subscription-invoice-by-unique-id.dto-in';
import { FindSubscriptionInvoiceByUniqueIdDtoOut } from './dtos/find-subscription-invoice-by-unique-id.dto-out';

@Injectable()
export class FindSubscriptionInvoiceByUniqueIdService {
  constructor(
    @Inject(SUBSCRIPTION_INVOICES_REPOSITORY)
    private readonly repository: ISubscriptionInvoicesRepository,
  ) {}

  async exec(
    dtoIn: FindSubscriptionInvoiceByUniqueIdDtoIn,
  ): Promise<FindSubscriptionInvoiceByUniqueIdDtoOut> {
    try {
      const row = await this.repository.findByUniqueId(
        dtoIn.subscriptionInvoiceId,
      );

      if (!row) {
        throw new Error('subscription invoice not found');
      }

      return new FindSubscriptionInvoiceByUniqueIdDtoOut(row);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on find subscription invoice by unique id';

      throw new Error(message);
    }
  }
}
