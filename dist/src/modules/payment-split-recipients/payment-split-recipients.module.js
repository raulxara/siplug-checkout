"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentSplitRecipientsModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../../infra/database/prisma/prisma.module");
const payment_split_recipients_repository_1 = require("./repositories/payment-split-recipients.repository");
const create_payment_split_recipient_service_1 = require("./services/create-payment-split-recipient/create-payment-split-recipient.service");
const payment_split_recipients_tokens_1 = require("./tokens/payment-split-recipients.tokens");
let PaymentSplitRecipientsModule = class PaymentSplitRecipientsModule {
};
exports.PaymentSplitRecipientsModule = PaymentSplitRecipientsModule;
exports.PaymentSplitRecipientsModule = PaymentSplitRecipientsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        providers: [
            {
                provide: payment_split_recipients_tokens_1.PAYMENT_SPLIT_RECIPIENTS_REPOSITORY,
                useClass: payment_split_recipients_repository_1.PaymentSplitRecipientsRepository,
            },
            create_payment_split_recipient_service_1.CreatePaymentSplitRecipientService,
        ],
        exports: [
            payment_split_recipients_tokens_1.PAYMENT_SPLIT_RECIPIENTS_REPOSITORY,
            create_payment_split_recipient_service_1.CreatePaymentSplitRecipientService,
        ],
    })
], PaymentSplitRecipientsModule);
//# sourceMappingURL=payment-split-recipients.module.js.map