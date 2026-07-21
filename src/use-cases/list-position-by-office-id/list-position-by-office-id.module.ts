import { Module } from '@nestjs/common';

import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { PositionsModule } from '../../modules/positions/positions.module';
import { ListPositionByOfficeIdController } from './list-position-by-office-id.controller';
import { ListPositionByOfficeIdUseCase } from './list-position-by-office-id.use-case';

@Module({
  imports: [PositionsModule, UseCaseSupportModule],
  controllers: [ListPositionByOfficeIdController],
  providers: [ListPositionByOfficeIdUseCase],
  exports: [ListPositionByOfficeIdUseCase],
})
export class ListPositionByOfficeIdModule {}
