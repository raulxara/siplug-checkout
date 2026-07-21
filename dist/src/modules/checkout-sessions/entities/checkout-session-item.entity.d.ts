import { AbstractEntity } from '../../../shared/entities/abstract.entity';
import type { ICheckoutSessionItemsRepository } from './checkout-session-items-repository.interface';
export declare class CheckoutSessionItemEntity extends AbstractEntity {
    private readonly repository;
    checkoutSessionId: string;
    itemRef: string | null;
    itemType: string | null;
    name: string;
    description: string | null;
    quantity: number;
    unitAmount: number;
    totalAmount: number;
    metadata: Record<string, unknown> | null;
    config: Record<string, unknown> | null;
    changesHistory: Array<Record<string, unknown>> | null;
    constructor(repository: ICheckoutSessionItemsRepository);
    create(): Promise<CheckoutSessionItemEntity>;
}
