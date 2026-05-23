import type { ClientEntity } from '../../../entities/client.entity';
export declare class CreateClientDtoOut {
    readonly id: number;
    readonly _id: string;
    readonly officeId: string | null;
    readonly customerId: string | null;
    readonly userType: string;
    readonly username: string;
    readonly config: Record<string, unknown> | null;
    readonly changesHistory: Array<Record<string, unknown>> | null;
    readonly status: string;
    readonly createdAt: string | null;
    readonly updatedAt: string | null;
    constructor(id: number, _id: string, officeId: string | null, customerId: string | null, userType: string, username: string, config: Record<string, unknown> | null, changesHistory: Array<Record<string, unknown>> | null, status: string, createdAt: string | null, updatedAt: string | null);
    static fromEntity(entity: ClientEntity): CreateClientDtoOut;
}
