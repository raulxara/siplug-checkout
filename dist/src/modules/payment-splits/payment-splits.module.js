"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentSplitsModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../../infra/database/prisma/prisma.module");
const payment_splits_repository_1 = require("./repositories/payment-splits.repository");
const create_payment_split_service_1 = require("./services/create-payment-split/create-payment-split.service");
const find_payment_split_by_unique_id_service_1 = require("./services/find-payment-split-by-unique-id/find-payment-split-by-unique-id.service");
const payment_splits_tokens_1 = require("./tokens/payment-splits.tokens");
let PaymentSplitsModule = class PaymentSplitsModule {
};
exports.PaymentSplitsModule = PaymentSplitsModule;
exports.PaymentSplitsModule = PaymentSplitsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        providers: [
            {
                provide: payment_splits_tokens_1.PAYMENT_SPLITS_REPOSITORY,
                useClass: payment_splits_repository_1.PaymentSplitsRepository,
            },
            create_payment_split_service_1.CreatePaymentSplitService,
            find_payment_split_by_unique_id_service_1.FindPaymentSplitByUniqueIdService,
        ],
        exports: [
            payment_splits_tokens_1.PAYMENT_SPLITS_REPOSITORY,
            create_payment_split_service_1.CreatePaymentSplitService,
            find_payment_split_by_unique_id_service_1.FindPaymentSplitByUniqueIdService,
        ],
    })
], PaymentSplitsModule);
//# sourceMappingURL=payment-splits.module.js.map