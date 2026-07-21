import { CreatePositionDtoOut } from '../../../modules/positions/services/create-position/dtos/create-position.dto-out';
export declare class RegisterPositionDtoOut {
    readonly id: number;
    readonly _id: string;
    readonly officeId: string | null;
    readonly name: string;
    readonly slug: string;
    readonly description: string | null;
    readonly config: Record<string, unknown> | null;
    readonly changesHistory: Array<Record<string, unknown>> | null;
    readonly status: string;
    readonly createdAt: string | null;
    readonly updatedAt: string | null;
    constructor(id: number, _id: string, officeId: string | null, name: string, slug: string, description: string | null, config: Record<string, unknown> | null, changesHistory: Array<Record<string, unknown>> | null, status: string, createdAt: string | null, updatedAt: string | null);
    static fromCreatePositionDtoOut(dtoOut: CreatePositionDtoOut): RegisterPositionDtoOut;
}
