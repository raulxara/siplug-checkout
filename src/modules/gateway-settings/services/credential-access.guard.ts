import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GetAuthContextUseCase } from '../../../use-cases/get-auth-context/get-auth-context.use-case';
import { ResolveActorAuthorizationService } from '../../security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { ResolveActorAuthorizationDtoIn } from '../../security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in';
import { PrismaService } from '../../../infra/database/prisma/prisma.service';
@Injectable()
export class CredentialAccessGuard implements CanActivate {
  constructor(
    private readonly identity: GetAuthContextUseCase,
    private readonly authorization: ResolveActorAuthorizationService,
    private readonly db: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<{
      headers: Record<string, string>;
      body: Record<string, unknown>;
      path: string;
    }>();
    const match = /^Bearer ([^\s]{1,4096})$/i.exec(
      req.headers.authorization ?? '',
    );
    if (!match) throw new UnauthorizedException();
    const actor = await this.identity.exec(match[1]);
    const body = req.body ?? {};
    const action = req.path.endsWith('/register')
      ? 'registerApiCredential'
      : req.path.endsWith('/update')
        ? 'updateApiCredential'
        : 'listApiCredentialByOfficeId';
    try {
      await this.authorization.exec(
        new ResolveActorAuthorizationDtoIn({
          token: match[1],
          requiredEntity: 'api_credentials',
          requiredAction: action,
        }),
      );
    } catch {
      throw new ForbiddenException();
    }
    if (body.officeId && body.officeId !== actor.officeId)
      throw new ForbiddenException();
    if (body.clientId) {
      const client = await this.db.client.findFirst({
        where: { unique_id: String(body.clientId), office_id: actor.officeId },
      });
      if (!client) throw new ForbiddenException();
    }
    const id = body.apiCredentialId ?? body._id;
    if (id) {
      const row = await this.db.apiCredential.findFirst({
        where: { unique_id: String(id), office_id: actor.officeId },
      });
      if (!row) throw new ForbiddenException();
      if (
        row.gateway_id &&
        ['registerApiCredential', 'updateApiCredential'].includes(action)
      )
        throw new ForbiddenException(
          'Use gateway-settings para configurar gateways.',
        );
    }
    if (
      body.gatewayId &&
      ['registerApiCredential', 'updateApiCredential'].includes(action)
    )
      throw new ForbiddenException(
        'Use gateway-settings para configurar gateways.',
      );
    body.officeId = actor.officeId;
    body.token = match[1];
    return true;
  }
}
