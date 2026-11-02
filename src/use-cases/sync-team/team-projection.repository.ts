import {
  Injectable,
  ForbiddenException,
  ConflictException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { randomUUID, randomBytes, createHash } from 'crypto';
import { PrismaService } from '../../infra/database/prisma/prisma.service';
import { SyncTeamRequest } from './sync-team.request';
import { teamPermissions } from './team-permission-map';
const object = (
  v: Prisma.JsonValue | null | undefined,
): Record<string, Prisma.JsonValue | undefined> =>
  v && typeof v === 'object' && !Array.isArray(v) ? v : {};
const strings = (v: Prisma.JsonValue | undefined): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];
@Injectable()
export class TeamProjectionRepository {
  constructor(private readonly db: PrismaService) {}
  async sync(
    actor: { officeId: string; clientId: string; userCustomerId: string },
    f: SyncTeamRequest,
    administrator: boolean,
  ) {
    if (actor.officeId !== f.expectedOffice) throw new ForbiddenException();
    return this.db.$transaction(
      async (tx) => {
        await tx.$queryRaw`SELECT id FROM offices WHERE _id = ${actor.officeId} FOR UPDATE`;
        const o = await tx.office.findFirst({
          where: { unique_id: actor.officeId, status: 'active' },
        });
        if (!o) throw new NotFoundException();
        const c = object(o.config);
        if (
          !administrator &&
          !(
            c.userId === actor.clientId && c.customerId === actor.userCustomerId
          )
        )
          throw new ForbiddenException();
        const saved = object(c.team_projection);
        const hash = createHash('sha256')
          .update(JSON.stringify(f))
          .digest('hex');
        if (
          Number(saved.version ?? 0) > f.version ||
          (saved.version === f.version && saved.revision !== f.revision)
        )
          throw new ConflictException();
        if (saved.revision === f.revision) {
          if (saved.hash !== hash) throw new ConflictException();
          return { officeId: actor.officeId, revision: f.revision };
        }
        const roles = f.positions.map((p) => p.id);
        for (const p of f.positions) {
          const existing = await tx.position.findUnique({
            where: { unique_id: p.id },
          });
          if (
            existing &&
            (existing.office_id !== actor.officeId ||
              existing.slug !== 'team-' + p.id)
          )
            throw new ConflictException('TEAM_POSITION_COLLISION');
          const values = {
            name: p.name,
            description: p.description ?? '',
            status: p.status,
          };
          if (existing)
            await tx.position.update({
              where: { unique_id: p.id },
              data: values,
            });
          else
            await tx.position.create({
              data: {
                ...values,
                unique_id: p.id,
                office_id: actor.officeId,
                slug: 'team-' + p.id,
              },
            });
          await tx.positionPermission.deleteMany({
            where: { position_id: p.id },
          });
          const seen = new Set<string>();
          for (const [entity, action] of teamPermissions(p.permissions)) {
            const permission = await tx.permission.findFirst({
              where: {
                entity,
                action,
                status: 'active',
                OR: [{ office_id: actor.officeId }, { office_id: null }],
              },
              orderBy: { office_id: 'desc' },
            });
            if (!permission)
              throw new UnprocessableEntityException(
                'TEAM_PERMISSION_UNAVAILABLE',
              );
            if (seen.has(permission.unique_id)) continue;
            seen.add(permission.unique_id);
            await tx.positionPermission.create({
              data: {
                unique_id: randomUUID(),
                position_id: p.id,
                permission_id: permission.unique_id,
                status: 'active',
              },
            });
          }
        }
        for (const m of f.members) {
          const existing = await tx.officeEmployee.findUnique({
            where: { unique_id: m.id },
          });
          const meta = object(existing?.config);
          if (
            existing &&
            (existing.office_id !== actor.officeId ||
              meta.teamSource !== m.userId)
          )
            throw new ConflictException('TEAM_MEMBER_COLLISION');
          let clientId = typeof meta.clientId === 'string' ? meta.clientId : '';
          let customerId =
            typeof meta.customerId === 'string' ? meta.customerId : '';
          if (!existing) {
            if (
              await tx.client.findFirst({
                where: { office_id: actor.officeId, username: m.email },
              })
            )
              throw new ConflictException('TEAM_IDENTITY_COLLISION');
            clientId = randomUUID();
            customerId = randomUUID();
            const knownProfile = await tx.profile.findFirst({
              where: { email: m.email },
            });
            if (
              knownProfile &&
              object(knownProfile.config).teamSource !== m.userId
            )
              throw new ConflictException('TEAM_PROFILE_COLLISION');
            const profileId = knownProfile?.unique_id ?? randomUUID();
            if (!knownProfile)
              await tx.profile.create({
                data: {
                  unique_id: profileId,
                  first_name: m.name,
                  last_name: '',
                  email: m.email,
                  phone: m.phone,
                  status: 'active',
                },
              });
            // These service projections cannot authenticate directly; panel identity stays in the backend.
            await tx.client.create({
              data: {
                unique_id: clientId,
                office_id: actor.officeId,
                user_type: 'employee',
                username: m.email,
                password: '!' + randomBytes(64).toString('hex'),
                status: m.status,
                config: {
                  teamSource: m.userId,
                  backendAuthenticationOnly: true,
                },
              },
            });
            await tx.userCustomer.create({
              data: {
                unique_id: customerId,
                client_id: clientId,
                profile_id: profileId,
                token: randomBytes(64).toString('hex'),
                two_fa_required: true,
                status: m.status,
              },
            });
            await tx.officeEmployee.create({
              data: {
                unique_id: m.id,
                office_id: actor.officeId,
                profile_id: profileId,
                role: 'collaborator',
                two_fa_required: true,
                status: m.status,
                config: { teamSource: m.userId, clientId, customerId },
              },
            });
          } else {
            if (!clientId || !customerId) throw new ConflictException();
            await tx.officeEmployee.update({
              where: { unique_id: m.id },
              data: { status: m.status },
            });
            await tx.client.updateMany({
              where: { unique_id: clientId, office_id: actor.officeId },
              data: { status: m.status },
            });
            await tx.userCustomer.updateMany({
              where: { unique_id: customerId, client_id: clientId },
              data: { status: m.status },
            });
            await tx.profile.update({
              where: { unique_id: existing.profile_id },
              data: { first_name: m.name, phone: m.phone },
            });
          }
          const ownedProfile = await tx.profile.findUniqueOrThrow({
            where: {
              unique_id:
                existing?.profile_id ??
                (
                  await tx.userCustomer.findUniqueOrThrow({
                    where: { unique_id: customerId },
                  })
                ).profile_id,
            },
          });
          const foreignProfile = await tx.officeEmployee.findFirst({
            where: {
              profile_id: ownedProfile.unique_id,
              NOT: { office_id: actor.officeId },
            },
          });
          if (foreignProfile)
            throw new ConflictException('TEAM_PROFILE_COLLISION');
          const collision = await tx.profile.findFirst({
            where: {
              email: m.email,
              NOT: { unique_id: ownedProfile.unique_id },
            },
          });
          if (collision) throw new ConflictException('TEAM_PROFILE_COLLISION');
          const profileConfig = object(ownedProfile.config);
          if (profileConfig.teamSource && profileConfig.teamSource !== m.userId)
            throw new ConflictException('TEAM_PROFILE_COLLISION');
          const billing = (m.profile?.details?.billing ?? {}) as Record<
            string,
            unknown
          >;
          const address: Record<string, string> = {};
          for (const [key, column] of Object.entries({
            street: 'street',
            number: 'number',
            complement: 'complement',
            district: 'neighborhood',
            city: 'city',
            state: 'state',
            country: 'country',
          })) {
            if (typeof billing[key] === 'string')
              address['address_' + column] = billing[key] as string;
          }
          await tx.profile.update({
            where: { unique_id: ownedProfile.unique_id },
            data: {
              ...address,
              first_name: m.profile?.firstName ?? m.name,
              last_name: m.profile?.lastName ?? '',
              email: m.email,
              phone: m.phone,
              config: {
                ...profileConfig,
                teamSource: m.userId,
                phone_country_code:
                  m.phoneCountryCode ??
                  profileConfig.phone_country_code ??
                  null,
                ...(m.profile?.details
                  ? {
                      account_profile: m.profile
                        .details as Prisma.InputJsonObject,
                    }
                  : {}),
              } as Prisma.InputJsonObject,
            },
          });
          const identityCollision = await tx.client.findFirst({
            where: {
              office_id: actor.officeId,
              username: m.email,
              NOT: { unique_id: clientId },
            },
          });
          if (identityCollision)
            throw new ConflictException('TEAM_IDENTITY_COLLISION');
          await tx.client.update({
            where: { unique_id: clientId },
            data: { username: m.email },
          });
          await tx.userPosition.deleteMany({
            where: {
              user_customer_id: customerId,
              position_id: { in: [...roles, ...strings(saved.positions)] },
            },
          });
          for (const role of m.positions) {
            if (!roles.includes(role)) throw new UnprocessableEntityException();
            await tx.userPosition.create({
              data: {
                unique_id: randomUUID(),
                user_customer_id: customerId,
                position_id: role,
                status: 'active',
              },
            });
          }
        }
        await tx.position.updateMany({
          where: {
            office_id: actor.officeId,
            unique_id: {
              in: strings(saved.positions).filter((id) => !roles.includes(id)),
            },
          },
          data: { status: 'inactive' },
        });
        const members = f.members.map((m) => m.id);
        for (const id of strings(saved.members).filter(
          (id) => !members.includes(id),
        )) {
          const m = await tx.officeEmployee.findFirst({
            where: { unique_id: id, office_id: actor.officeId },
          });
          if (!m) continue;
          const meta = object(m.config);
          await tx.officeEmployee.update({
            where: { unique_id: id },
            data: { status: 'inactive' },
          });
          if (typeof meta.clientId === 'string')
            await tx.client.updateMany({
              where: { unique_id: meta.clientId, office_id: actor.officeId },
              data: { status: 'inactive' },
            });
          if (typeof meta.customerId === 'string')
            await tx.userCustomer.updateMany({
              where: { unique_id: meta.customerId },
              data: { status: 'inactive' },
            });
        }
        await tx.office.update({
          where: { unique_id: actor.officeId },
          data: {
            config: {
              ...c,
              team_projection: {
                revision: f.revision,
                version: f.version,
                hash,
                positions: roles,
                members,
              },
            } as Prisma.InputJsonValue,
          },
        });
        return { officeId: actor.officeId, revision: f.revision };
      },
      { timeout: 30000 },
    );
  }
}
