import { Module } from '@nestjs/common';

import { ApiCredentialsModule } from '../../modules/api-credentials/api-credentials.module';
import { DevPicPayTemporaryCardTokenPageController } from './dev-picpay-temporary-card-token-page.controller';
import { DevPicPayTemporaryCardTokenPageUseCase } from './dev-picpay-temporary-card-token-page.use-case';

@Module({
  imports: [ApiCredentialsModule],
  controllers: [DevPicPayTemporaryCardTokenPageController],
  providers: [DevPicPayTemporaryCardTokenPageUseCase],
  exports: [DevPicPayTemporaryCardTokenPageUseCase],
})
export class DevPicPayTemporaryCardTokenPageModule {}