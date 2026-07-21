import { ProfileEntity } from '../../../entities/profile.entity';
export declare class CreateProfileDtoOut {
    readonly id: number;
    readonly _id: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly phone: string | null;
    readonly documentType: string | null;
    readonly documentValue: string | null;
    readonly addressStreet: string | null;
    readonly addressNumber: string | null;
    readonly addressComplement: string | null;
    readonly addressNeighborhood: string | null;
    readonly addressCity: string | null;
    readonly addressState: string | null;
    readonly addressCountry: string | null;
    readonly config: Record<string, unknown> | null;
    readonly changesHistory: Array<Record<string, unknown>> | null;
    readonly status: string;
    readonly createdAt: string | null;
    readonly updatedAt: string | null;
    constructor(id: number, _id: string, firstName: string, lastName: string, email: string, phone: string | null, documentType: string | null, documentValue: string | null, addressStreet: string | null, addressNumber: string | null, addressComplement: string | null, addressNeighborhood: string | null, addressCity: string | null, addressState: string | null, addressCountry: string | null, config: Record<string, unknown> | null, changesHistory: Array<Record<string, unknown>> | null, status: string, createdAt: string | null, updatedAt: string | null);
    static fromEntity(entity: ProfileEntity): CreateProfileDtoOut;
}
