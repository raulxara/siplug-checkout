import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infra/database/prisma/prisma.service';
@Injectable()
export class CouponRenewalsRepository {
  constructor(private readonly db: PrismaService) {}
  pending() {
    return this.db.checkoutSession.findMany({
      where: {
        config: { path: '$.couponAdjustmentStatus', equals: 'pending' },
      },
      orderBy: { updated_at: 'asc' },
      take: 100,
      include: { gateway: true, api_credential: true },
    });
  }
  subscription(officeId: string, clientId: string, reference: string) {
    return this.db.subscription.findFirst({
      where: {
        office_id: officeId,
        client_id: clientId,
        external_reference: reference,
      },
      include: {
        invoices: {
          where: { status: 'paid' },
          orderBy: { id: 'asc' },
          take: 1,
        },
      },
    });
  }
  async touched(id: string) {
    await this.db.checkoutSession.update({
      where: { unique_id: id },
      data: { updated_at: new Date() },
    });
  }
  async complete(sessionId: string, subscriptionId: string, amount: number) {
    await this.db.$transaction(async (tx) => {
      const session = await tx.checkoutSession.findUniqueOrThrow({
        where: { unique_id: sessionId },
      });
      const sub = await tx.subscription.findFirstOrThrow({
        where: {
          unique_id: subscriptionId,
          office_id: session.office_id,
          client_id: session.client_id,
        },
      });
      await tx.subscription.update({
        where: { unique_id: sub.unique_id },
        data: { amount },
      });
      if (sub.subscription_plan_id)
        await tx.subscriptionPlan.update({
          where: { unique_id: sub.subscription_plan_id },
          data: { amount },
        });
      await tx.checkoutSession.update({
        where: { unique_id: sessionId },
        data: {
          config: {
            ...(session.config as Record<string, unknown>),
            couponAdjustmentStatus: 'completed',
            couponAdjustedAt: new Date().toISOString(),
          } as never,
        },
      });
    });
  }
}
