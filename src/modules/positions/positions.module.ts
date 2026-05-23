import { Module } from '@nestjs/common';
import { BuildChangesHistoryService } from '../../common/services/changes-history/build-changes-history.service';
import { PositionsRepository } from './repositories/positions.repository';
import { CreatePositionService } from './services/create-position/create-position.service';
import { FindPositionBySlugService } from './services/find-position-by-slug/find-position-by-slug.service';
import { FindPositionByUniqueIdService } from './services/find-position-by-unique-id/find-position-by-unique-id.service';
import { GetAllPositionsByOfficeIdService } from './services/get-all-positions-by-office-id/get-all-positions-by-office-id.service';
import { GetAllPositionsService } from './services/get-all-positions/get-all-positions.service';
import { UpdatePositionService } from './services/update-position/update-position.service';
import { GetAllPositionsByUniqueIdsService } from './services/get-all-positions-by-unique-ids/get-all-positions-by-unique-ids.service';
import { POSITIONS_REPOSITORY } from './tokens/positions.tokens';

@Module({
  providers: [
    {
      provide: POSITIONS_REPOSITORY,
      useClass: PositionsRepository,
    },
    BuildChangesHistoryService,
    CreatePositionService,
    UpdatePositionService,
    FindPositionByUniqueIdService,
    FindPositionBySlugService,
    GetAllPositionsService,
    GetAllPositionsByOfficeIdService,
    GetAllPositionsByUniqueIdsService,
  ],
  exports: [
    POSITIONS_REPOSITORY,
    CreatePositionService,
    UpdatePositionService,
    FindPositionByUniqueIdService,
    FindPositionBySlugService,
    GetAllPositionsService,
    GetAllPositionsByOfficeIdService,
    GetAllPositionsByUniqueIdsService,
  ],
})
export class PositionsModule {}