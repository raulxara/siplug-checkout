import { BadRequestException } from '@nestjs/common';
import { createHash } from 'node:crypto';
import { HostedOrderRequest } from '../../../use-cases/hosted-orders/dtos/hosted-order.request';
import { HostedOrderResult } from '../entities/hosted-order.entity';
/** Pure billing policy. Each payment retains its own idempotency and provider authorization. */
export class MixedBillingService {
  static childId(parent: string): string {
    const h = createHash('sha256')
      .update('siplug:recurring:' + parent)
      .digest('hex');
    return `${h.slice(0, 8)}-${h.slice(8, 12)}-4${h.slice(13, 16)}-a${h.slice(17, 20)}-${h.slice(20, 32)}`;
  }
  static split(
    input: HostedOrderRequest,
  ): [HostedOrderRequest, HostedOrderRequest] {
    const recurring = input.items.filter((i) => i.paymentType === 'recurring');
    const once = input.items.filter((i) => i.paymentType === 'one_time');
    const discount = input.recurringDiscount ?? 0;
    if (
      recurring.length !== 1 ||
      recurring[0].quantity !== 1 ||
      !once.length ||
      recurring.length + once.length !== input.items.length ||
      discount > (input.discount ?? 0) ||
      input.items.some((i) => i.totalAmount !== i.unitAmount * i.quantity) ||
      input.items.reduce((n, i) => n + i.totalAmount, 0) !== input.amount
    )
      throw new BadRequestException('MIXED_BILLING_INVALID');
    const make = (
      items: typeof once,
      mode: 'one_time' | 'recurring',
      id: string,
      d: number,
    ): HostedOrderRequest => ({
      ...input,
      orderId: id,
      items,
      paymentType: mode,
      amount: items.reduce((n, i) => n + i.totalAmount, 0),
      discount: d,
      recurringDiscount: undefined,
      cuponId: d > 0 ? input.cuponId : null,
      couponRecurrence: d > 0 ? input.couponRecurrence : null,
    });
    return [
      make(once, 'one_time', input.orderId, (input.discount ?? 0) - discount),
      make(recurring, 'recurring', this.childId(input.orderId), discount),
    ];
  }
  static combine(
    first: HostedOrderResult,
    second: HostedOrderResult | null,
    total: number,
  ): HostedOrderResult {
    const paidFirst = first.status === 'paid',
      paidSecond = second?.status === 'paid';
    const reversal = [first.status, second?.status].find(
      (s) => s === 'refunded' || s === 'chargeback',
    );
    const done = paidFirst && paidSecond;
    const current = paidFirst ? second : first;
    const failed =
      current &&
      ['failed', 'rejected', 'expired', 'canceled'].includes(current.status);
    return {
      ...first,
      amount: total,
      status:
        reversal ??
        (done
          ? 'paid'
          : paidFirst || paidSecond
            ? 'partially_paid'
            : failed
              ? current!.status
              : 'pending'),
      checkoutUrl:
        done || reversal || failed || !second ? null : (current?.checkoutUrl ?? null),
      subscriptionId: second?.subscriptionId ?? null,
      subscriptionStatus: second?.subscriptionStatus ?? null,
      paidAt: done ? second!.paidAt : null,
      validUntil: second?.validUntil ?? null,
      renewalId: second?.renewalId ?? null,
      paymentSteps: [
        { kind: 'one_time', amount: first.amount, status: first.status },
        {
          kind: 'recurring',
          amount: second?.amount ?? total - first.amount,
          status: second?.status ?? 'processing',
        },
      ],
      nextPaymentType:
        done || reversal ? null : paidFirst ? 'recurring' : 'one_time',
    };
  }
}
