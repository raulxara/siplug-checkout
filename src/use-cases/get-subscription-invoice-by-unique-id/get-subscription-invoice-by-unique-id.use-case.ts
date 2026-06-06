import { Injectable } from '@nestjs/common';

import { FindSubscriptionInvoiceByUniqueIdDtoIn } from '../../modules/subscription-invoices/services/find-subscription-invoice-by-unique-id/dtos/find-subscription-invoice-by-unique-id.dto-in';
import { FindSubscriptionInvoiceByUniqueIdService } from '../../modules/subscription-invoices/services/find-subscription-invoice-by-unique-id/find-subscription-invoice-by-unique-id.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';

import { GetSubscriptionInvoiceByUniqueIdDtoIn } from './dtos/get-subscription-invoice-by-unique-id.dto-in';
import { GetSubscriptionInvoiceByUniqueIdDtoOut } from './dtos/get-subscription-invoice-by-unique-id.dto-out';

@Injectable()
export class GetSubscriptionInvoiceByUniqueIdUseCase {
  constructor(
    private readonly findSubscriptionInvoiceByUniqueIdService: FindSubscriptionInvoiceByUniqueIdService,
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
  ) {}

  async exec(
    dtoIn: GetSubscriptionInvoiceByUniqueIdDtoIn,
  ): Promise<GetSubscriptionInvoiceByUniqueIdDtoOut> {
    await this.resolveActorAuthorizationService.exec({
      token: dtoIn.token,
      requiredEntity: 'subscription_invoices',
      requiredAction: 'getSubscriptionInvoiceByUniqueId',
    });

    const subscriptionInvoiceDtoOut =
      await this.findSubscriptionInvoiceByUniqueIdService.exec(
        new FindSubscriptionInvoiceByUniqueIdDtoIn(
          dtoIn.subscriptionInvoiceId,
        ),
      );

    return new GetSubscriptionInvoiceByUniqueIdDtoOut(
      subscriptionInvoiceDtoOut.subscriptionInvoice as unknown as Record<
        string,
        unknown
      >,
    );
  }
}
