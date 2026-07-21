import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { PaymentWebhookEventEntity } from '../entities/payment-webhook-event.entity';
import type { IPaymentWebhookEventsRepository, PaymentWebhookEventRow } from '../entities/payment-webhook-events-repository.interface';
export declare class PaymentWebhookEventsRepository implements IPaymentWebhookEventsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(entity: PaymentWebhookEventEntity): Promise<PaymentWebhookEventEntity>;
    updateByUniqueId(_id: string, data: Record<string, unknown>): Promise<PaymentWebhookEventRow>;
    findByUniqueId(_id: string): Promise<PaymentWebhookEventRow | null>;
    findByProviderAndEventId(params: {
        provider: string;
        eventId: string;
    }): Promise<PaymentWebhookEventRow | null>;
    getAllByStatus(status: string): Promise<PaymentWebhookEventRow[]>;
    private hydrateEntityFromModel;
    private toRow;
    private parseJsonObject;
    private parseJsonArray;
}
