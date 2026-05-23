import type { UserCustomerEntity } from '../../../entities/user-customer.entity';
export declare class CreateUserCustomerDtoOut {
    readonly id: number;
    readonly _id: string;
    readonly clientId: string;
    readonly profileId: string;
    readonly token: string;
    readonly twoFaRequired: boolean;
    readonly twoFaActive: boolean;
    readonly config: Record<string, unknown> | null;
    readonly changesHistory: Array<Record<string, unknown>> | null;
    readonly status: string;
    readonly createdAt: string | null;
    readonly updatedAt: string | null;
    constructor(id: number, _id: string, clientId: string, profileId: string, token: string, twoFaRequired: boolean, twoFaActive: boolean, config: Record<string, unknown> | null, changesHistory: Array<Record<string, unknown>> | null, status: string, createdAt: string | null, updatedAt: string | null);
    static fromEntity(entity: UserCustomerEntity): CreateUserCustomerDtoOut;
}
