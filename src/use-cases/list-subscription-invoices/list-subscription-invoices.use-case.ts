import { Injectable } from '@nestjs/common';

import { GetAllSubscriptionInvoicesService } from '../../modules/subscription-invoices/services/get-all-subscription-invoices/get-all-subscription-invoices.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';

import { ListSubscriptionInvoicesDtoIn } from './dtos/list-subscription-invoices.dto-in';
import { ListSubscriptionInvoicesDtoOut } from './dtos/list-subscription-invoices.dto-out';

@Injectable()
export class ListSubscriptionInvoicesUseCase {
  constructor(
    private readonly getAllSubscriptionInvoicesService: GetAllSubscriptionInvoicesService,
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
  ) {}

  async exec(
    dtoIn: ListSubscriptionInvoicesDtoIn,
  ): Promise<ListSubscriptionInvoicesDtoOut> {
    await this.resolveActorAuthorizationService.exec({
      token: dtoIn.token,
      requiredEntity: 'subscription_invoices',
      requiredAction: 'listSubscriptionInvoices',
    });

    const subscriptionInvoicesDtoOut =
      await this.getAllSubscriptionInvoicesService.exec();

    return new ListSubscriptionInvoicesDtoOut(
      subscriptionInvoicesDtoOut.subscriptionInvoices as unknown as Array<
        Record<string, unknown>
      >,
    );
  }
}
