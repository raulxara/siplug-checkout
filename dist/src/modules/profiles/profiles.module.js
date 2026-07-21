"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfilesModule = void 0;
const common_1 = require("@nestjs/common");
const build_changes_history_service_1 = require("../../common/services/changes-history/build-changes-history.service");
const profiles_repository_1 = require("./repositories/profiles.repository");
const create_profile_service_1 = require("./services/create-profile/create-profile.service");
const find_profile_by_document_service_1 = require("./services/find-profile-by-document/find-profile-by-document.service");
const find_profile_by_email_service_1 = require("./services/find-profile-by-email/find-profile-by-email.service");
const find_profile_by_unique_id_service_1 = require("./services/find-profile-by-unique-id/find-profile-by-unique-id.service");
const get_all_profiles_service_1 = require("./services/get-all-profiles/get-all-profiles.service");
const update_profile_service_1 = require("./services/update-profile/update-profile.service");
const validate_profile_email_uniqueness_service_1 = require("./services/validate-profile-email-uniqueness/validate-profile-email-uniqueness.service");
const profiles_tokens_1 = require("./tokens/profiles.tokens");
let ProfilesModule = class ProfilesModule {
};
exports.ProfilesModule = ProfilesModule;
exports.ProfilesModule = ProfilesModule = __decorate([
    (0, common_1.Module)({
        providers: [
            {
                provide: profiles_tokens_1.PROFILES_REPOSITORY,
                useClass: profiles_repository_1.ProfilesRepository,
            },
            build_changes_history_service_1.BuildChangesHistoryService,
            create_profile_service_1.CreateProfileService,
            update_profile_service_1.UpdateProfileService,
            find_profile_by_unique_id_service_1.FindProfileByUniqueIdService,
            find_profile_by_email_service_1.FindProfileByEmailService,
            find_profile_by_document_service_1.FindProfileByDocumentService,
            get_all_profiles_service_1.GetAllProfilesService,
            validate_profile_email_uniqueness_service_1.ValidateProfileEmailUniquenessService,
        ],
        exports: [
            profiles_tokens_1.PROFILES_REPOSITORY,
            create_profile_service_1.CreateProfileService,
            update_profile_service_1.UpdateProfileService,
            find_profile_by_unique_id_service_1.FindProfileByUniqueIdService,
            find_profile_by_email_service_1.FindProfileByEmailService,
            find_profile_by_document_service_1.FindProfileByDocumentService,
            get_all_profiles_service_1.GetAllProfilesService,
            validate_profile_email_uniqueness_service_1.ValidateProfileEmailUniquenessService,
        ],
    })
], ProfilesModule);
//# sourceMappingURL=profiles.module.js.map