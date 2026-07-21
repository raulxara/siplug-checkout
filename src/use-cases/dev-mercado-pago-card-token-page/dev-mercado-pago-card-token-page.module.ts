import { Module } from '@nestjs/common';
import { DevMercadoPagoCardTokenPageController } from './dev-mercado-pago-card-token-page.controller';

@Module({
  controllers: [DevMercadoPagoCardTokenPageController],
})
export class DevMercadoPagoCardTokenPageModule {}
