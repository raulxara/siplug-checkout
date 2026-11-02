import { Injectable, ForbiddenException } from '@nestjs/common';
import { GetAuthContextUseCase } from '../../../use-cases/get-auth-context/get-auth-context.use-case';
import { ResolveActorAuthorizationService } from '../../security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { ResolveActorAuthorizationDtoIn } from '../../security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in';
@Injectable()
export class GatewaySettingAuthorizationService {
  constructor(
    private readonly identity: GetAuthContextUseCase,
    private readonly authorization: ResolveActorAuthorizationService,
  ) {}
  async exec(token: string, action: string) {
    const context = await this.identity.exec(token);
    try {
      await this.authorization.exec(
        new ResolveActorAuthorizationDtoIn({
          token,
          requiredEntity: 'api_credentials',
          requiredAction: action,
        }),
      );
    } catch {
      throw new ForbiddenException();
    }
    return context;
  }
}
