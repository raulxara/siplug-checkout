import { Injectable } from '@nestjs/common';
import { GetAuthContextUseCase } from '../../use-cases/get-auth-context/get-auth-context.use-case';
import { ResolveActorAuthorizationService } from '../security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { ResolveActorAuthorizationDtoIn } from '../security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in';
import { FiscalPaymentsRepository } from './fiscal-payments.repository';
import { FiscalPaymentsDto } from './fiscal-payments.dto';
@Injectable()
export class FiscalPaymentsUseCase {
  constructor(
    private readonly identity: GetAuthContextUseCase,
    private readonly auth: ResolveActorAuthorizationService,
    private readonly repository: FiscalPaymentsRepository,
  ) {}
  async exec(token: string, input: FiscalPaymentsDto) {
    await this.auth.exec(
      new ResolveActorAuthorizationDtoIn({
        token,
        requiredAction: 'listCheckoutSessionsByOfficeId',
        requiredEntity: 'checkout_sessions',
      }),
    );
    const actor = await this.identity.exec(token);
    return (
      input.source === 'invoices'
        ? this.repository.invoices.bind(this.repository)
        : this.repository.list.bind(this.repository)
    )(actor.officeId, actor.clientId, new Date(input.since), input.page ?? 1);
  }
}
