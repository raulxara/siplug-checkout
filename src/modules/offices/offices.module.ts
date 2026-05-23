import { Module } from '@nestjs/common';
import { BuildChangesHistoryService } from '../../common/services/changes-history/build-changes-history.service';
import { OfficesRepository } from './repositories/offices.repository';
import { CreateOfficeService } from './services/create-office/create-office.service';
import { FindOfficeBySlugService } from './services/find-office-by-slug/find-office-by-slug.service';
import { FindOfficeByUniqueIdService } from './services/find-office-by-unique-id/find-office-by-unique-id.service';
import { GetAllOfficesService } from './services/get-all-offices/get-all-offices.service';
import { UpdateOfficeService } from './services/update-office/update-office.service';
import { OFFICES_REPOSITORY } from './tokens/offices.tokens';

@Module({
  providers: [
    {
      provide: OFFICES_REPOSITORY,
      useClass: OfficesRepository,
    },
    BuildChangesHistoryService,
    CreateOfficeService,
    UpdateOfficeService,
    FindOfficeByUniqueIdService,
    FindOfficeBySlugService,
    GetAllOfficesService,
  ],
  exports: [
    OFFICES_REPOSITORY,
    CreateOfficeService,
    UpdateOfficeService,
    FindOfficeByUniqueIdService,
    FindOfficeBySlugService,
    GetAllOfficesService,
  ],
})
export class OfficesModule {}