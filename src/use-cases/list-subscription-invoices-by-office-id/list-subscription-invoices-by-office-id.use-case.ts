import { Injectable } from '@nestjs/common';

import { GetAllSubscriptionInvoicesByOfficeIdDtoIn } from '../../modules/subscription-invoices/services/get-all-subscription-invoices-by-office-id/dtos/get-all-subscription-invoices-by-office-id.dto-in';
import { GetAllSubscriptionInvoicesByOfficeIdService } from '../../modules/subscription-invoices/services/get-all-subscription-invoices-by-office-id/get-all-subscription-invoices-by-office-id.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';

import { ListSubscriptionInvoicesByOfficeIdDtoIn } from './dtos/list-subscription-invoices-by-office-id.dto-in';
import { ListSubscriptionInvoicesByOfficeIdDtoOut } from './dtos/list-subscription-invoices-by-office-id.dto-out';

@Injectable()
export class ListSubscriptionInvoicesByOfficeIdUseCase {
  constructor(
    private readonly getAllSubscriptionInvoicesByOfficeIdService: GetAllSubscriptionInvoicesByOfficeIdService,
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
  ) {}

  async exec(
    dtoIn: ListSubscriptionInvoicesByOfficeIdDtoIn,
  ): Promise<ListSubscriptionInvoicesByOfficeIdDtoOut> {
    await this.resolveActorAuthorizationService.exec({
      token: dtoIn.token,
      requiredEntity: 'subscription_invoices',
      requiredAction: 'listSubscriptionInvoicesByOfficeId',
    });

    const subscriptionInvoicesDtoOut =
      await this.getAllSubscriptionInvoicesByOfficeIdService.exec(
        new GetAllSubscriptionInvoicesByOfficeIdDtoIn(dtoIn.officeId),
      );

    return new ListSubscriptionInvoicesByOfficeIdDtoOut(
      subscriptionInvoicesDtoOut.subscriptionInvoices as unknown as Array<
        Record<string, unknown>
      >,
    );
  }
}
