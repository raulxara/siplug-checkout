import type { GatewayEntity } from '../../../entities/gateway.entity';
export declare class CreateGatewayDtoOut {
    readonly id: number;
    readonly _id: string;
    readonly name: string;
    readonly slug: string;
    readonly provider: string;
    readonly description: string | null;
    readonly config: Record<string, unknown> | null;
    readonly changesHistory: Array<Record<string, unknown>> | null;
    readonly status: string;
    readonly createdAt: string | null;
    readonly updatedAt: string | null;
    constructor(id: number, _id: string, name: string, slug: string, provider: string, description: string | null, config: Record<string, unknown> | null, changesHistory: Array<Record<string, unknown>> | null, status: string, createdAt: string | null, updatedAt: string | null);
    static fromEntity(entity: GatewayEntity): CreateGatewayDtoOut;
}
