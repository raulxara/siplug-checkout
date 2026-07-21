"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculatePaymentSplitUseCase = void 0;
const common_1 = require("@nestjs/common");
const resolve_actor_authorization_service_1 = require("../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service");
const calculate_payment_split_dto_in_1 = require("../../modules/split-calculations/services/calculate-payment-split/dtos/calculate-payment-split.dto-in");
const calculate_payment_split_service_1 = require("../../modules/split-calculations/services/calculate-payment-split/calculate-payment-split.service");
const calculate_payment_split_dto_out_1 = require("./dtos/calculate-payment-split.dto-out");
let CalculatePaymentSplitUseCase = class CalculatePaymentSplitUseCase {
    calculatePaymentSplitService;
    resolveActorAuthorizationService;
    constructor(calculatePaymentSplitService, resolveActorAuthorizationService) {
        this.calculatePaymentSplitService = calculatePaymentSplitService;
        this.resolveActorAuthorizationService = resolveActorAuthorizationService;
    }
    async exec(dtoIn) {
        await this.resolveActorAuthorizationService.exec({
            token: dtoIn.token,
            requiredEntity: 'paymentSplit',
            requiredAction: 'calculatePaymentSplit',
        });
        const calculation = await this.calculatePaymentSplitService.exec(new calculate_payment_split_dto_in_1.CalculatePaymentSplitDtoIn(dtoIn.splitRuleId, dtoIn.grossAmount, dtoIn.gatewayFeeAmount, dtoIn.netAmount, dtoIn.currency, dtoIn.metadata));
        return new calculate_payment_split_dto_out_1.CalculatePaymentSplitDtoOut({
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
};
exports.CalculatePaymentSplitUseCase = CalculatePaymentSplitUseCase;
exports.CalculatePaymentSplitUseCase = CalculatePaymentSplitUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [calculate_payment_split_service_1.CalculatePaymentSplitService,
        resolve_actor_authorization_service_1.ResolveActorAuthorizationService])
], CalculatePaymentSplitUseCase);
//# sourceMappingURL=calculate-payment-split.use-case.js.map