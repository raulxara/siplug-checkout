import { Injectable, ForbiddenException } from '@nestjs/common';
import { GetAuthContextUseCase } from '../get-auth-context/get-auth-context.use-case';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { ResolveActorAuthorizationDtoIn } from '../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in';
import { CompanyProfilesRepository } from './company-profiles.repository';
import { SyncCompanyProfileRequest } from './sync-company-profile.request';
@Injectable()
export class SyncCompanyProfileUseCase {
  constructor(
    private readonly auth: GetAuthContextUseCase,
    private readonly authorization: ResolveActorAuthorizationService,
    private readonly repository: CompanyProfilesRepository,
  ) {}
  async exec(token: string, input: SyncCompanyProfileRequest) {
    const actor = await this.auth.exec(token);
    if (actor.officeId !== input.expectedOffice) throw new ForbiddenException();
    let allowed = false;
    try {
      const result = await this.authorization.exec(
        new ResolveActorAuthorizationDtoIn({
          token,
          requiredEntity: 'offices',
          requiredAction: 'updateOffice',
        }),
      );
      allowed =
        result.allowed &&
        result.positions.length > 0 &&
        result.positions.every((p) => p.officeId === actor.officeId) &&
        (result.isAdministrator ||
          (!!result.matchedPermission &&
            (result.matchedPermission.officeId === null ||
              result.matchedPermission.officeId === actor.officeId)));
    } catch {
      /* Repository still requires the provisioned owner identity. */
    }
    return this.repository.sync(actor, input, allowed);
  }
}
