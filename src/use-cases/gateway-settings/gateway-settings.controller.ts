import { ImportGatewaySettingUseCase } from './import-gateway-setting.use-case';
import { ImportGatewaySettingDtoIn } from './dtos/import-gateway-setting.dto-in';
import {
  Body,
  Controller,
  Get,
  Header,
  Headers,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ListGatewaySettingsUseCase } from './list-gateway-settings.use-case';
import { SaveGatewaySettingUseCase } from './save-gateway-setting.use-case';
import { VerifyGatewaySettingUseCase } from './verify-gateway-setting.use-case';
import { SaveGatewaySettingDtoIn } from './dtos/save-gateway-setting.dto-in';
@Controller('gateway-settings')
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
)
export class GatewaySettingsController {
  constructor(
    private readonly importing: ImportGatewaySettingUseCase,
    private readonly listing: ListGatewaySettingsUseCase,
    private readonly saving: SaveGatewaySettingUseCase,
    private readonly verifying: VerifyGatewaySettingUseCase,
  ) {}
  @Post('import/:gatewayId')
  @Header('Cache-Control', 'no-store')
  importCopy(
    @Param('gatewayId', new ParseUUIDPipe()) id: string,
    @Body() input: ImportGatewaySettingDtoIn,
    @Headers('authorization') auth?: string,
  ) {
    return this.importing.exec(this.token(auth), id, input);
  }
  private token(header?: string) {
    const m = /^Bearer ([^\s]{1,4096})$/i.exec(header ?? '');
    if (!m) throw new UnauthorizedException();
    return m[1];
  }
  @Get() @Header('Cache-Control', 'no-store') list(
    @Headers('authorization') auth?: string,
  ) {
    return this.listing.exec(this.token(auth));
  }
  @Put(':gatewayId') @Header('Cache-Control', 'no-store') save(
    @Param('gatewayId', new ParseUUIDPipe()) id: string,
    @Body() input: SaveGatewaySettingDtoIn,
    @Headers('authorization') auth?: string,
  ) {
    return this.saving.exec(this.token(auth), id, input);
  }
  @Post(':credentialId/verify') @Header('Cache-Control', 'no-store') verify(
    @Param('credentialId', new ParseUUIDPipe()) id: string,
    @Headers('authorization') auth?: string,
  ) {
    return this.verifying.exec(this.token(auth), id);
  }
}
