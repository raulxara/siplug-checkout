"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAccessCodesModule = void 0;
const common_1 = require("@nestjs/common");
const build_changes_history_service_1 = require("../../common/services/changes-history/build-changes-history.service");
const user_access_codes_repository_1 = require("./repositories/user-access-codes.repository");
const create_user_access_code_service_1 = require("./services/create-user-access-code/create-user-access-code.service");
const find_user_access_code_by_code_service_1 = require("./services/find-user-access-code-by-code/find-user-access-code-by-code.service");
const find_user_access_code_by_unique_id_service_1 = require("./services/find-user-access-code-by-unique-id/find-user-access-code-by-unique-id.service");
const generate_user_access_code_service_1 = require("./services/generate-user-access-code/generate-user-access-code.service");
const get_all_user_access_codes_by_user_customer_id_service_1 = require("./services/get-all-user-access-codes-by-user-customer-id/get-all-user-access-codes-by-user-customer-id.service");
const update_user_access_code_service_1 = require("./services/update-user-access-code/update-user-access-code.service");
const user_access_codes_tokens_1 = require("./tokens/user-access-codes.tokens");
let UserAccessCodesModule = class UserAccessCodesModule {
};
exports.UserAccessCodesModule = UserAccessCodesModule;
exports.UserAccessCodesModule = UserAccessCodesModule = __decorate([
    (0, common_1.Module)({
        providers: [
            {
                provide: user_access_codes_tokens_1.USER_ACCESS_CODES_REPOSITORY,
                useClass: user_access_codes_repository_1.UserAccessCodesRepository,
            },
            build_changes_history_service_1.BuildChangesHistoryService,
            generate_user_access_code_service_1.GenerateUserAccessCodeService,
            create_user_access_code_service_1.CreateUserAccessCodeService,
            update_user_access_code_service_1.UpdateUserAccessCodeService,
            find_user_access_code_by_unique_id_service_1.FindUserAccessCodeByUniqueIdService,
            find_user_access_code_by_code_service_1.FindUserAccessCodeByCodeService,
            get_all_user_access_codes_by_user_customer_id_service_1.GetAllUserAccessCodesByUserCustomerIdService,
        ],
        exports: [
            user_access_codes_tokens_1.USER_ACCESS_CODES_REPOSITORY,
            generate_user_access_code_service_1.GenerateUserAccessCodeService,
            create_user_access_code_service_1.CreateUserAccessCodeService,
            update_user_access_code_service_1.UpdateUserAccessCodeService,
            find_user_access_code_by_unique_id_service_1.FindUserAccessCodeByUniqueIdService,
            find_user_access_code_by_code_service_1.FindUserAccessCodeByCodeService,
            get_all_user_access_codes_by_user_customer_id_service_1.GetAllUserAccessCodesByUserCustomerIdService,
        ],
    })
], UserAccessCodesModule);
//# sourceMappingURL=user-access-codes.module.js.map