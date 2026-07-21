import { Module } from '@nestjs/common';

import { ApiCredentialsModule } from '../../modules/api-credentials/api-credentials.module';

import { CreateGatewayCardTokenController } from './create-gateway-card-token.controller';
import { CreateGatewayCardTokenUseCase } from './create-gateway-card-token.use-case';

@Module({
  imports: [ApiCredentialsModule],
  controllers: [CreateGatewayCardTokenController],
  providers: [CreateGatewayCardTokenUseCase],
  exports: [CreateGatewayCardTokenUseCase],
})
export class CreateGatewayCardTokenModule {}