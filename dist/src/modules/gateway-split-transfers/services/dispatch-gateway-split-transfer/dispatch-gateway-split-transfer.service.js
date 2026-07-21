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
exports.DispatchGatewaySplitTransferService = void 0;
const common_1 = require("@nestjs/common");
const gateway_split_transfer_dto_out_1 = require("../../dtos/gateway-split-transfer.dto-out");
const dispatch_stripe_split_transfer_service_1 = require("../../stripe/services/dispatch-stripe-split-transfer/dispatch-stripe-split-transfer.service");
let DispatchGatewaySplitTransferService = class DispatchGatewaySplitTransferService {
    dispatchStripeSplitTransferService;
    constructor(dispatchStripeSplitTransferService) {
        this.dispatchStripeSplitTransferService = dispatchStripeSplitTransferService;
    }
    async exec(dtoIn) {
        switch (dtoIn.gatewayProvider) {
            case 'stripe':
                return this.dispatchStripeSplitTransferService.exec(dtoIn);
            default:
                return new gateway_split_transfer_dto_out_1.GatewaySplitTransferDtoOut(false, dtoIn.gatewayProvider, 'gateway_not_supported', null, [], null, null, {
                    provider: dtoIn.gatewayProvider,
                    reason: 'gateway split transfer is not implemented yet',
                }, 'gateway split transfer is not implemented yet');
        }
    }
};
exports.DispatchGatewaySplitTransferService = DispatchGatewaySplitTransferService;
exports.DispatchGatewaySplitTransferService = DispatchGatewaySplitTransferService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [dispatch_stripe_split_transfer_service_1.DispatchStripeSplitTransferService])
], DispatchGatewaySplitTransferService);
//# sourceMappingURL=dispatch-gateway-split-transfer.service.js.map