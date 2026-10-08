import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ApiCredential, Prisma } from '@prisma/client';
import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { Environment } from '../entities/gateway-setting.entity';
@Injectable()
export class GatewaySettingsRepository {
  constructor(private readonly db: PrismaService) {}
  gateways() {
    return this.db.gateway.findMany({
      where: { status: 'active' },
      orderBy: { name: 'asc' },
    });
  }
  credentials(officeId: string) {
    return this.db.apiCredential.findMany({
      where: { office_id: officeId, gateway_id: { not: null } },
      orderBy: { created_at: 'desc' },
    });
  }
  async one(officeId: string, id: string) {
    const row = await this.db.apiCredential.findFirst({
      where: { unique_id: id, office_id: officeId },
    });
    if (!row) throw new NotFoundException();
    return row;
  }
  async save(
    officeId: string,
    gatewayId: string,
    environment: Environment,
    id: string | undefined,
    version: string | undefined,
    build: (
      old: ApiCredential | null,
    ) => Prisma.ApiCredentialUncheckedCreateInput,
  ) {
    return this.db.$transaction(async (tx) => {
      // Serialize all configuration writes for this tenant: deduplication and defaults are atomic.
      await tx.$queryRaw`SELECT _id FROM offices WHERE _id = ${officeId} FOR UPDATE`;
      let old: ApiCredential | null = null;
      if (id) {
        old = await tx.apiCredential.findFirst({
          where: { unique_id: id, office_id: officeId, gateway_id: gatewayId },
        });
        if (!old) throw new NotFoundException();
        if (old.updated_at.toISOString() !== version)
          throw new ConflictException(
            'Configuração alterada. Atualize a página antes de salvar.',
          );
        const previous =
          (old.config as Record<string, unknown> | null)?.environment ??
          old.environment;
        if (previous !== environment)
          throw new ConflictException(
            'Crie uma configuração separada para o outro ambiente.',
          );
      } else {
        const rows = await tx.apiCredential.findMany({
          where: { office_id: officeId, gateway_id: gatewayId },
        });
        if (
          rows.some(
            (row) =>
              ((row.config as Record<string, unknown> | null)?.environment ??
                row.environment) === environment,
          )
        )
          throw new ConflictException(
            'Já existe uma configuração neste ambiente. Atualize a página.',
          );
      }
      const updatedDefaults: Array<{
        id: string;
        version: string;
        defaultModes: string[];
      }> = [];
      const data = build(old);
      const cfg = data.config as Record<string, unknown>;
      const selected = (cfg.defaultModes ?? []) as string[];
      if (selected.length) {
        const others = await tx.apiCredential.findMany({
          where: {
            office_id: officeId,
            unique_id: { not: String(data.unique_id) },
          },
        });
        for (const row of others) {
          const c = (row.config ?? {}) as Record<string, unknown>;
          if (
            (c.environment ?? row.environment) !== environment ||
            !Array.isArray(c.defaultModes)
          )
            continue;
          const remaining = c.defaultModes.filter(
            (m) => !selected.includes(String(m)),
          );
          if (remaining.length !== c.defaultModes.length) {
            const updated = await tx.apiCredential.update({
              where: { unique_id: row.unique_id },
              data: {
                config: {
                  ...c,
                  defaultModes: remaining,
                } as Prisma.InputJsonValue,
              },
            });
            updatedDefaults.push({
              id: updated.unique_id,
              version: updated.updated_at.toISOString(),
              defaultModes: remaining.map(String),
            });
          }
        }
      }
      const credential = old
        ? tx.apiCredential.update({ where: { unique_id: old.unique_id }, data })
        : tx.apiCredential.create({ data });
      return { credential: await credential, updatedDefaults };
    });
  }
  async importCopy(
    officeId: string,
    slug: string,
    build: () => Prisma.ApiCredentialUncheckedCreateInput,
  ) {
    return this.db.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT _id FROM offices WHERE _id = ${officeId} FOR UPDATE`;
      const existing = await tx.apiCredential.findUnique({
        where: { office_id_slug: { office_id: officeId, slug } },
      });
      if (existing) return { credential: existing, created: false };
      return {
        credential: await tx.apiCredential.create({
          data: { ...build(), office_id: officeId, slug },
        }),
        created: true,
      };
    });
  }
  async connection(
    officeId: string,
    id: string,
    version: Date,
    status: string,
  ) {
    const row = await this.one(officeId, id);
    await this.db.apiCredential.updateMany({
      where: { unique_id: id, office_id: officeId, updated_at: version },
      data: {
        updated_at: version,
        config: {
          ...((row.config as Record<string, unknown>) ?? {}),
          connectionStatus: status,
          connectionCheckedAt: new Date().toISOString(),
        } as Prisma.InputJsonValue,
      },
    });
  }
}
