"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPositionsModule = void 0;
const common_1 = require("@nestjs/common");
const build_changes_history_service_1 = require("../../common/services/changes-history/build-changes-history.service");
const user_positions_repository_1 = require("./repositories/user-positions.repository");
const create_user_position_service_1 = require("./services/create-user-position/create-user-position.service");
const find_user_position_by_unique_id_service_1 = require("./services/find-user-position-by-unique-id/find-user-position-by-unique-id.service");
const find_user_position_by_user_customer_and_position_service_1 = require("./services/find-user-position-by-user-customer-and-position/find-user-position-by-user-customer-and-position.service");
const get_all_user_positions_by_user_customer_id_service_1 = require("./services/get-all-user-positions-by-user-customer-id/get-all-user-positions-by-user-customer-id.service");
const get_all_user_positions_by_user_customer_ids_service_1 = require("./services/get-all-user-positions-by-user-customer-ids/get-all-user-positions-by-user-customer-ids.service");
const get_all_user_positions_service_1 = require("./services/get-all-user-positions/get-all-user-positions.service");
const update_user_position_service_1 = require("./services/update-user-position/update-user-position.service");
const user_positions_tokens_1 = require("./tokens/user-positions.tokens");
let UserPositionsModule = class UserPositionsModule {
};
exports.UserPositionsModule = UserPositionsModule;
exports.UserPositionsModule = UserPositionsModule = __decorate([
    (0, common_1.Module)({
        providers: [
            {
                provide: user_positions_tokens_1.USER_POSITIONS_REPOSITORY,
                useClass: user_positions_repository_1.UserPositionsRepository,
            },
            build_changes_history_service_1.BuildChangesHistoryService,
            create_user_position_service_1.CreateUserPositionService,
            update_user_position_service_1.UpdateUserPositionService,
            find_user_position_by_unique_id_service_1.FindUserPositionByUniqueIdService,
            find_user_position_by_user_customer_and_position_service_1.FindUserPositionByUserCustomerAndPositionService,
            get_all_user_positions_service_1.GetAllUserPositionsService,
            get_all_user_positions_by_user_customer_id_service_1.GetAllUserPositionsByUserCustomerIdService,
            get_all_user_positions_by_user_customer_ids_service_1.GetAllUserPositionsByUserCustomerIdsService,
        ],
        exports: [
            user_positions_tokens_1.USER_POSITIONS_REPOSITORY,
            create_user_position_service_1.CreateUserPositionService,
            update_user_position_service_1.UpdateUserPositionService,
            find_user_position_by_unique_id_service_1.FindUserPositionByUniqueIdService,
            find_user_position_by_user_customer_and_position_service_1.FindUserPositionByUserCustomerAndPositionService,
            get_all_user_positions_service_1.GetAllUserPositionsService,
            get_all_user_positions_by_user_customer_id_service_1.GetAllUserPositionsByUserCustomerIdService,
            get_all_user_positions_by_user_customer_ids_service_1.GetAllUserPositionsByUserCustomerIdsService,
        ],
    })
], UserPositionsModule);
//# sourceMappingURL=user-positions.module.js.map