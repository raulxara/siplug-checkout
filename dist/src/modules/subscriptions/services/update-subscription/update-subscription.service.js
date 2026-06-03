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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSubscriptionService = void 0;
const common_1 = require("@nestjs/common");
const subscriptions_tokens_1 = require("../../tokens/subscriptions.tokens");
const update_subscription_dto_out_1 = require("./dtos/update-subscription.dto-out");
let UpdateSubscriptionService = class UpdateSubscriptionService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async exec(dtoIn) {
        try {
            const current = await this.repository.findByUniqueId(dtoIn._id);
            if (!current) {
                throw new Error('subscription not found');
            }
            const changesHistory = this.buildChangesHistory({
                current,
                dtoIn,
            });
            const updated = await this.repository.updateByUniqueId(dtoIn._id, {
                current_cycle: dtoIn.currentCycle,
                next_billing_at: dtoIn.nextBillingAt,
                started_at: dtoIn.startedAt,
                canceled_at: dtoIn.canceledAt,
                ended_at: dtoIn.endedAt,
                metadata: dtoIn.metadata,
                config: dtoIn.config,
                status: dtoIn.status,
                changes_history: changesHistory,
            });
            return new update_subscription_dto_out_1.UpdateSubscriptionDtoOut(updated);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'error on update subscription';
            throw new Error(message);
        }
    }
    buildChangesHistory(params) {
        const previous = params.current.changesHistory ?? [];
        const changes = {
            source: params.dtoIn.source,
            changedAt: new Date().toISOString(),
            old: {},
            new: {},
        };
        const oldValues = changes.old;
        const newValues = changes.new;
        this.appendChange(oldValues, newValues, 'currentCycle', params.current.currentCycle, params.dtoIn.currentCycle);
        this.appendChange(oldValues, newValues, 'nextBillingAt', params.current.nextBillingAt, params.dtoIn.nextBillingAt);
        this.appendChange(oldValues, newValues, 'startedAt', params.current.startedAt, params.dtoIn.startedAt);
        this.appendChange(oldValues, newValues, 'canceledAt', params.current.canceledAt, params.dtoIn.canceledAt);
        this.appendChange(oldValues, newValues, 'endedAt', params.current.endedAt, params.dtoIn.endedAt);
        this.appendChange(oldValues, newValues, 'status', params.current.status, params.dtoIn.status);
        return [...previous, changes];
    }
    appendChange(oldValues, newValues, field, oldValue, newValue) {
        if (newValue === null || newValue === undefined) {
            return;
        }
        if (oldValue === newValue) {
            return;
        }
        oldValues[field] = oldValue;
        newValues[field] = newValue;
    }
};
exports.UpdateSubscriptionService = UpdateSubscriptionService;
exports.UpdateSubscriptionService = UpdateSubscriptionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(subscriptions_tokens_1.SUBSCRIPTIONS_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], UpdateSubscriptionService);
//# sourceMappingURL=update-subscription.service.js.map