import {
  Injectable,
  ForbiddenException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../infra/database/prisma/prisma.service';
import { SyncCompanyProfileRequest } from './sync-company-profile.request';
@Injectable()
export class CompanyProfilesRepository {
  constructor(private readonly db: PrismaService) {}
  async sync(
    actor: { officeId: string; clientId: string; userCustomerId: string },
    f: SyncCompanyProfileRequest,
    administrator: boolean,
  ) {
    if (actor.officeId !== f.expectedOffice) throw new ForbiddenException();
    return this.db.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM offices WHERE _id = ${actor.officeId} FOR UPDATE`;
      const o = await tx.office.findFirst({
        where: { unique_id: actor.officeId, status: 'active' },
      });
      if (!o) throw new NotFoundException();
      const c = (
        o.config && typeof o.config === 'object' && !Array.isArray(o.config)
          ? o.config
          : {}
      ) as Record<string, Prisma.JsonValue>;
      if (
        !administrator &&
        !(c.userId === actor.clientId && c.customerId === actor.userCustomerId)
      )
        throw new ForbiddenException();
      const saved = (c.company_profile ?? {}) as Record<
        string,
        Prisma.JsonValue
      >;
      if (
        Number(saved.version ?? 0) > f.version ||
        (saved.version === f.version && saved.revision !== f.revision)
      )
        throw new ConflictException();
      const { expectedOffice, ...profile } = f;
      const a = f.address;
      await tx.office.update({
        where: { unique_id: actor.officeId },
        data: {
          name: f.name,
          address_street: a.street ?? '',
          address_number: a.number ?? '',
          address_complement: a.complement ?? '',
          address_neighborhood: a.district ?? '',
          address_city: a.city ?? '',
          address_state: a.state ?? '',
          address_country: a.country,
          config: JSON.parse(
            JSON.stringify({ ...c, company_profile: profile }),
          ) as Prisma.InputJsonValue,
        },
      });
      return { officeId: expectedOffice, revision: f.revision };
    });
  }
}
