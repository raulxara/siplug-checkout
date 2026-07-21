import type { CheckoutSessionItemEntity } from '../../../entities/checkout-session-item.entity';
export declare class CreateCheckoutSessionItemDtoOut {
    readonly id: number;
    readonly _id: string;
    readonly checkoutSessionId: string;
    readonly itemRef: string | null;
    readonly itemType: string | null;
    readonly name: string;
    readonly description: string | null;
    readonly quantity: number;
    readonly unitAmount: number;
    readonly totalAmount: number;
    readonly metadata: Record<string, unknown> | null;
    readonly config: Record<string, unknown> | null;
    readonly changesHistory: Array<Record<string, unknown>> | null;
    readonly status: string;
    readonly createdAt: string | null;
    readonly updatedAt: string | null;
    constructor(id: number, _id: string, checkoutSessionId: string, itemRef: string | null, itemType: string | null, name: string, description: string | null, quantity: number, unitAmount: number, totalAmount: number, metadata: Record<string, unknown> | null, config: Record<string, unknown> | null, changesHistory: Array<Record<string, unknown>> | null, status: string, createdAt: string | null, updatedAt: string | null);
    static fromEntity(entity: CheckoutSessionItemEntity): CreateCheckoutSessionItemDtoOut;
}
