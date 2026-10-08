import {
  Body,
  Controller,
  Get,
  Header,
  Headers,
  Put,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GetCheckoutGeneralSettingsUseCase } from './get-checkout-general-settings.use-case';
import { SaveCheckoutGeneralSettingsUseCase } from './save-checkout-general-settings.use-case';
import { SaveCheckoutGeneralSettingsDtoIn } from './dtos/save-checkout-general-settings.dto-in';
@Controller('checkout-settings')
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
)
export class CheckoutGeneralSettingsController {
  constructor(
    private readonly reading: GetCheckoutGeneralSettingsUseCase,
    private readonly saving: SaveCheckoutGeneralSettingsUseCase,
  ) {}
  private token(auth?: string) {
    const match = /^Bearer ([^\s]{1,4096})$/i.exec(auth ?? '');
    if (!match) throw new UnauthorizedException();
    return match[1];
  }
  @Get('general') @Header('Cache-Control', 'no-store') read(
    @Headers('authorization') auth?: string,
  ) {
    return this.reading.exec(this.token(auth));
  }
  @Put('general') @Header('Cache-Control', 'no-store') save(
    @Body() input: SaveCheckoutGeneralSettingsDtoIn,
    @Headers('authorization') auth?: string,
  ) {
    return this.saving.exec(this.token(auth), input);
  }
}
