import { GetAllSplitRuleRecipientsBySplitRuleIdService } from '../../../split-rule-recipients/services/get-all-split-rule-recipients-by-split-rule-id/get-all-split-rule-recipients-by-split-rule-id.service';
import { FindSplitRuleByUniqueIdService } from '../../../split-rules/services/find-split-rule-by-unique-id/find-split-rule-by-unique-id.service';
import { CalculatePaymentSplitDtoIn } from './dtos/calculate-payment-split.dto-in';
import { CalculatePaymentSplitDtoOut } from './dtos/calculate-payment-split.dto-out';
export declare class CalculatePaymentSplitService {
    private readonly findSplitRuleByUniqueIdService;
    private readonly getAllSplitRuleRecipientsBySplitRuleIdService;
    constructor(findSplitRuleByUniqueIdService: FindSplitRuleByUniqueIdService, getAllSplitRuleRecipientsBySplitRuleIdService: GetAllSplitRuleRecipientsBySplitRuleIdService);
    exec(dtoIn: CalculatePaymentSplitDtoIn): Promise<CalculatePaymentSplitDtoOut>;
    private resolveBaseAmount;
    private calculateRecipients;
    private calculatePercentageAmount;
    private applyRoundingResidueWhenNeeded;
    private validateAmount;
    private toNullableNumber;
    private toNumber;
    private toBoolean;
    private toNullableObject;
}
