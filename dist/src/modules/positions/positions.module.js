"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PositionsModule = void 0;
const common_1 = require("@nestjs/common");
const build_changes_history_service_1 = require("../../common/services/changes-history/build-changes-history.service");
const positions_repository_1 = require("./repositories/positions.repository");
const create_position_service_1 = require("./services/create-position/create-position.service");
const find_position_by_slug_service_1 = require("./services/find-position-by-slug/find-position-by-slug.service");
const find_position_by_unique_id_service_1 = require("./services/find-position-by-unique-id/find-position-by-unique-id.service");
const get_all_positions_by_office_id_service_1 = require("./services/get-all-positions-by-office-id/get-all-positions-by-office-id.service");
const get_all_positions_by_unique_ids_service_1 = require("./services/get-all-positions-by-unique-ids/get-all-positions-by-unique-ids.service");
const get_all_positions_service_1 = require("./services/get-all-positions/get-all-positions.service");
const update_position_service_1 = require("./services/update-position/update-position.service");
const validate_position_slug_uniqueness_service_1 = require("./services/validate-position-slug-uniqueness/validate-position-slug-uniqueness.service");
const positions_tokens_1 = require("./tokens/positions.tokens");
let PositionsModule = class PositionsModule {
};
exports.PositionsModule = PositionsModule;
exports.PositionsModule = PositionsModule = __decorate([
    (0, common_1.Module)({
        providers: [
            {
                provide: positions_tokens_1.POSITIONS_REPOSITORY,
                useClass: positions_repository_1.PositionsRepository,
            },
            build_changes_history_service_1.BuildChangesHistoryService,
            create_position_service_1.CreatePositionService,
            update_position_service_1.UpdatePositionService,
            find_position_by_unique_id_service_1.FindPositionByUniqueIdService,
            find_position_by_slug_service_1.FindPositionBySlugService,
            get_all_positions_service_1.GetAllPositionsService,
            get_all_positions_by_office_id_service_1.GetAllPositionsByOfficeIdService,
            get_all_positions_by_unique_ids_service_1.GetAllPositionsByUniqueIdsService,
            validate_position_slug_uniqueness_service_1.ValidatePositionSlugUniquenessService,
        ],
        exports: [
            positions_tokens_1.POSITIONS_REPOSITORY,
            create_position_service_1.CreatePositionService,
            update_position_service_1.UpdatePositionService,
            find_position_by_unique_id_service_1.FindPositionByUniqueIdService,
            find_position_by_slug_service_1.FindPositionBySlugService,
            get_all_positions_service_1.GetAllPositionsService,
            get_all_positions_by_office_id_service_1.GetAllPositionsByOfficeIdService,
            get_all_positions_by_unique_ids_service_1.GetAllPositionsByUniqueIdsService,
            validate_position_slug_uniqueness_service_1.ValidatePositionSlugUniquenessService,
        ],
    })
], PositionsModule);
//# sourceMappingURL=positions.module.js.map