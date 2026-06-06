import { Injectable } from '@nestjs/common';

import { FindSubscriptionInvoiceByUniqueIdDtoIn } from '../../modules/subscription-invoices/services/find-subscription-invoice-by-unique-id/dtos/find-subscription-invoice-by-unique-id.dto-in';
import { FindSubscriptionInvoiceByUniqueIdService } from '../../modules/subscription-invoices/services/find-subscription-invoice-by-unique-id/find-subscription-invoice-by-unique-id.service';
import { UpdateSubscriptionInvoiceDtoIn as UpdateSubscriptionInvoiceServiceDtoIn } from '../../modules/subscription-invoices/services/update-subscription-invoice/dtos/update-subscription-invoice.dto-in';
import { UpdateSubscriptionInvoiceService } from '../../modules/subscription-invoices/services/update-subscription-invoice/update-subscription-invoice.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';

import { UpdateSubscriptionInvoiceDtoIn } from './dtos/update-subscription-invoice.dto-in';
import { UpdateSubscriptionInvoiceDtoOut } from './dtos/update-subscription-invoice.dto-out';

@Injectable()
export class UpdateSubscriptionInvoiceUseCase {
  constructor(
    private readonly findSubscriptionInvoiceByUniqueIdService: FindSubscriptionInvoiceByUniqueIdService,
    private readonly updateSubscriptionInvoiceService: UpdateSubscriptionInvoiceService,
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
  ) {}

  async exec(
    dtoIn: UpdateSubscriptionInvoiceDtoIn,
  ): Promise<UpdateSubscriptionInvoiceDtoOut> {
    await this.resolveActorAuthorizationService.exec({
      token: dtoIn.token,
      requiredEntity: 'subscription_invoices',
      requiredAction: 'updateSubscriptionInvoice',
    });

    await this.findSubscriptionInvoiceByUniqueIdService.exec(
      new FindSubscriptionInvoiceByUniqueIdDtoIn(
        dtoIn.subscriptionInvoiceId,
      ),
    );

    const updatedSubscriptionInvoiceDtoOut =
    await this.updateSubscriptionInvoiceService.exec(
        new UpdateSubscriptionInvoiceServiceDtoIn(
        dtoIn.subscriptionInvoiceId,

        dtoIn.paymentTransactionId,
        dtoIn.gatewayInvoiceId,
        dtoIn.lastAttemptAt,
        dtoIn.attemptNumber,

        dtoIn.paidAt,

        dtoIn.metadata,
        dtoIn.config,

        dtoIn.status,
        'UpdateSubscriptionInvoiceUseCase',
        ),
    );

    return new UpdateSubscriptionInvoiceDtoOut(
      updatedSubscriptionInvoiceDtoOut.subscriptionInvoice as unknown as Record<
        string,
        unknown
      >,
    );
  }
}
