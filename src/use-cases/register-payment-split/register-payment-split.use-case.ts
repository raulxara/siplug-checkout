import { Injectable } from '@nestjs/common';

import { CreatePaymentSplitRecipientDtoIn } from '../../modules/payment-split-recipients/services/create-payment-split-recipient/dtos/create-payment-split-recipient.dto-in';
import { CreatePaymentSplitRecipientService } from '../../modules/payment-split-recipients/services/create-payment-split-recipient/create-payment-split-recipient.service';
import { CreatePaymentSplitDtoIn } from '../../modules/payment-splits/services/create-payment-split/dtos/create-payment-split.dto-in';
import { CreatePaymentSplitService } from '../../modules/payment-splits/services/create-payment-split/create-payment-split.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { CalculatePaymentSplitDtoIn as CalculatePaymentSplitServiceDtoIn } from '../../modules/split-calculations/services/calculate-payment-split/dtos/calculate-payment-split.dto-in';
import { CalculatePaymentSplitService } from '../../modules/split-calculations/services/calculate-payment-split/calculate-payment-split.service';

import { RegisterPaymentSplitDtoIn } from './dtos/register-payment-split.dto-in';
import { RegisterPaymentSplitDtoOut } from './dtos/register-payment-split.dto-out';

@Injectable()
export class RegisterPaymentSplitUseCase {
  constructor(
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
    private readonly calculatePaymentSplitService: CalculatePaymentSplitService,
    private readonly createPaymentSplitService: CreatePaymentSplitService,
    private readonly createPaymentSplitRecipientService: CreatePaymentSplitRecipientService,
  ) {}

  async exec(
    dtoIn: RegisterPaymentSplitDtoIn,
  ): Promise<RegisterPaymentSplitDtoOut> {
    await this.resolveActorAuthorizationService.exec({
      token: dtoIn.token,
      requiredEntity: 'paymentSplit',
      requiredAction: 'registerPaymentSplit',
    });

    const calculation = await this.calculatePaymentSplitService.exec(
      new CalculatePaymentSplitServiceDtoIn(
        dtoIn.splitRuleId,
        dtoIn.grossAmount,
        dtoIn.gatewayFeeAmount,
        dtoIn.netAmount,
        dtoIn.currency,
        dtoIn.metadata,
      ),
    );

    const splitRule = calculation.splitRule;

    const paymentSplitConfig = {
      ...(dtoIn.config ?? {}),
      calculationSnapshot: {
        calculationBase: calculation.calculationBase,
        grossAmount: calculation.grossAmount,
        gatewayFeeAmount: calculation.gatewayFeeAmount,
        netAmount: calculation.netAmount,
        baseAmount: calculation.baseAmount,
        allocatedAmount: calculation.allocatedAmount,
        unallocatedAmount: calculation.unallocatedAmount,
        currency: calculation.currency,
      },
    };

    const paymentSplitDtoOut = await this.createPaymentSplitService.exec(
      new CreatePaymentSplitDtoIn(
        String(splitRule.officeId),
        String(splitRule.clientId),
        dtoIn.checkoutSessionId,
        dtoIn.paymentTransactionId,
        dtoIn.subscriptionId,
        dtoIn.subscriptionInvoiceId,
        dtoIn.splitRuleId,

        dtoIn.gatewayProvider,
        null,

        calculation.allocatedAmount,
        calculation.currency,

        null,
        null,
        null,
        dtoIn.metadata,
        paymentSplitConfig,

        'created',
      ),
    );

    const paymentSplitId = String(paymentSplitDtoOut.paymentSplit._id);

    const paymentSplitRecipients: Array<Record<string, unknown>> = [];

    for (const recipient of calculation.recipients) {
      const recipientConfig = {
        ...(recipient.config ?? {}),
        splitRuleRecipientId: recipient.splitRuleRecipientId,
        fixedAmount: recipient.fixedAmount,
        liableForGatewayFee: recipient.liableForGatewayFee,
        liableForRefund: recipient.liableForRefund,
        priority: recipient.priority,
      };

      const paymentSplitRecipientDtoOut =
        await this.createPaymentSplitRecipientService.exec(
          new CreatePaymentSplitRecipientDtoIn(
            paymentSplitId,
            recipient.splitRecipientId,

            null,
            null,

            recipient.role,
            recipient.amount,
            recipient.percentage,
            recipient.currency,

            null,
            null,
            null,
            recipient.metadata,
            recipientConfig,

            'created',
          ),
        );

      paymentSplitRecipients.push(
        paymentSplitRecipientDtoOut.paymentSplitRecipient,
      );
    }

    return new RegisterPaymentSplitDtoOut(
      paymentSplitDtoOut.paymentSplit,
      paymentSplitRecipients,
    );
  }
}
