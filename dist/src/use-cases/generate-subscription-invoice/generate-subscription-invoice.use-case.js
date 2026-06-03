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
exports.GenerateSubscriptionInvoiceUseCase = void 0;
const common_1 = require("@nestjs/common");
const handle_use_case_exception_dto_in_1 = require("../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in");
const handle_use_case_exception_service_1 = require("../../common/services/use-case-support/handle-use-case-exception.service");
const resolve_actor_authorization_dto_in_1 = require("../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in");
const resolve_actor_authorization_service_1 = require("../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service");
const create_subscription_cycle_dto_in_1 = require("../../modules/subscription-cycles/services/create-subscription-cycle/dtos/create-subscription-cycle.dto-in");
const create_subscription_cycle_service_1 = require("../../modules/subscription-cycles/services/create-subscription-cycle/create-subscription-cycle.service");
const create_subscription_invoice_dto_in_1 = require("../../modules/subscription-invoices/services/create-subscription-invoice/dtos/create-subscription-invoice.dto-in");
const create_subscription_invoice_service_1 = require("../../modules/subscription-invoices/services/create-subscription-invoice/create-subscription-invoice.service");
const find_subscription_plan_by_unique_id_dto_in_1 = require("../../modules/subscription-plans/services/find-subscription-plan-by-unique-id/dtos/find-subscription-plan-by-unique-id.dto-in");
const find_subscription_plan_by_unique_id_service_1 = require("../../modules/subscription-plans/services/find-subscription-plan-by-unique-id/find-subscription-plan-by-unique-id.service");
const find_subscription_by_unique_id_dto_in_1 = require("../../modules/subscriptions/services/find-subscription-by-unique-id/dtos/find-subscription-by-unique-id.dto-in");
const find_subscription_by_unique_id_service_1 = require("../../modules/subscriptions/services/find-subscription-by-unique-id/find-subscription-by-unique-id.service");
const update_subscription_dto_in_1 = require("../../modules/subscriptions/services/update-subscription/dtos/update-subscription.dto-in");
const update_subscription_service_1 = require("../../modules/subscriptions/services/update-subscription/update-subscription.service");
const generate_subscription_invoice_dto_out_1 = require("./dtos/generate-subscription-invoice.dto-out");
let GenerateSubscriptionInvoiceUseCase = class GenerateSubscriptionInvoiceUseCase {
    resolveActorAuthorizationService;
    findSubscriptionByUniqueIdService;
    findSubscriptionPlanByUniqueIdService;
    createSubscriptionCycleService;
    createSubscriptionInvoiceService;
    updateSubscriptionService;
    handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService, findSubscriptionByUniqueIdService, findSubscriptionPlanByUniqueIdService, createSubscriptionCycleService, createSubscriptionInvoiceService, updateSubscriptionService, handleUseCaseExceptionService) {
        this.resolveActorAuthorizationService = resolveActorAuthorizationService;
        this.findSubscriptionByUniqueIdService = findSubscriptionByUniqueIdService;
        this.findSubscriptionPlanByUniqueIdService = findSubscriptionPlanByUniqueIdService;
        this.createSubscriptionCycleService = createSubscriptionCycleService;
        this.createSubscriptionInvoiceService = createSubscriptionInvoiceService;
        this.updateSubscriptionService = updateSubscriptionService;
        this.handleUseCaseExceptionService = handleUseCaseExceptionService;
    }
    async exec(dtoIn) {
        try {
            await this.resolveActorAuthorizationService.exec(new resolve_actor_authorization_dto_in_1.ResolveActorAuthorizationDtoIn({
                token: dtoIn.token,
                requiredAction: 'generateSubscriptionInvoice',
                requiredEntity: 'subscription_invoices',
            }));
            const subscriptionDtoOut = await this.findSubscriptionByUniqueIdService.exec(new find_subscription_by_unique_id_dto_in_1.FindSubscriptionByUniqueIdDtoIn(dtoIn.subscriptionId));
            const subscription = subscriptionDtoOut.subscription;
            if (!['created', 'pending', 'active'].includes(subscription.status)) {
                throw new Error(`subscription status does not allow invoice generation: ${subscription.status}`);
            }
            if (subscription.subscriptionPlanId === null) {
                throw new Error('subscriptionPlanId is required to generate invoice');
            }
            const subscriptionPlanDtoOut = await this.findSubscriptionPlanByUniqueIdService.exec(new find_subscription_plan_by_unique_id_dto_in_1.FindSubscriptionPlanByUniqueIdDtoIn(subscription.subscriptionPlanId));
            const subscriptionPlan = subscriptionPlanDtoOut.subscriptionPlan;
            const nextCycleNumber = subscription.currentCycle + 1;
            if (subscriptionPlan.maxBillingCycles !== null &&
                nextCycleNumber > subscriptionPlan.maxBillingCycles &&
                !dtoIn.force) {
                throw new Error('subscription has reached max billing cycles');
            }
            const scheduledAt = dtoIn.scheduledAt ?? subscription.nextBillingAt ?? new Date().toISOString();
            const periodStart = scheduledAt;
            const periodEnd = this.calculatePeriodEnd(scheduledAt, subscriptionPlan.billingInterval, subscriptionPlan.billingIntervalCount);
            const dueAt = dtoIn.dueAt ?? scheduledAt;
            const subscriptionCycleDtoOut = await this.createSubscriptionCycleService.exec(new create_subscription_cycle_dto_in_1.CreateSubscriptionCycleDtoIn(subscription._id, nextCycleNumber, subscription.amount, subscription.currency, periodStart, periodEnd, scheduledAt, null, {
                source: 'GenerateSubscriptionInvoiceUseCase',
                subscriptionPlanId: subscriptionPlan._id,
            }, {
                billingInterval: subscriptionPlan.billingInterval,
                billingIntervalCount: subscriptionPlan.billingIntervalCount,
            }, 'scheduled'));
            const invoiceNumber = this.buildInvoiceNumber(subscription._id, nextCycleNumber);
            const subscriptionInvoiceDtoOut = await this.createSubscriptionInvoiceService.exec(new create_subscription_invoice_dto_in_1.CreateSubscriptionInvoiceDtoIn(subscription._id, subscriptionCycleDtoOut.subscriptionCycle._id, null, invoiceNumber, subscription.amount, subscription.currency, dueAt, null, 1, invoiceNumber, null, null, {
                source: 'GenerateSubscriptionInvoiceUseCase',
                subscriptionPlanId: subscriptionPlan._id,
                cycleNumber: nextCycleNumber,
            }, {
                chargeStrategy: 'manual_first',
                paymentCustomerId: subscription.paymentCustomerId,
                gatewayId: subscription.gatewayId,
                apiCredentialId: subscription.apiCredentialId,
            }, 'created'));
            const updatedSubscriptionDtoOut = await this.updateSubscriptionService.exec(new update_subscription_dto_in_1.UpdateSubscriptionDtoIn(subscription._id, nextCycleNumber, periodEnd, subscription.startedAt ?? this.nowAsIso(), null, null, subscription.metadata, subscription.config, subscription.status === 'created' ? 'active' : subscription.status, 'GenerateSubscriptionInvoiceUseCase'));
            return new generate_subscription_invoice_dto_out_1.GenerateSubscriptionInvoiceDtoOut(updatedSubscriptionDtoOut.subscription, subscriptionCycleDtoOut.subscriptionCycle, subscriptionInvoiceDtoOut.subscriptionInvoice);
        }
        catch (error) {
            await this.handleUseCaseExceptionService.exec(new handle_use_case_exception_dto_in_1.HandleUseCaseExceptionDtoIn({
                useCase: 'GenerateSubscriptionInvoiceUseCase',
                error,
                appFile: __filename,
                context: {
                    subscriptionId: dtoIn.subscriptionId,
                    scheduledAt: dtoIn.scheduledAt,
                    dueAt: dtoIn.dueAt,
                    force: dtoIn.force,
                },
            }));
            const message = error instanceof Error
                ? error.message
                : 'error on generate subscription invoice use case';
            throw new Error(message);
        }
    }
    calculatePeriodEnd(startIso, interval, intervalCount) {
        const date = new Date(startIso);
        if (interval === 'day') {
            date.setDate(date.getDate() + intervalCount);
            return date.toISOString();
        }
        if (interval === 'week') {
            date.setDate(date.getDate() + intervalCount * 7);
            return date.toISOString();
        }
        if (interval === 'month') {
            date.setMonth(date.getMonth() + intervalCount);
            return date.toISOString();
        }
        if (interval === 'year') {
            date.setFullYear(date.getFullYear() + intervalCount);
            return date.toISOString();
        }
        throw new Error(`unsupported subscription interval: ${interval}`);
    }
    buildInvoiceNumber(subscriptionId, cycleNumber) {
        const cleanSubscriptionId = subscriptionId.replace(/[^a-zA-Z0-9]/g, '');
        return `INV-${cleanSubscriptionId.slice(0, 12)}-${String(cycleNumber).padStart(6, '0')}`;
    }
    nowAsIso() {
        return new Date().toISOString();
    }
};
exports.GenerateSubscriptionInvoiceUseCase = GenerateSubscriptionInvoiceUseCase;
exports.GenerateSubscriptionInvoiceUseCase = GenerateSubscriptionInvoiceUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [resolve_actor_authorization_service_1.ResolveActorAuthorizationService,
        find_subscription_by_unique_id_service_1.FindSubscriptionByUniqueIdService,
        find_subscription_plan_by_unique_id_service_1.FindSubscriptionPlanByUniqueIdService,
        create_subscription_cycle_service_1.CreateSubscriptionCycleService,
        create_subscription_invoice_service_1.CreateSubscriptionInvoiceService,
        update_subscription_service_1.UpdateSubscriptionService,
        handle_use_case_exception_service_1.HandleUseCaseExceptionService])
], GenerateSubscriptionInvoiceUseCase);
//# sourceMappingURL=generate-subscription-invoice.use-case.js.map