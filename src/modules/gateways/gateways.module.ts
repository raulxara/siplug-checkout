import { Module } from '@nestjs/common';
import { BuildChangesHistoryService } from '../../common/services/changes-history/build-changes-history.service';
import { GatewaysRepository } from './repositories/gateways.repository';
import { CreateGatewayService } from './services/create-gateway/create-gateway.service';
import { FindGatewayBySlugService } from './services/find-gateway-by-slug/find-gateway-by-slug.service';
import { FindGatewayByUniqueIdService } from './services/find-gateway-by-unique-id/find-gateway-by-unique-id.service';
import { GetAllGatewaysService } from './services/get-all-gateways/get-all-gateways.service';
import { UpdateGatewayService } from './services/update-gateway/update-gateway.service';
import { ValidateGatewaySlugUniquenessService } from './services/validate-gateway-slug-uniqueness/validate-gateway-slug-uniqueness.service';
import { GATEWAYS_REPOSITORY } from './tokens/gateways.tokens';

@Module({
  providers: [
    {
      provide: GATEWAYS_REPOSITORY,
      useClass: GatewaysRepository,
    },
    BuildChangesHistoryService,
    CreateGatewayService,
    UpdateGatewayService,
    FindGatewayByUniqueIdService,
    FindGatewayBySlugService,
    GetAllGatewaysService,
    ValidateGatewaySlugUniquenessService,
  ],
  exports: [
    GATEWAYS_REPOSITORY,
    CreateGatewayService,
    UpdateGatewayService,
    FindGatewayByUniqueIdService,
    FindGatewayBySlugService,
    GetAllGatewaysService,
    ValidateGatewaySlugUniquenessService,
  ],
})
export class GatewaysModule {}