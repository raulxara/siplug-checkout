"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfficesModule = void 0;
const common_1 = require("@nestjs/common");
const build_changes_history_service_1 = require("../../common/services/changes-history/build-changes-history.service");
const offices_repository_1 = require("./repositories/offices.repository");
const create_office_service_1 = require("./services/create-office/create-office.service");
const find_office_by_slug_service_1 = require("./services/find-office-by-slug/find-office-by-slug.service");
const find_office_by_unique_id_service_1 = require("./services/find-office-by-unique-id/find-office-by-unique-id.service");
const get_all_offices_service_1 = require("./services/get-all-offices/get-all-offices.service");
const update_office_service_1 = require("./services/update-office/update-office.service");
const offices_tokens_1 = require("./tokens/offices.tokens");
let OfficesModule = class OfficesModule {
};
exports.OfficesModule = OfficesModule;
exports.OfficesModule = OfficesModule = __decorate([
    (0, common_1.Module)({
        providers: [
            {
                provide: offices_tokens_1.OFFICES_REPOSITORY,
                useClass: offices_repository_1.OfficesRepository,
            },
            build_changes_history_service_1.BuildChangesHistoryService,
            create_office_service_1.CreateOfficeService,
            update_office_service_1.UpdateOfficeService,
            find_office_by_unique_id_service_1.FindOfficeByUniqueIdService,
            find_office_by_slug_service_1.FindOfficeBySlugService,
            get_all_offices_service_1.GetAllOfficesService,
        ],
        exports: [
            offices_tokens_1.OFFICES_REPOSITORY,
            create_office_service_1.CreateOfficeService,
            update_office_service_1.UpdateOfficeService,
            find_office_by_unique_id_service_1.FindOfficeByUniqueIdService,
            find_office_by_slug_service_1.FindOfficeBySlugService,
            get_all_offices_service_1.GetAllOfficesService,
        ],
    })
], OfficesModule);
//# sourceMappingURL=offices.module.js.map