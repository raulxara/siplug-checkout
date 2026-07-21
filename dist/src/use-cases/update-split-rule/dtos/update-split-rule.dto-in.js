"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSplitRuleDtoIn = void 0;
class UpdateSplitRuleDtoIn {
    token;
    splitRuleId;
    officeId;
    clientId;
    gatewayId;
    name;
    slug;
    description;
    splitType;
    calculationBase;
    priority;
    metadata;
    config;
    status;
    constructor(params) {
        this.token = String(params.token ?? '').trim();
        this.splitRuleId = String(params.splitRuleId ?? '').trim();
        if (this.token === '') {
            throw new Error('token is required');
        }
        if (this.splitRuleId === '') {
            throw new Error('splitRuleId is required');
        }
        this.officeId = this.toNullableString(params.officeId);
        this.clientId = this.toNullableString(params.clientId);
        this.gatewayId = this.toNullableString(params.gatewayId);
        this.name = this.toNullableString(params.name);
        this.slug = this.toNullableString(params.slug);
        this.description = this.toNullableString(params.description);
        this.splitType = this.toNullableString(params.splitType);
        this.calculationBase = this.toNullableString(params.calculationBase);
        this.priority = this.toNullableNumber(params.priority);
        this.metadata = this.toNullableObject(params.metadata);
        this.config = this.toNullableObject(params.config);
        this.status = this.toNullableString(params.status);
    }
    toNullableString(value) {
        if (value === undefined || value === null) {
            return null;
        }
        const stringValue = String(value).trim();
        return stringValue === '' ? null : stringValue;
    }
    toNullableNumber(value) {
        if (value === undefined || value === null || value === '') {
            return null;
        }
        const numberValue = Number(value);
        if (!Number.isFinite(numberValue)) {
            throw new Error(`invalid number value: ${String(value)}`);
        }
        return numberValue;
    }
    toNullableObject(value) {
        if (value === undefined || value === null) {
            return null;
        }
        if (typeof value !== 'object' || Array.isArray(value)) {
            throw new Error('value must be an object');
        }
        return value;
    }
}
exports.UpdateSplitRuleDtoIn = UpdateSplitRuleDtoIn;
//# sourceMappingURL=update-split-rule.dto-in.js.map