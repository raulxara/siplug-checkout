"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSplitRuleDtoIn = void 0;
class UpdateSplitRuleDtoIn {
    _id;
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
    source;
    constructor(_id, officeId, clientId, gatewayId, name, slug, description, splitType, calculationBase, priority, metadata, config, status, source) {
        this._id = _id;
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
        this.source = source;
    }
}
exports.UpdateSplitRuleDtoIn = UpdateSplitRuleDtoIn;
//# sourceMappingURL=update-split-rule.dto-in.js.map