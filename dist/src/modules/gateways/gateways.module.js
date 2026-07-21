"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewaysModule = void 0;
const common_1 = require("@nestjs/common");
const build_changes_history_service_1 = require("../../common/services/changes-history/build-changes-history.service");
const gateways_repository_1 = require("./repositories/gateways.repository");
const create_gateway_service_1 = require("./services/create-gateway/create-gateway.service");
const find_gateway_by_slug_service_1 = require("./services/find-gateway-by-slug/find-gateway-by-slug.service");
const find_gateway_by_unique_id_service_1 = require("./services/find-gateway-by-unique-id/find-gateway-by-unique-id.service");
const get_all_gateways_service_1 = require("./services/get-all-gateways/get-all-gateways.service");
const update_gateway_service_1 = require("./services/update-gateway/update-gateway.service");
const validate_gateway_slug_uniqueness_service_1 = require("./services/validate-gateway-slug-uniqueness/validate-gateway-slug-uniqueness.service");
const gateways_tokens_1 = require("./tokens/gateways.tokens");
let GatewaysModule = class GatewaysModule {
};
exports.GatewaysModule = GatewaysModule;
exports.GatewaysModule = GatewaysModule = __decorate([
    (0, common_1.Module)({
        providers: [
            {
                provide: gateways_tokens_1.GATEWAYS_REPOSITORY,
                useClass: gateways_repository_1.GatewaysRepository,
            },
            build_changes_history_service_1.BuildChangesHistoryService,
            create_gateway_service_1.CreateGatewayService,
            update_gateway_service_1.UpdateGatewayService,
            find_gateway_by_unique_id_service_1.FindGatewayByUniqueIdService,
            find_gateway_by_slug_service_1.FindGatewayBySlugService,
            get_all_gateways_service_1.GetAllGatewaysService,
            validate_gateway_slug_uniqueness_service_1.ValidateGatewaySlugUniquenessService,
        ],
        exports: [
            gateways_tokens_1.GATEWAYS_REPOSITORY,
            create_gateway_service_1.CreateGatewayService,
            update_gateway_service_1.UpdateGatewayService,
            find_gateway_by_unique_id_service_1.FindGatewayByUniqueIdService,
            find_gateway_by_slug_service_1.FindGatewayBySlugService,
            get_all_gateways_service_1.GetAllGatewaysService,
            validate_gateway_slug_uniqueness_service_1.ValidateGatewaySlugUniquenessService,
        ],
    })
], GatewaysModule);
//# sourceMappingURL=gateways.module.js.map