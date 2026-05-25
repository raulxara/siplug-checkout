import { Module } from '@nestjs/common';
import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { OfficesModule } from '../../modules/offices/offices.module';
import { PositionsModule } from '../../modules/positions/positions.module';
import { SecurityModule } from '../../modules/security/security.module';
import { RegisterPositionController } from './register-position.controller';
import { RegisterPositionUseCase } from './register-position.use-case';

@Module({
  imports: [
    OfficesModule,
    PositionsModule,
    SecurityModule,
    UseCaseSupportModule,
  ],
  controllers: [RegisterPositionController],
  providers: [RegisterPositionUseCase],
  exports: [RegisterPositionUseCase],
})
export class RegisterPositionModule {}