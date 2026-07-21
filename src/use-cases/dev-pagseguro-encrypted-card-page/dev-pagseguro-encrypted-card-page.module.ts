import { Module } from '@nestjs/common';

import { ApiCredentialsModule } from '../../modules/api-credentials/api-credentials.module';
import { DevPagSeguroEncryptedCardPageController } from './dev-pagseguro-encrypted-card-page.controller';
import { DevPagSeguroEncryptedCardPageUseCase } from './dev-pagseguro-encrypted-card-page.use-case';

@Module({
  imports: [ApiCredentialsModule],
  controllers: [DevPagSeguroEncryptedCardPageController],
  providers: [DevPagSeguroEncryptedCardPageUseCase],
  exports: [DevPagSeguroEncryptedCardPageUseCase],
})
export class DevPagSeguroEncryptedCardPageModule {}