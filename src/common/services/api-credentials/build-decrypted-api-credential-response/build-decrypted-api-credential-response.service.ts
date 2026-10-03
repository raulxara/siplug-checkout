import { Injectable } from '@nestjs/common';
import type { ApiCredentialRow } from '../../../../modules/api-credentials/entities/api-credentials-repository.interface';
@Injectable()
export class BuildDecryptedApiCredentialResponseService {
 exec(row:ApiCredentialRow):Record<string,unknown>{return {_id:row._id,officeId:row.officeId,clientId:row.clientId,gatewayId:row.gatewayId,name:row.name,slug:row.slug,provider:row.provider,environment:row.environment,status:row.status,tokenConfigured:!!row.token,createdAt:row.createdAt,updatedAt:row.updatedAt};}
}
