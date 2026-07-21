import { Module } from '@nestjs/common';
import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { GatewaysModule } from '../../modules/gateways/gateways.module';
import { SecurityModule } from '../../modules/security/security.module';
import { UpdateGatewayController } from './update-gateway.controller';
import { UpdateGatewayUseCase } from './update-gateway.use-case';

@Module({
  imports: [GatewaysModule, SecurityModule, UseCaseSupportModule],
  controllers: [UpdateGatewayController],
  providers: [UpdateGatewayUseCase],
  exports: [UpdateGatewayUseCase],
})
export class UpdateGatewayModule {}