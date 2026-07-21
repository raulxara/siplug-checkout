import { Module } from '@nestjs/common';

import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { PositionsModule } from '../../modules/positions/positions.module';
import { UpdatePositionByUniqueIdController } from './update-position-by-unique-id.controller';
import { UpdatePositionByUniqueIdUseCase } from './update-position-by-unique-id.use-case';

@Module({
  imports: [PositionsModule, UseCaseSupportModule],
  controllers: [UpdatePositionByUniqueIdController],
  providers: [UpdatePositionByUniqueIdUseCase],
  exports: [UpdatePositionByUniqueIdUseCase],
})
export class UpdatePositionByUniqueIdModule {}
