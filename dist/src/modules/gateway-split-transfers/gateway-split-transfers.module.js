"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewaySplitTransfersModule = void 0;
const common_1 = require("@nestjs/common");
const dispatch_gateway_split_transfer_service_1 = require("./services/dispatch-gateway-split-transfer/dispatch-gateway-split-transfer.service");
const dispatch_stripe_split_transfer_service_1 = require("./stripe/services/dispatch-stripe-split-transfer/dispatch-stripe-split-transfer.service");
const retrieve_stripe_transfer_service_1 = require("./stripe/services/retrieve-stripe-transfer/retrieve-stripe-transfer.service");
let GatewaySplitTransfersModule = class GatewaySplitTransfersModule {
};
exports.GatewaySplitTransfersModule = GatewaySplitTransfersModule;
exports.GatewaySplitTransfersModule = GatewaySplitTransfersModule = __decorate([
    (0, common_1.Module)({
        providers: [
            dispatch_gateway_split_transfer_service_1.DispatchGatewaySplitTransferService,
            dispatch_stripe_split_transfer_service_1.DispatchStripeSplitTransferService,
            retrieve_stripe_transfer_service_1.RetrieveStripeTransferService,
        ],
        exports: [
            dispatch_gateway_split_transfer_service_1.DispatchGatewaySplitTransferService,
            dispatch_stripe_split_transfer_service_1.DispatchStripeSplitTransferService,
            retrieve_stripe_transfer_service_1.RetrieveStripeTransferService,
        ],
    })
], GatewaySplitTransfersModule);
//# sourceMappingURL=gateway-split-transfers.module.js.map