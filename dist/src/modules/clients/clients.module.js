"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientsModule = void 0;
const common_1 = require("@nestjs/common");
const build_changes_history_service_1 = require("../../common/services/changes-history/build-changes-history.service");
const hash_password_service_1 = require("../../common/services/security/hash-password.service");
const clients_repository_1 = require("./repositories/clients.repository");
const create_client_service_1 = require("./services/create-client/create-client.service");
const find_client_by_unique_id_service_1 = require("./services/find-client-by-unique-id/find-client-by-unique-id.service");
const find_client_by_username_service_1 = require("./services/find-client-by-username/find-client-by-username.service");
const get_all_clients_by_office_id_service_1 = require("./services/get-all-clients-by-office-id/get-all-clients-by-office-id.service");
const get_all_clients_service_1 = require("./services/get-all-clients/get-all-clients.service");
const update_client_service_1 = require("./services/update-client/update-client.service");
const validate_client_username_uniqueness_service_1 = require("./services/validate-client-username-uniqueness/validate-client-username-uniqueness.service");
const clients_tokens_1 = require("./tokens/clients.tokens");
let ClientsModule = class ClientsModule {
};
exports.ClientsModule = ClientsModule;
exports.ClientsModule = ClientsModule = __decorate([
    (0, common_1.Module)({
        providers: [
            {
                provide: clients_tokens_1.CLIENTS_REPOSITORY,
                useClass: clients_repository_1.ClientsRepository,
            },
            build_changes_history_service_1.BuildChangesHistoryService,
            hash_password_service_1.HashPasswordService,
            create_client_service_1.CreateClientService,
            update_client_service_1.UpdateClientService,
            find_client_by_unique_id_service_1.FindClientByUniqueIdService,
            find_client_by_username_service_1.FindClientByUsernameService,
            get_all_clients_service_1.GetAllClientsService,
            get_all_clients_by_office_id_service_1.GetAllClientsByOfficeIdService,
            validate_client_username_uniqueness_service_1.ValidateClientUsernameUniquenessService,
        ],
        exports: [
            clients_tokens_1.CLIENTS_REPOSITORY,
            create_client_service_1.CreateClientService,
            update_client_service_1.UpdateClientService,
            find_client_by_unique_id_service_1.FindClientByUniqueIdService,
            find_client_by_username_service_1.FindClientByUsernameService,
            get_all_clients_service_1.GetAllClientsService,
            get_all_clients_by_office_id_service_1.GetAllClientsByOfficeIdService,
            validate_client_username_uniqueness_service_1.ValidateClientUsernameUniquenessService,
        ],
    })
], ClientsModule);
//# sourceMappingURL=clients.module.js.map