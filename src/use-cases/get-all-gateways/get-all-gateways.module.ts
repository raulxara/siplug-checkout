import { Module } from '@nestjs/common';
import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { GatewaysModule } from '../../modules/gateways/gateways.module';
import { SecurityModule } from '../../modules/security/security.module';
import { GetAllGatewaysController } from './get-all-gateways.controller';
import { GetAllGatewaysUseCase } from './get-all-gateways.use-case';

@Module({
  imports: [GatewaysModule, SecurityModule, UseCaseSupportModule],
  controllers: [GetAllGatewaysController],
  providers: [GetAllGatewaysUseCase],
  exports: [GetAllGatewaysUseCase],
})
export class GetAllGatewaysModule {}