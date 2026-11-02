import { Injectable, ForbiddenException } from '@nestjs/common';
import { GetAuthContextUseCase } from '../get-auth-context/get-auth-context.use-case';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { ResolveActorAuthorizationDtoIn } from '../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in';
import { TeamProjectionRepository } from './team-projection.repository';
import { SyncTeamRequest } from './sync-team.request';
@Injectable()
export class SyncTeamUseCase {
  constructor(
    private readonly auth: GetAuthContextUseCase,
    private readonly authorization: ResolveActorAuthorizationService,
    private readonly repository: TeamProjectionRepository,
  ) {}
  async exec(token: string, input: SyncTeamRequest) {
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
        result.isAdministrator &&
        result.positions.length > 0 &&
        result.positions.every((p) => p.officeId === actor.officeId);
    } catch {
      /* Repository still requires the provisioned owner identity. */
    }
    return this.repository.sync(actor, input, allowed);
  }
}
