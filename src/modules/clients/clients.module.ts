import { Module } from '@nestjs/common';
import { BuildChangesHistoryService } from '../../common/services/changes-history/build-changes-history.service';
import { HashPasswordService } from '../../common/services/security/hash-password.service';
import { ClientsRepository } from './repositories/clients.repository';
import { CreateClientService } from './services/create-client/create-client.service';
import { FindClientByUniqueIdService } from './services/find-client-by-unique-id/find-client-by-unique-id.service';
import { FindClientByUsernameService } from './services/find-client-by-username/find-client-by-username.service';
import { GetAllClientsByOfficeIdService } from './services/get-all-clients-by-office-id/get-all-clients-by-office-id.service';
import { GetAllClientsService } from './services/get-all-clients/get-all-clients.service';
import { UpdateClientService } from './services/update-client/update-client.service';
import { CLIENTS_REPOSITORY } from './tokens/clients.tokens';

@Module({
  providers: [
    {
      provide: CLIENTS_REPOSITORY,
      useClass: ClientsRepository,
    },
    BuildChangesHistoryService,
    HashPasswordService,
    CreateClientService,
    UpdateClientService,
    FindClientByUniqueIdService,
    FindClientByUsernameService,
    GetAllClientsService,
    GetAllClientsByOfficeIdService,
  ],
  exports: [
    CLIENTS_REPOSITORY,
    CreateClientService,
    UpdateClientService,
    FindClientByUniqueIdService,
    FindClientByUsernameService,
    GetAllClientsService,
    GetAllClientsByOfficeIdService,
  ],
})
export class ClientsModule {}