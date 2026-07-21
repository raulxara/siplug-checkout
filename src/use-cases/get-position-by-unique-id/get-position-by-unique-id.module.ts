import { Module } from '@nestjs/common';

import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { PositionsModule } from '../../modules/positions/positions.module';
import { GetPositionByUniqueIdController } from './get-position-by-unique-id.controller';
import { GetPositionByUniqueIdUseCase } from './get-position-by-unique-id.use-case';

@Module({
  imports: [PositionsModule, UseCaseSupportModule],
  controllers: [GetPositionByUniqueIdController],
  providers: [GetPositionByUniqueIdUseCase],
  exports: [GetPositionByUniqueIdUseCase],
})
export class GetPositionByUniqueIdModule {}
