import { Injectable, ForbiddenException } from '@nestjs/common';
import { GetAuthContextUseCase } from '../get-auth-context/get-auth-context.use-case';
import { OwnProfilesRepository } from './own-profiles.repository';
import { SyncOwnProfileRequest } from './sync-own-profile.request';
@Injectable()
export class SyncOwnProfileUseCase {
  constructor(
    private readonly auth: GetAuthContextUseCase,
    private readonly profiles: OwnProfilesRepository,
  ) {}
  async exec(token: string, input: SyncOwnProfileRequest) {
    const actor = await this.auth.exec(token);
    if (actor.clientId !== input.expectedSubject)
      throw new ForbiddenException();
    return this.profiles.sync(actor, input);
  }
}
