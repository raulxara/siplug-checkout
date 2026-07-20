import { Module } from '@nestjs/common';
import { BuildChangesHistoryService } from '../../common/services/changes-history/build-changes-history.service';
import { PositionsRepository } from './repositories/positions.repository';
import { CreatePositionService } from './services/create-position/create-position.service';
import { FindPositionBySlugService } from './services/find-position-by-slug/find-position-by-slug.service';
import { FindPositionByUniqueIdService } from './services/find-position-by-unique-id/find-position-by-unique-id.service';
import { GetAllPositionsByOfficeIdService } from './services/get-all-positions-by-office-id/get-all-positions-by-office-id.service';
import { GetAllPositionsByUniqueIdsService } from './services/get-all-positions-by-unique-ids/get-all-positions-by-unique-ids.service';
import { GetAllPositionsService } from './services/get-all-positions/get-all-positions.service';
import { UpdatePositionService } from './services/update-position/update-position.service';
import { ValidatePositionSlugUniquenessService } from './services/validate-position-slug-uniqueness/validate-position-slug-uniqueness.service';
import { POSITIONS_REPOSITORY } from './tokens/positions.tokens';
import { ListPositionsByOfficeIdService } from './services/list-positions-by-office-id/list-positions-by-office-id.service';
import { UpdatePositionByUniqueIdService } from './services/update-position-by-unique-id/update-position-by-unique-id.service';

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
    ValidatePositionSlugUniquenessService,
    ListPositionsByOfficeIdService,
    UpdatePositionByUniqueIdService,
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
    ValidatePositionSlugUniquenessService,
    ListPositionsByOfficeIdService,
    UpdatePositionByUniqueIdService,
  ],
})
export class PositionsModule {}