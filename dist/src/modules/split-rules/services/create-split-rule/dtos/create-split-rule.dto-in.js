"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSplitRuleDtoIn = void 0;
class CreateSplitRuleDtoIn {
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
    constructor(officeId, clientId, gatewayId, name, slug, description, splitType, calculationBase, priority, metadata, config, status) {
        this.officeId = officeId;
        this.clientId = clientId;
        this.gatewayId = gatewayId;
        this.name = name;
        this.slug = slug;
        this.description = description;
        this.splitType = splitType;
        this.calculationBase = calculationBase;
        this.priority = priority;
        this.metadata = metadata;
        this.config = config;
        this.status = status;
    }
}
exports.CreateSplitRuleDtoIn = CreateSplitRuleDtoIn;
//# sourceMappingURL=create-split-rule.dto-in.js.map