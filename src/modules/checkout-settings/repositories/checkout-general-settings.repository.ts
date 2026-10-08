import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { CheckoutGeneralSettingsService } from '../services/checkout-general-settings.service';
@Injectable()
export class CheckoutGeneralSettingsRepository {
  constructor(private readonly db: PrismaService) {}
  async read(officeId: string) {
    const office = await this.db.office.findFirst({
      where: { unique_id: officeId, status: 'active' },
    });
    if (!office) throw new NotFoundException();
    return CheckoutGeneralSettingsService.read(office.config);
  }
  async save(
    officeId: string,
    actorId: string,
    version: string,
    data: Record<string, unknown>,
  ) {
    return this.db.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT _id FROM offices WHERE _id = ${officeId} FOR UPDATE`;
      const office = await tx.office.findFirst({
        where: { unique_id: officeId, status: 'active' },
      });
      if (!office) throw new NotFoundException();
      if (
        CheckoutGeneralSettingsService.read(office.config).version !== version
      )
        throw new ConflictException(
          'Configuração alterada. Atualize a página.',
        );
      const config = {
        ...((office.config ?? {}) as Record<string, unknown>),
        checkoutSettings: { ...data, version: randomUUID() },
      };
      const history = Array.isArray(office.changes_history)
        ? office.changes_history
        : [];
      await tx.office.update({
        where: { unique_id: officeId },
        data: {
          config: config as Prisma.InputJsonValue,
          changes_history: [
            ...history.slice(-99),
            {
              action: 'checkout.settings.updated',
              actor: actorId,
              at: new Date().toISOString(),
            },
          ] as Prisma.InputJsonValue,
        },
      });
      return CheckoutGeneralSettingsService.read(config);
    });
  }
}
