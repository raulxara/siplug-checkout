import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'success',
      data: {
        app: 'siplug-checkout-api',
        message: 'checkout api is running',
      },
    };
  }
}