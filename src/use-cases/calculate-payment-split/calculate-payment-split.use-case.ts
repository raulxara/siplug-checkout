import { Injectable } from '@nestjs/common';

import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { CalculatePaymentSplitDtoIn as CalculatePaymentSplitServiceDtoIn } from '../../modules/split-calculations/services/calculate-payment-split/dtos/calculate-payment-split.dto-in';
import { CalculatePaymentSplitService } from '../../modules/split-calculations/services/calculate-payment-split/calculate-payment-split.service';
import { CalculatePaymentSplitDtoIn } from './dtos/calculate-payment-split.dto-in';
import { CalculatePaymentSplitDtoOut } from './dtos/calculate-payment-split.dto-out';

@Injectable()
export class CalculatePaymentSplitUseCase {
  constructor(
    private readonly calculatePaymentSplitService: CalculatePaymentSplitService,
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
  ) {}

  async exec(
    dtoIn: CalculatePaymentSplitDtoIn,
  ): Promise<CalculatePaymentSplitDtoOut> {
    await this.resolveActorAuthorizationService.exec({
      token: dtoIn.token,
      requiredEntity: 'paymentSplit',
      requiredAction: 'calculatePaymentSplit',
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

    return new CalculatePaymentSplitDtoOut({
      splitRule: calculation.splitRule,
      calculationBase: calculation.calculationBase,
      grossAmount: calculation.grossAmount,
      gatewayFeeAmount: calculation.gatewayFeeAmount,
      netAmount: calculation.netAmount,
      baseAmount: calculation.baseAmount,
      allocatedAmount: calculation.allocatedAmount,
      unallocatedAmount: calculation.unallocatedAmount,
      currency: calculation.currency,
      recipients: calculation.recipients,
      metadata: calculation.metadata,
    });
  }
}
