import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../infra/database/prisma/prisma.service';
import { SyncOwnProfileRequest } from './sync-own-profile.request';
@Injectable()
export class OwnProfilesRepository {
  constructor(private readonly db: PrismaService) {}
  async sync(
    actor: { officeId: string; clientId: string; userCustomerId: string },
    f: SyncOwnProfileRequest,
  ) {
    return this.db.$transaction(async (tx) => {
      const c = await tx.userCustomer.findFirst({
        where: {
          unique_id: actor.userCustomerId,
          client_id: actor.clientId,
          status: 'active',
        },
        include: { profile: true, client: true },
      });
      if (
        !c ||
        c.client.office_id !== actor.officeId ||
        c.profile.status !== 'active' ||
        c.client.status !== 'active'
      )
        throw new NotFoundException();
      if (
        (await tx.client.findFirst({
          where: { username: f.email, unique_id: { not: actor.clientId } },
        })) ||
        (await tx.profile.findFirst({
          where: { email: f.email, unique_id: { not: c.profile_id } },
        }))
      )
        throw new ConflictException('PROFILE_EMAIL_CONFLICT');
      const config =
        c.profile.config &&
        typeof c.profile.config === 'object' &&
        !Array.isArray(c.profile.config)
          ? c.profile.config
          : {};
      const b = f.details.billing;
      await tx.profile.update({
        where: { unique_id: c.profile_id },
        data: {
          first_name: f.firstName,
          last_name: f.lastName,
          email: f.email,
          phone: f.phone,
          address_street: b.street,
          address_number: b.number,
          address_complement: b.complement,
          address_neighborhood: b.district,
          address_city: b.city,
          address_state: b.state,
          address_country: b.country,
          config: JSON.parse(
            JSON.stringify({
              ...config,
              account_profile: { ...f.details, revision: f.revision },
            }),
          ) as Prisma.InputJsonValue,
        },
      });
      await tx.client.update({
        where: { unique_id: actor.clientId },
        data: { username: f.email },
      });
      return { subject: actor.clientId, revision: f.revision };
    });
  }
}
