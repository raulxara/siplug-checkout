import { Module } from '@nestjs/common';
import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { GatewaysModule } from '../../modules/gateways/gateways.module';
import { SecurityModule } from '../../modules/security/security.module';
import { RegisterGatewayController } from './register-gateway.controller';
import { RegisterGatewayUseCase } from './register-gateway.use-case';

@Module({
  imports: [GatewaysModule, SecurityModule, UseCaseSupportModule],
  controllers: [RegisterGatewayController],
  providers: [RegisterGatewayUseCase],
  exports: [RegisterGatewayUseCase],
})
export class RegisterGatewayModule {}