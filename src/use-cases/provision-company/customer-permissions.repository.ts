import { Prisma } from '@prisma/client';
import { randomUUID } from 'node:crypto';
// Business permissions only; no provisioning, user administration or gateway administration.
export async function grantCustomerPermissions(
  tx: Prisma.TransactionClient,
  officeId: string,
  positionId: string,
): Promise<void> {
  const catalog: Record<string, string[]> = {
    gateways: ['getAllGateways'],
    api_credentials: [
      'registerApiCredential',
      'updateApiCredential',
      'getApiCredentialsByUniqueId',
      'listApiCredentialByOfficeId',
    ],
    checkout_sessions: [
      'registerCheckoutSession',
      'updateCheckoutSession',
      'getCheckoutSessionByUniqueId',
      'listCheckoutSessions',
      'listCheckoutSessionsByOfficeId',
    ],
    payment_customers: [
      'registerPaymentCustomer',
      'updatePaymentCustomer',
      'getPaymentCustomerByUniqueId',
      'getPaymentCustomersByOfficeId',
      'listPaymentCustomers',
    ],
    payment_transactions: ['processPayment'],
    payment_refunds: ['refundOrderPayment'],
    subscription_plans: [
      'registerSubscriptionPlan',
      'listSubscriptionPlansByOfficeId',
    ],
    subscriptions: ['listSubscriptionsByOfficeId'],
    subscription_invoices: ['listSubscriptionInvoicesByOfficeId'],
    payments: ['processRecurringPayment'],
  };
  for (const [entity, actions] of Object.entries(catalog))
    for (const action of actions) {
      let permission = await tx.permission.findFirst({
        where: { office_id: officeId, entity, action, status: 'active' },
      });
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
      if (
        !(await tx.positionPermission.findFirst({
          where: {
            position_id: positionId,
            permission_id: permission.unique_id,
            status: 'active',
          },
        }))
      )
        await tx.positionPermission.create({
          data: {
            unique_id: randomUUID(),
            position_id: positionId,
            permission_id: permission.unique_id,
            status: 'active',
          },
        });
    }
}
