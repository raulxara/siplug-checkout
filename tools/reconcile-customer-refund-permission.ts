import { randomUUID } from 'node:crypto';
import { PrismaService } from '../src/infra/database/prisma/prisma.service';
// Explicit repair for a managed company's integration role. Never grants administrator access.
const officeId = process.argv.find((x) => x.startsWith('--office='))?.slice(9);
const apply = process.argv.includes('--apply');
if (!officeId || !/^[a-f0-9-]{36}$/i.test(officeId))
  throw new Error('Specify --office=<UUID>; preview is the default.');
const db = new PrismaService();
(async () => {
  await db.$transaction(
    async (tx) => {
      const office = await tx.office.findUnique({
        where: { unique_id: officeId },
      });
      const config = office?.config as Record<string, unknown> | null;
      if (
        !office ||
        office.status !== 'active' ||
        !process.env.SIPLUG_PROVISIONING_OFFICE_ID ||
        config?.source !== process.env.SIPLUG_PROVISIONING_OFFICE_ID ||
        typeof config.customerId !== 'string'
      )
        throw new Error('Not an active managed company');
      await tx.$queryRaw`SELECT _id FROM offices WHERE _id=${officeId} FOR UPDATE`;
      const customer = await tx.userCustomer.findUnique({
        where: { unique_id: config.customerId },
      });
      const position = await tx.position.findFirst({
        where: { office_id: officeId, slug: 'customer', status: 'active' },
      });
      if (
        !customer ||
        customer.status !== 'active' ||
        !position ||
        !(await tx.userPosition.findFirst({
          where: {
            user_customer_id: customer.unique_id,
            position_id: position.unique_id,
            status: 'active',
          },
        }))
      )
        throw new Error('Managed membership missing');
      const entity = 'payment_refunds',
        action = 'refundOrderPayment';
      let permission = await tx.permission.findFirst({
        where: { office_id: officeId, entity, action },
      });
      if (permission && permission.status !== 'active')
        throw new Error(
          'Permission explicitly disabled; manual review required',
        );
      const link = permission
        ? await tx.positionPermission.findFirst({
            where: {
              position_id: position.unique_id,
              permission_id: permission.unique_id,
            },
          })
        : null;
      if (link && link.status !== 'active')
        throw new Error(
          'Permission link explicitly disabled; manual review required',
        );
      if (apply) {
        permission ??= await tx.permission.create({
          data: {
            unique_id: randomUUID(),
            office_id: officeId,
            name: action,
            slug: entity + '.' + action,
            entity,
            action,
            status: 'active',
          },
        });
        if (!link)
          await tx.positionPermission.create({
            data: {
              unique_id: randomUUID(),
              position_id: position.unique_id,
              permission_id: permission.unique_id,
              status: 'active',
            },
          });
      }
      console.log(
        JSON.stringify({
          officeId,
          entity,
          action,
          missing: !link,
          applied: apply,
        }),
      );
    },
    { maxWait: 15000, timeout: 15000 },
  );
})()
  .catch((e) => {
    console.error(e.message);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
